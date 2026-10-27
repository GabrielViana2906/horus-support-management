import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

import "./css/NewTicketStyle.css";

function NewTicket() {
    const navigate = useNavigate();

    // Campos do formulário
    const [subject, setSubject] = useState("");
    const [client, setClient] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");

    // Opções selecionadas
    const [selectedType, setSelectedType] = useState("");
    const [selectedImpact, setSelectedImpact] = useState("");

    // Arquivos anexados
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Notificações
    const [toast, setToast] = useState("");
    const [errorToast, setErrorToast] = useState(false);

    const descriptionRef = useRef(null);
    const fileInputRef = useRef(null);
    const toastTimeoutRef = useRef(null);

    // Limpa o temporizador quando o componente é desmontado
    useEffect(() => {
        return () => {
            clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    // Exibe notificações temporárias
    function showToast(message, error = false) {
        setToast(message);
        setErrorToast(error);

        clearTimeout(toastTimeoutRef.current);

        toastTimeoutRef.current = setTimeout(() => {
            setToast("");
        }, 3200);
    }

    // Seleciona ou desmarca o tipo da ocorrência
    function toggleType(value) {
        setSelectedType(current =>
            current === value ? "" : value
        );
    }

    // Seleciona ou desmarca o impacto
    function toggleImpact(value) {
        setSelectedImpact(current =>
            current === value ? "" : value
        );
    }

    // Formata o texto selecionado na descrição
    function formatText(format) {
        const textarea = descriptionRef.current;

        if (!textarea) return;

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

        Array.from(files).forEach(file => {
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
            setUploadedFiles(current => [
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
        setUploadedFiles(current =>
            current.filter((_, currentIndex) =>
                currentIndex !== index
            )
        );
    }

    // Descarta o preenchimento e retorna para Home
    function handleBackHome() {
        navigate("/home");
    }

    // Validação e envio demonstrativo do formulário
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

        showToast(
            `Chamado demonstrativo enviado! Tipo: ${selectedType} · Impacto: ${selectedImpact}`
        );
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
                const searchInput = document.querySelector(
                    ".search-box input"
                );

                if (searchInput) {
                    event.preventDefault();
                    searchInput.focus();
                }
            }

            if (event.key === "/" && !isTyping) {
                const searchInput = document.querySelector(
                    ".search-box input"
                );

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
                    Chamados <span>›</span>{" "}
                    <strong>Novo Protocolo</strong>
                </div>

                <h1>Abertura de Chamado Técnico</h1>

                <section className="steps">
                    <div className="step active">
                        <span className="step-number">1</span>

                        <div>
                            <strong>
                                Informações Essenciais{" "}
                                <em>EM PREENCHIMENTO</em>
                            </strong>

                            <p>
                                Classificação, solicitante e
                                diagnóstico básico
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
                                Ativos CMDB, topologia, logs e
                                roteamento N2/N3
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
                                Assunto Resumido da Ocorrência{" "}
                                <span className="required">*</span>
                            </label>
                        </div>

                        <div className="input-wrap">
                            <span className="field-icon">☷</span>

                            <input
                                id="subject"
                                value={subject}
                                onChange={event =>
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

                            <div className="input-wrap">
                                <span className="field-icon blue">
                                    ♟
                                </span>

                                <input
                                    id="client"
                                    value={client}
                                    onChange={event =>
                                        setClient(event.target.value)
                                    }
                                    placeholder="Nome ou identificação do cliente"
                                />
                            </div>
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
                                    onChange={event =>
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
                            Tipo da Ocorrência{" "}
                            <span className="required">*</span>
                        </label>

                        <div
                            className="choice-grid"
                            id="typeChoices"
                        >
                            <button
                                type="button"
                                className={`choice ${
                                    selectedType ===
                                    "Incidente / Problema"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Incidente / Problema"
                                aria-pressed={
                                    selectedType ===
                                    "Incidente / Problema"
                                }
                                onClick={() =>
                                    toggleType(
                                        "Incidente / Problema"
                                    )
                                }
                            >
                                <span>ⓘ</span>
                                Incidente / Problema
                            </button>

                            <button
                                type="button"
                                className={`choice ${
                                    selectedType ===
                                    "Requisição de Serviço"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Requisição de Serviço"
                                aria-pressed={
                                    selectedType ===
                                    "Requisição de Serviço"
                                }
                                onClick={() =>
                                    toggleType(
                                        "Requisição de Serviço"
                                    )
                                }
                            >
                                <span>☑</span>
                                Requisição de Serviço
                            </button>

                            <button
                                type="button"
                                className={`choice ${
                                    selectedType ===
                                    "Dúvida Operacional"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Dúvida Operacional"
                                aria-pressed={
                                    selectedType ===
                                    "Dúvida Operacional"
                                }
                                onClick={() =>
                                    toggleType(
                                        "Dúvida Operacional"
                                    )
                                }
                            >
                                <span>▣</span>
                                Dúvida Operacional
                            </button>

                            <button
                                type="button"
                                className={`choice ${
                                    selectedType === "Licença"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Licença"
                                aria-pressed={
                                    selectedType === "Licença"
                                }
                                onClick={() =>
                                    toggleType("Licença")
                                }
                            >
                                <span>⚿</span>
                                Licença
                            </button>
                        </div>
                    </div>

                    {/* Impacto no negócio */}

                    <div className="field">
                        <label>
                            Impacto no Negócio (SLA){" "}
                            <span className="required">*</span>
                        </label>

                        <div
                            className="impact-grid"
                            id="impactChoices"
                        >
                            <button
                                type="button"
                                className={`impact ${
                                    selectedImpact === "Normal"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Normal"
                                aria-pressed={
                                    selectedImpact === "Normal"
                                }
                                onClick={() =>
                                    toggleImpact("Normal")
                                }
                            >
                                <strong>Normal</strong>

                                <span>
                                    Afeta apenas um colaborador,
                                    sem paralisação de processos
                                    críticos. Resposta em no máximo
                                    8h.
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`impact urgent ${
                                    selectedImpact === "Urgente"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Urgente"
                                aria-pressed={
                                    selectedImpact === "Urgente"
                                }
                                onClick={() =>
                                    toggleImpact("Urgente")
                                }
                            >
                                <strong>
                                    <i></i>
                                    Urgente
                                </strong>

                                <span>
                                    Processo parcial travado;
                                    departamento inteiro em espera
                                    de fechamento. Resposta em no
                                    máximo 4h.
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`impact critical ${
                                    selectedImpact === "Crítico"
                                        ? "selected"
                                        : ""
                                }`}
                                data-value="Crítico"
                                aria-pressed={
                                    selectedImpact === "Crítico"
                                }
                                onClick={() =>
                                    toggleImpact("Crítico")
                                }
                            >
                                <strong>
                                    <i></i>
                                    Crítico
                                </strong>

                                <span>
                                    Interrupção de operação,
                                    faturamento ou produção.
                                    Resposta em no máximo 1h.
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Descrição */}

                    <div className="field">
                        <div className="label-row">
                            <label htmlFor="description">
                                Descrição Detalhada do Problema{" "}
                                <span className="required">*</span>
                            </label>
                        </div>

                        <div className="editor">
                            <div className="caixa-edicao-texto">
                                <button
                                    type="button"
                                    data-format="bold"
                                    title="Negrito"
                                    onClick={() =>
                                        formatText("bold")
                                    }
                                >
                                    <b>B</b>
                                </button>

                                <button
                                    type="button"
                                    data-format="italic"
                                    title="Itálico"
                                    onClick={() =>
                                        formatText("italic")
                                    }
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
                                onChange={event =>
                                    setDescription(
                                        event.target.value
                                    )
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
                            Capturas de Tela, Logs e Evidências
                            Técnicas
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
                                <span className="cloud">♧</span>

                                <strong>
                                    Arraste arquivos ou clique
                                    para anexar
                                </strong>

                                <span>
                                    PNG, JPG, PDF, TXT, LOG (Máx
                                    25MB)
                                </span>

                                <span className="upload-button">
                                    ♧ Adicionar capturas ou logs
                                </span>

                                <input
                                    id="fileInput"
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".png,.jpg,.jpeg,.pdf,.txt,.log"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <div
                                className="file-list"
                                id="fileList"
                            >
                                {uploadedFiles.length === 0 ? (
                                    <div className="file-item">
                                        <div className="file-info">
                                            Nenhum arquivo anexado.
                                        </div>
                                    </div>
                                ) : (
                                    uploadedFiles.map(
                                        (file, index) => (
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
                                                        {(
                                                            file.size /
                                                            1024
                                                        ).toFixed(0)}{" "}
                                                        KB ·{" "}
                                                        {file.name
                                                            .split(".")
                                                            .pop()
                                                            .toUpperCase()}
                                                    </span>

                                                    <small>
                                                        Selecionado
                                                        para anexar
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
                                        )
                                    )
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
                        ← Home
                    </button>

                    <div className="footer-actions">
                        <button
                            type="submit"
                            form="ticketForm"
                            className="secondary-button"
                        >
                            ▷ &nbsp;Enviar Ticket Agora
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

                {/* Notificação */}

                <div
                    id="toast"
                    className={`toast ${
                        toast
                            ? `show${errorToast ? " error" : ""}`
                            : ""
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    {toast}
                </div>
            </main>

            <Footer />
        </>
    );
}

export default NewTicket;