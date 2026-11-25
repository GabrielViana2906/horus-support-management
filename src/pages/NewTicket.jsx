import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { addTicket, generateTicketId, getCustomers } from "../database/db";

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Toast from "../components/Toast/Toast";

import ToggleButtonGroup from "../components/Forms/ToggleButton/ToggleButtonGroup.jsx";
import CreateCustomerModal from "../components/Workspace/Toolbar/FeatureSet/CreateCustomerModal.jsx";

import "./css/NewTicketStyle.css";

function formatCustomerLabel(customer) {
    if (!customer) {
        return "";
    }

    return customer.empresa
        ? `${customer.nome} | ${customer.empresa}`
        : customer.nome;
}

function NewTicket() {
    const navigate = useNavigate();

    // Campos do formulário
    const [subject, setSubject] = useState("");
    const [client, setClient] = useState("");
    const [clientSearch, setClientSearch] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");
    const [customers, setCustomers] = useState(() => getCustomers());
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        left: 0,
        width: 0
    });
    const [showCreateCustomerModal, setShowCreateCustomerModal] =
        useState(false);

    // Opções selecionadas
    const [selectedType, setSelectedType] = useState("");
    const [selectedImpact, setSelectedImpact] = useState("");

    // Arquivos anexados
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Notificações
    const [toast, setToast] = useState({ message: "", type: "info", key: 0 });

    const descriptionRef = useRef(null);
    const toastTimeoutRef = useRef(null);
    const clientBoxRef = useRef(null);
    const clientMenuRef = useRef(null);
    const clientInputRef = useRef(null);

    // Opções do grupo de tipos
    const typeOptions = [
        {
            value: "Incidente / Problema",
            icon: "ⓘ",
            title: "Incidente / Problema",
            variation: "choice"
        },
        {
            value: "Requisição de Serviço",
            icon: "☑",
            title: "Requisição de Serviço",
            variation: "choice"
        },
        {
            value: "Dúvida Operacional",
            icon: "▣",
            title: "Dúvida Operacional",
            variation: "choice"
        },
        {
            value: "Licença",
            icon: "⚿",
            title: "Licença",
            variation: "choice"
        }
    ];

    // Opções do grupo de impacto
    const impactOptions = [
        {
            value: "Normal",
            title: "Normal",
            description:
                "Afeta apenas um colaborador, sem paralisação de processos críticos. Resposta em no máximo 8h.",
            variation: "impact"
        },
        {
            value: "Urgente",
            title: "Urgente",
            description:
                "Processo parcial travado; departamento inteiro em espera de fechamento. Resposta em no máximo 4h.",
            variation: "impact urgent"
        },
        {
            value: "Crítico",
            title: "Crítico",
            description:
                "Interrupção de operação, faturamento ou produção. Resposta em no máximo 1h.",
            variation: "impact critical"
        }
    ];

    // Limpa o temporizador quando o componente é desmontado
    useEffect(() => {
        return () => {
            clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    // Exibe notificações temporárias
    function showToast(message, typeOrError = "info") {
        const type =
            typeOrError === true
                ? "error"
                : typeOrError === false
                ? "success"
                : typeOrError;

        setToast((prev) => ({ message, type, key: prev.key + 1 }));

        clearTimeout(toastTimeoutRef.current);

        toastTimeoutRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, message: "" }));
        }, 3500);
    }

    // Formata o texto selecionado na descrição
    function formatText(format) {
        const textarea = descriptionRef.current;

        if (!textarea) {
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const selectedText = description.slice(start, end);

        const wrapper = format === "bold" ? "**" : "*";
        const textToFormat = selectedText || "texto";

        const formattedText =
            `${wrapper}${textToFormat}${wrapper}`;

        const newDescription =
            description.slice(0, start) +
            formattedText +
            description.slice(end);

        setDescription(newDescription);

        requestAnimationFrame(() => {
            textarea.focus();

            textarea.setSelectionRange(
                start + wrapper.length,
                start + wrapper.length + textToFormat.length
            );
        });
    }

    // Verifica e adiciona arquivos válidos
    function handleFiles(files) {
        const maxBytes = 25 * 1024 * 1024;

        const allowedExtensions =
            /\.(png|jpe?g|pdf|txt|log)$/i;

        const validFiles = [];

        Array.from(files).forEach((file) => {
            if (!allowedExtensions.test(file.name)) {
                showToast(
                    `Formato não permitido: ${file.name}`,
                    true
                );

                return;
            }

            if (file.size > maxBytes) {
                showToast(
                    `${file.name} ultrapassa o limite de 25 MB.`,
                    true
                );

                return;
            }

            validFiles.push(file);
        });

        if (validFiles.length > 0) {
            setUploadedFiles((current) => [
                ...current,
                ...validFiles
            ]);
        }
    }

    // Abre o seletor de arquivos
    function handleFileChange(event) {
        handleFiles(event.target.files);

        // Permite selecionar novamente o mesmo arquivo
        event.target.value = "";
    }

    // Trata o arraste de arquivos
    function handleDragOver(event) {
        event.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();

        // Evita desativar o destaque ao entrar em elementos internos
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
        }
    }

    function handleDrop(event) {
        event.preventDefault();

        setIsDragging(false);

        handleFiles(event.dataTransfer.files);
    }

    // Remove um arquivo da lista
    function removeFile(index) {
        setUploadedFiles((current) =>
            current.filter(
                (_, currentIndex) => currentIndex !== index
            )
        );
    }

    // Descarta o preenchimento e retorna para Home
    function handleBackHome() {
        navigate("/home");
    }

    const selectedCustomer =
        customers.find((customer) => String(customer.id) === client) || null;

    const normalizedSearch = clientSearch.trim().toLowerCase();
    const isShowingSelectedLabel =
        selectedCustomer &&
        clientSearch === formatCustomerLabel(selectedCustomer);

    const filteredCustomers =
        !normalizedSearch || isShowingSelectedLabel
            ? customers
            : customers.filter((customer) =>
                  formatCustomerLabel(customer)
                      .toLowerCase()
                      .includes(normalizedSearch)
              );

    function updateDropdownPosition() {
        if (!clientBoxRef.current) {
            return;
        }

        const rect = clientBoxRef.current.getBoundingClientRect();

        setDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width
        });
    }

    function openClientDropdown() {
        updateDropdownPosition();
        setIsClientDropdownOpen(true);
    }

    function toggleClientDropdown() {
        if (isClientDropdownOpen) {
            setIsClientDropdownOpen(false);
            return;
        }

        openClientDropdown();
        clientInputRef.current?.focus();
    }

    function handleClientInputChange(event) {
        const value = event.target.value;

        setClientSearch(value);
        setClient("");
        openClientDropdown();
    }

    function handleSelectCustomer(customer) {
        setClient(String(customer.id));
        setClientSearch(formatCustomerLabel(customer));
        setContact(customer.email || "");
        setIsClientDropdownOpen(false);
    }

    function handleOpenCreateCustomer() {
        setIsClientDropdownOpen(false);
        setShowCreateCustomerModal(true);
    }

    function handleCustomerCreated(newCustomer) {
        setCustomers(getCustomers());
        setClient(String(newCustomer.id));
        setClientSearch(formatCustomerLabel(newCustomer));
        setContact(newCustomer.email || "");
        showToast("Cliente cadastrado com sucesso!");
    }

    useEffect(() => {
        if (!isClientDropdownOpen) {
            return;
        }

        function handleClickOutside(event) {
            const clickedInsideBox = clientBoxRef.current?.contains(
                event.target
            );
            const clickedInsideMenu = clientMenuRef.current?.contains(
                event.target
            );

            if (!clickedInsideBox && !clickedInsideMenu) {
                setIsClientDropdownOpen(false);

                const currentSelected = customers.find(
                    (customer) => String(customer.id) === client
                );
                setClientSearch(
                    currentSelected ? formatCustomerLabel(currentSelected) : ""
                );
            }
        }

        function handleReposition() {
            updateDropdownPosition();
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [isClientDropdownOpen, client, customers]);

    // Validação e envio do formulário, salvando o ticket no localStorage
    function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;

        if (!form.reportValidity()) {
            return;
        }

        if (!selectedType) {
            showToast(
                "Selecione o tipo da ocorrência.",
                true
            );

            return;
        }

        if (!selectedImpact) {
            showToast(
                "Selecione o impacto no negócio.",
                true
            );

            return;
        }

        // Monta o objeto do ticket
        const ticket = {
            id: generateTicketId(),
            subject: subject,
            clientId: client,
            contact: contact,
            type: selectedType,
            impact: selectedImpact,
            description: description,
            status: 'Aberto',
            queue: 'Não avaliados',
            caseSummary: '',
            messages: [],
            priority: selectedImpact === 'Crítico' ? 'Alta' : selectedImpact === 'Urgente' ? 'Média' : 'Baixa',
            createdAt: new Date().toISOString()
        };

        // Adiciona o ticket na lista tickets do horus_db_v1 via camada de database
        addTicket(ticket);

        showToast(`Chamado criado com sucesso! ID: #${ticket.id}`, "success");

        // Retorna para o home/workspace após salvar
        setTimeout(() => {
            navigate('/home');
        }, 1500);
    }

    // Avanço demonstrativo para a próxima etapa
    function handleNext() {
        const form = document.getElementById("ticketForm");

        if (!form.reportValidity()) {
            return;
        }

        if (!selectedType || !selectedImpact) {
            showToast(
                "Selecione o tipo da ocorrência e o impacto.",
                true
            );

            return;
        }

        showToast(
            "Etapa 1 concluída. O detalhamento técnico pode ser implementado na próxima etapa."
        );
    }

    // Atalhos para acessar a busca do cabeçalho
    useEffect(() => {
        function handleKeyDown(event) {
            const activeElement = document.activeElement;

            const isTyping =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.isContentEditable
                );

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                const searchInput = document.querySelector(".search-bar");

                if (searchInput) {
                    event.preventDefault();
                    searchInput.focus();
                }
            }

            if (event.key === "/" && !isTyping) {
                const searchInput = document.querySelector(".search-bar");

                if (searchInput) {
                    event.preventDefault();
                    searchInput.focus();
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    return (
        <>
            <Header />

            <main className="page">
                <div className="breadcrumbs">
                    <span>
                        Área de Trabalho › <strong>Novo Chamado</strong>
                    </span>
                </div>

                <h1 className="title">
                    Abertura de Chamado Técnico
                </h1>

                <section className="steps">
                    <div className="step active">
                        <span className="step-number">1</span>

                        <div>
                            <strong>
                                Informações Essenciais{" "}
                                <em>EM PREENCHIMENTO</em>
                            </strong>

                            <p>
                                Classificação, solicitante e diagnóstico básico
                            </p>
                        </div>
                    </div>

                    <div className="step">
                        <span className="step-number">2</span>

                        <div>
                            <strong>
                                Detalhamento Técnico{" "}
                                <em className="optional">
                                    Opcional / Recomendado
                                </em>
                            </strong>

                            <p>
                                Ativos CMDB, topologia, logs e roteamento N2/N3
                            </p>
                        </div>
                    </div>
                </section>

                <form
                    id="ticketForm"
                    className="form-card"
                    onSubmit={handleSubmit}
                >
                    {/* Assunto */}

                    <div className="field">
                        <div className="label-row">
                            <label htmlFor="subject">
                                Assunto Resumido da Ocorrência
                                <span className="required"> *</span>
                            </label>
                        </div>

                        <div className="input-wrap">
                            <input
                                id="subject"
                                value={subject}
                                onChange={(event) =>
                                    setSubject(event.target.value)
                                }
                                placeholder="Descreva resumidamente o problema"
                                required
                            />
                        </div>
                    </div>

                    {/* Cliente e contato */}

                    <div className="two-columns">
                        <div className="field">
                            <label htmlFor="client">
                                Cliente
                            </label>

                            <div
                                ref={clientBoxRef}
                                className={`input-wrap client-combobox ${
                                    isClientDropdownOpen ? "open" : ""
                                }`}
                            >
                                <span className="field-icon blue">
                                    <img
                                        src="assets/user.png"
                                        alt=""
                                    />
                                </span>

                                <input
                                    id="client"
                                    ref={clientInputRef}
                                    type="text"
                                    role="combobox"
                                    aria-autocomplete="list"
                                    aria-expanded={isClientDropdownOpen}
                                    aria-controls="client-dropdown-listbox"
                                    value={clientSearch}
                                    onFocus={(event) => {
                                        openClientDropdown();
                                        if (selectedCustomer) {
                                            event.target.select();
                                        }
                                    }}
                                    onChange={handleClientInputChange}
                                    onKeyDown={(event) => {
                                        if (event.key === "Escape") {
                                            setIsClientDropdownOpen(false);
                                        }
                                    }}
                                    placeholder="Busque ou selecione um cliente"
                                    autoComplete="off"
                                />

                                <button
                                    type="button"
                                    className={`dropdown-toggle-btn ${
                                        isClientDropdownOpen ? "open" : ""
                                    }`}
                                    onClick={toggleClientDropdown}
                                    aria-label="Alternar lista de clientes"
                                    aria-expanded={isClientDropdownOpen}
                                >
                                    ▾
                                </button>
                            </div>

                            {isClientDropdownOpen &&
                                createPortal(
                                    <div
                                        ref={clientMenuRef}
                                        id="client-dropdown-listbox"
                                        role="listbox"
                                        className="client-dropdown-menu"
                                        style={{
                                            position: "fixed",
                                            top: dropdownPosition.top,
                                            left: dropdownPosition.left,
                                            width: dropdownPosition.width,
                                            zIndex: 950
                                        }}
                                    >
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={false}
                                            className="client-dropdown-option new-client"
                                            onMouseDown={(event) =>
                                                event.preventDefault()
                                            }
                                            onClick={handleOpenCreateCustomer}
                                        >
                                            <span>+ Novo Cliente</span>
                                        </button>

                                        <div className="client-dropdown-list">
                                            {filteredCustomers.length === 0 ? (
                                                <div className="client-dropdown-empty">
                                                    Nenhum cliente encontrado.
                                                </div>
                                            ) : (
                                                filteredCustomers.map(
                                                    (customer) => {
                                                        const isSelected =
                                                            String(
                                                                customer.id
                                                            ) === client;

                                                        return (
                                                            <button
                                                                key={
                                                                    customer.id
                                                                }
                                                                type="button"
                                                                role="option"
                                                                aria-selected={
                                                                    isSelected
                                                                }
                                                                className={`client-dropdown-option ${
                                                                    isSelected
                                                                        ? "selected"
                                                                        : ""
                                                                }`}
                                                                onMouseDown={(
                                                                    event
                                                                ) =>
                                                                    event.preventDefault()
                                                                }
                                                                onClick={() =>
                                                                    handleSelectCustomer(
                                                                        customer
                                                                    )
                                                                }
                                                            >
                                                                <span className="client-option-name">
                                                                    {
                                                                        customer.nome
                                                                    }
                                                                </span>
                                                                <span className="client-option-sep">
                                                                    |
                                                                </span>
                                                                <span className="client-option-company">
                                                                    {customer.empresa ||
                                                                        "Sem empresa"}
                                                                </span>
                                                            </button>
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                    </div>,
                                    document.body
                                )}
                        </div>

                        <div className="field">
                            <label htmlFor="contact">
                                Meio de Contato
                            </label>

                            <div className="input-wrap">
                                <span className="field-icon">
                                    ✉
                                </span>

                                <input
                                    id="contact"
                                    value={contact}
                                    onChange={(event) =>
                                        setContact(event.target.value)
                                    }
                                    placeholder="E-mail ou telefone para contato"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tipo da ocorrência */}

                    <div className="field">
                        <label>
                            Tipo da Ocorrência
                            <span className="required"> *</span>
                        </label>

                        <ToggleButtonGroup
                            className="choice-grid"
                            options={typeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Impacto no negócio */}

                    <div className="field">
                        <label>
                            Impacto no Negócio (SLA)
                            <span className="required"> *</span>
                        </label>

                        <ToggleButtonGroup
                            className="impact-grid"
                            options={impactOptions}
                            value={selectedImpact}
                            onChange={setSelectedImpact}
                        />
                    </div>

                    {/* Descrição */}

                    <div className="field">
                        <div className="label-row">
                            <label htmlFor="description">
                                Descrição Detalhada do Problema
                                <span className="required"> *</span>
                            </label>
                        </div>

                        <div className="editor">
                            <div className="caixa-edicao-texto">
                                <button
                                    type="button"
                                    data-format="bold"
                                    title="Negrito"
                                    onClick={() => formatText("bold")}
                                >
                                    <b>B</b>
                                </button>

                                <button
                                    type="button"
                                    data-format="italic"
                                    title="Itálico"
                                    onClick={() => formatText("italic")}
                                >
                                    <i>I</i>
                                </button>

                                <button
                                    type="button"
                                    title="Lista"
                                    onClick={() =>
                                        showToast(
                                            "A formatação de listas ainda não foi implementada."
                                        )
                                    }
                                >
                                    ☷
                                </button>

                                <button
                                    type="button"
                                    title="Inserir código"
                                    onClick={() =>
                                        showToast(
                                            "A inserção de código ainda não foi implementada."
                                        )
                                    }
                                >
                                    ▣
                                </button>

                                <button
                                    type="button"
                                    title="Link"
                                    onClick={() =>
                                        showToast(
                                            "A inserção de links ainda não foi implementada."
                                        )
                                    }
                                >
                                    ↗
                                </button>

                                <span id="charCount">
                                    {description.length} caracteres
                                </span>
                            </div>

                            <textarea
                                id="description"
                                ref={descriptionRef}
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Descreva o problema, os erros apresentados e as circunstâncias em que ocorreu."
                                required
                                maxLength={2000}
                            />
                        </div>
                    </div>

                    {/* Anexos */}

                    <div className="field">
                        <label>
                            Capturas de Tela, Logs e Evidências Técnicas
                        </label>

                        <div className="upload-layout">
                            <label
                                className={`dropzone ${
                                    isDragging ? "dragging" : ""
                                }`}
                                htmlFor="fileInput"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <span className="cloud">
                                    ♧
                                </span>

                                <strong>
                                    Arraste arquivos ou clique para anexar
                                </strong>

                                <span>
                                    PNG, JPG, PDF, TXT, LOG (Máx 25MB)
                                </span>

                                <span className="upload-button">
                                    ♧ Adicionar capturas ou logs
                                </span>

                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg,.pdf,.txt,.log"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <div className="file-list" id="fileList">
                                {uploadedFiles.length === 0 ? (
                                    <div className="file-empty">
                                        Nenhum arquivo anexado.
                                    </div>
                                ) : (
                                    uploadedFiles.map((file, index) => (
                                        <div
                                            className="file-item"
                                            key={`${file.name}-${index}`}
                                        >
                                            <div className="file-symbol">
                                                ▧
                                            </div>

                                            <div className="file-info">
                                                <strong>
                                                    {file.name}
                                                </strong>

                                                <span>
                                                    {(file.size / 1024).toFixed(0)}{" "}
                                                    KB ·{" "}
                                                    {file.name
                                                        .split(".")
                                                        .pop()
                                                        .toUpperCase()}
                                                </span>

                                                <small>
                                                    Selecionado para anexar
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="delete-file"
                                                title="Remover arquivo"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                            >
                                                ▤
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Rodapé de ações */}

                <footer className="bottom-bar">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={handleBackHome}
                    >
                        ← Área de Trabalho
                    </button>

                    <div className="footer-actions">
                        <button
                            type="submit"
                            form="ticketForm"
                            className="secondary-button"
                        >
                            ▷ &nbsp;Enviar Chamado Agora
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleNext}
                        >
                            Avançar para Detalhamento Técnico{" "}
                            <span>→</span>
                        </button>
                    </div>
                </footer>

                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3500}
                    toastKey={toast.key}
                />
            </main>

            {showCreateCustomerModal && (
                <CreateCustomerModal
                    onClose={() => setShowCreateCustomerModal(false)}
                    onCreated={handleCustomerCreated}
                />
            )}

            <Footer />
        </>
    );
}

export default NewTicket;