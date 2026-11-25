import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import {
    getTickets,
    getCustomers,
    getAgents,
    getQueues,
    getTeams,
    getCurrentUser,
    updateTicket
} from "../database/db";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Toast from "../components/Toast/Toast";

import "./css/TicketDetailsStyle.css";

const SLA_BY_IMPACT = {
    "Normal": "8h",
    "Urgente": "4h",
    "Crítico": "1h"
};

const CLOSE_STATUS_OPTIONS = ["Fechado", "Resolvido", "Paliativo"];

const WORKFLOW_STATUS_OPTIONS = [
    "Aberto",
    "Pendente",
    "Aguardando Resposta do Cliente",
    "Em Andamento",
    "Em Homologação",
    "Em Teste Interno",
    "Em Desenvolvimento"
];

function toClassName(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
}

function getInitials(name) {
    if (!name) {
        return "?";
    }

    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (first + last).toUpperCase();
}

function formatDateTime(isoString) {
    if (!isoString) {
        return "—";
    }

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function formatTime(isoString) {
    if (!isoString) {
        return "";
    }

    const date = new Date(isoString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function TicketDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentUser] = useState(() => getCurrentUser());
    const [ticket, setTicket] = useState(
        () =>
            getTickets().find((item) => String(item.id) === String(id)) || null
    );
    const [customers] = useState(() => getCustomers());
    const [agents] = useState(() => getAgents());
    const [queues] = useState(() => getQueues());
    const [teams] = useState(() => getTeams());

    const [caseSummary, setCaseSummary] = useState(
        () =>
            getTickets().find((item) => String(item.id) === String(id))
                ?.caseSummary || ""
    );
    const [newMessageText, setNewMessageText] = useState("");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [toast, setToast] = useState({ message: "", type: "info", key: 0 });

    const transferBtnRef = useRef(null);
    const closeBtnRef = useRef(null);
    const headerMenuRef = useRef(null);
    const messagesEndRef = useRef(null);
    const toastTimeoutRef = useRef(null);

    const customer = ticket
        ? customers.find(
              (item) => String(item.id) === String(ticket.clientId)
          )
        : null;

    const assignedAgent = ticket?.assignedAgentId
        ? agents.find(
              (agent) => String(agent.id) === String(ticket.assignedAgentId)
          )
        : null;

    const selectedTeam = ticket?.teamId
        ? teams.find((team) => String(team.id) === String(ticket.teamId))
        : null;

    function showToast(message, type = "info") {
        clearTimeout(toastTimeoutRef.current);
        setToast((prev) => ({ message, type, key: prev.key + 1 }));
        toastTimeoutRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, message: "" }));
        }, 3500);
    }

    useEffect(() => {
        return () => clearTimeout(toastTimeoutRef.current);
    }, []);

    useEffect(() => {
        if (!openDropdown) {
            return;
        }

        function handleClickOutside(event) {
            const triggerRef =
                openDropdown === "transfer" ? transferBtnRef : closeBtnRef;

            const clickedTrigger = triggerRef.current?.contains(event.target);
            const clickedMenu = headerMenuRef.current?.contains(event.target);

            if (!clickedTrigger && !clickedMenu) {
                setOpenDropdown(null);
            }
        }

        function handleReposition() {
            const triggerRef =
                openDropdown === "transfer" ? transferBtnRef : closeBtnRef;
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setDropdownPos({
                    top: rect.bottom + 4,
                    left: rect.left
                });
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [openDropdown]);

    function handleBackHome() {
        navigate("/home");
    }

    function applyTicketUpdate(updates) {
        if (!ticket) {
            return;
        }

        const updated = updateTicket(ticket.id, updates);
        if (updated) {
            setTicket(updated);
        }
    }

    function toggleHeaderDropdown(name, buttonRef) {
        if (openDropdown === name) {
            setOpenDropdown(null);
            return;
        }

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: rect.left
            });
        }

        setOpenDropdown(name);
    }

    function handleTransferAgent(agent) {
        applyTicketUpdate({ assignedAgentId: String(agent.id) });
        setOpenDropdown(null);
        showToast(`Chamado transferido para ${agent.nome}.`, "success");
    }

    function handleCloseTicket(statusOption) {
        applyTicketUpdate({ status: statusOption });
        setOpenDropdown(null);
        showToast(`Chamado encerrado como "${statusOption}".`, "success");
    }

    function handleQueueChange(event) {
        const nextQueue = event.target.value;
        applyTicketUpdate({ queue: nextQueue });
        showToast(`Fila alterada para "${nextQueue}".`, "info");
    }

    function handleStatusChange(event) {
        const nextStatus = event.target.value;
        applyTicketUpdate({ status: nextStatus });
        showToast(`Estado alterado para "${nextStatus}".`, "info");
    }

    function handleTeamChange(event) {
        applyTicketUpdate({ teamId: event.target.value });
    }

    function handleCaseSummaryChange(event) {
        const value = event.target.value;
        setCaseSummary(value);
        applyTicketUpdate({ caseSummary: value });
    }

    function handleSendMessage(event) {
        event?.preventDefault();

        const trimmed = newMessageText.trim();
        if (!trimmed || !ticket) {
            return;
        }

        const nextMessage = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            senderName: currentUser?.nome || "Atendente",
            senderRole: "agent",
            text: trimmed,
            createdAt: new Date().toISOString()
        };

        const nextMessages = [...(ticket.messages || []), nextMessage];
        applyTicketUpdate({ messages: nextMessages });
        setNewMessageText("");

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }

    if (!ticket) {
        return (
            <>
                <Header />

                <main className="ticket-details-page">
                    <div className="ticket-not-found">
                        <h2>Chamado não encontrado</h2>
                        <p>
                            O chamado <strong>#{id}</strong> não existe ou foi
                            excluído.
                        </p>

                        <button
                            type="button"
                            className="ticket-back-button"
                            onClick={handleBackHome}
                        >
                            ← Voltar para a Área de Trabalho
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const status = ticket.status || "Aberto";
    const currentQueue = ticket.queue || "Não avaliados";
    const requesterName = customer ? customer.nome : "Cliente não informado";
    const messages = ticket.messages || [];
    const isClosedStatus = CLOSE_STATUS_OPTIONS.includes(status);

    const selectedTeamMembers = selectedTeam
        ? (selectedTeam.membros || [])
              .map((memberId) =>
                  agents.find((agent) => String(agent.id) === String(memberId))
              )
              .filter(Boolean)
        : [];

    return (
        <>
            <Header />

            <main className="ticket-details-page">
                <div className="ticket-breadcrumbs">
                    <span>
                        Área de Trabalho › <strong>Chamado #{ticket.id}</strong>
                    </span>
                </div>

                {/* Cabeçalho do chamado */}
                <section className="ticket-header-card">
                    <div className="ticket-header-top">
                        <h1 className="ticket-title">
                            #{ticket.id} — {ticket.subject}
                        </h1>

                        <button
                            type="button"
                            className="ticket-back-button"
                            onClick={handleBackHome}
                        >
                            ← Voltar
                        </button>
                    </div>

                    <div className="ticket-badges">
                        <span
                            className={`ticket-badge status ${toClassName(status)}`}
                        >
                            ● {status}
                        </span>

                        <span className="ticket-badge queue">
                            Fila: {currentQueue}
                        </span>

                        <span
                            className={`ticket-badge priority ${toClassName(ticket.priority)}`}
                        >
                            Prioridade: {ticket.priority || "—"}
                        </span>

                        <span
                            className={`ticket-badge impact ${toClassName(ticket.impact)}`}
                        >
                            Impacto: {ticket.impact || "—"}
                        </span>

                        {SLA_BY_IMPACT[ticket.impact] && (
                            <span className="ticket-badge sla">
                                SLA de resposta: {SLA_BY_IMPACT[ticket.impact]}
                            </span>
                        )}
                    </div>

                    <div className="ticket-header-actions">
                        <div className="ticket-header-queue">
                            <label htmlFor="ticketQueue">Fila</label>
                            <select
                                id="ticketQueue"
                                value={currentQueue}
                                onChange={handleQueueChange}
                            >
                                {queues.map((queue) => (
                                    <option key={queue.id} value={queue.nome}>
                                        {queue.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            ref={transferBtnRef}
                            type="button"
                            className={`ticket-action-btn ${
                                openDropdown === "transfer" ? "active" : ""
                            }`}
                            onClick={() =>
                                toggleHeaderDropdown("transfer", transferBtnRef)
                            }
                            aria-haspopup="menu"
                            aria-expanded={openDropdown === "transfer"}
                        >
                            <span>
                                {assignedAgent
                                    ? `Transferir (${assignedAgent.nome})`
                                    : "Transferir Chamado"}
                            </span>
                            <span className="ticket-action-arrow">
                                {openDropdown === "transfer" ? "▴" : "▾"}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="ticket-action-btn"
                            disabled
                            title="Integração com CMDB em desenvolvimento"
                        >
                            Vincular com CMDB
                        </button>

                        <button
                            ref={closeBtnRef}
                            type="button"
                            className={`ticket-action-btn danger ${
                                openDropdown === "close" ? "active" : ""
                            }`}
                            onClick={() =>
                                toggleHeaderDropdown("close", closeBtnRef)
                            }
                            aria-haspopup="menu"
                            aria-expanded={openDropdown === "close"}
                        >
                            <span>Encerrar Chamado</span>
                            <span className="ticket-action-arrow">
                                {openDropdown === "close" ? "▴" : "▾"}
                            </span>
                        </button>
                    </div>
                </section>

                {openDropdown &&
                    createPortal(
                        <div
                            ref={headerMenuRef}
                            className="ticket-header-dropdown-menu"
                            role="menu"
                            style={{
                                position: "fixed",
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                                zIndex: 950
                            }}
                        >
                            {openDropdown === "transfer" &&
                                (agents.length === 0 ? (
                                    <div className="ticket-header-dropdown-empty">
                                        Nenhum agente cadastrado.
                                    </div>
                                ) : (
                                    agents.map((agent) => {
                                        const isAssigned =
                                            String(agent.id) ===
                                            String(ticket.assignedAgentId);

                                        return (
                                            <button
                                                key={agent.id}
                                                type="button"
                                                role="menuitem"
                                                className={`ticket-header-dropdown-option ${
                                                    isAssigned ? "selected" : ""
                                                }`}
                                                onClick={() =>
                                                    handleTransferAgent(agent)
                                                }
                                            >
                                                <span>{agent.nome}</span>
                                                <small>{agent.email}</small>
                                            </button>
                                        );
                                    })
                                ))}

                            {openDropdown === "close" &&
                                CLOSE_STATUS_OPTIONS.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        role="menuitem"
                                        className={`ticket-header-dropdown-option ${
                                            status === option ? "selected" : ""
                                        }`}
                                        onClick={() =>
                                            handleCloseTicket(option)
                                        }
                                    >
                                        <span>{option}</span>
                                    </button>
                                ))}
                        </div>,
                        document.body
                    )}

                <div className="ticket-layout">
                    {/* Coluna principal */}
                    <div className="ticket-main-column">
                        <section className="ticket-card ticket-case-summary">
                            <div className="ticket-card-header-row">
                                <h2 className="ticket-card-title">
                                    Resumo do Caso
                                </h2>
                                <span className="ticket-card-subtitle">
                                    Notas compartilhadas entre agentes
                                </span>
                            </div>

                            <textarea
                                className="ticket-summary-textarea"
                                rows={4}
                                value={caseSummary}
                                onChange={handleCaseSummaryChange}
                                placeholder="Registre aqui informações importantes, contexto técnico e notas internas compartilhadas entre os agentes..."
                            />
                        </section>

                        <section className="ticket-card ticket-conversation">
                            <h2 className="ticket-card-title">
                                Linha de Comunicação do Chamado
                            </h2>

                            <div className="ticket-conversation-body">
                                <div className="ticket-conversation-info">
                                    Chamado aberto em{" "}
                                    {formatDateTime(ticket.createdAt)}
                                </div>

                                <div className="ticket-message incoming">
                                    <span className="ticket-avatar">
                                        {getInitials(requesterName)}
                                    </span>

                                    <div className="ticket-message-bubble incoming">
                                        <div className="ticket-message-header">
                                            <strong>{requesterName}</strong>
                                            <span className="ticket-message-tag">
                                                Solicitante
                                            </span>
                                        </div>

                                        <p className="ticket-message-text">
                                            {ticket.description ||
                                                "Sem descrição."}
                                        </p>

                                        <span className="ticket-message-time">
                                            {formatTime(ticket.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {messages.map((message) => {
                                    const isOutgoing =
                                        message.senderRole !== "customer";

                                    return (
                                        <div
                                            key={message.id}
                                            className={`ticket-message ${
                                                isOutgoing
                                                    ? "outgoing"
                                                    : "incoming"
                                            }`}
                                        >
                                            <span
                                                className={`ticket-avatar ${
                                                    isOutgoing ? "agent" : ""
                                                }`}
                                            >
                                                {getInitials(
                                                    message.senderName
                                                )}
                                            </span>

                                            <div
                                                className={`ticket-message-bubble ${
                                                    isOutgoing
                                                        ? "outgoing"
                                                        : "incoming"
                                                }`}
                                            >
                                                <div className="ticket-message-header">
                                                    <strong>
                                                        {message.senderName}
                                                    </strong>
                                                    <span className="ticket-message-tag">
                                                        {isOutgoing
                                                            ? "Atendente"
                                                            : "Solicitante"}
                                                    </span>
                                                </div>

                                                <p className="ticket-message-text">
                                                    {message.text}
                                                </p>

                                                <span className="ticket-message-time">
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={messagesEndRef} />
                            </div>

                            <form
                                className="ticket-chat-composer"
                                onSubmit={handleSendMessage}
                            >
                                <textarea
                                    rows={2}
                                    value={newMessageText}
                                    onChange={(event) =>
                                        setNewMessageText(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Digite uma mensagem para o cliente... (Enter para enviar)"
                                />

                                <button
                                    type="submit"
                                    className="ticket-chat-send-btn"
                                    disabled={!newMessageText.trim()}
                                >
                                    Enviar
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Coluna lateral */}
                    <aside className="ticket-sidebar">
                        <section className="ticket-card">
                            <h2 className="ticket-card-title">Solicitante</h2>

                            <div className="ticket-requester">
                                <span className="ticket-avatar large">
                                    {getInitials(requesterName)}
                                </span>

                                <div>
                                    <strong>{requesterName}</strong>
                                    <p>{customer?.email || "—"}</p>
                                    <p>{customer?.empresa || "Sem empresa"}</p>
                                </div>
                            </div>

                            <dl className="ticket-details-list">
                                <div>
                                    <dt>Meio de contato</dt>
                                    <dd>{ticket.contact || "—"}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className="ticket-card">
                            <h2 className="ticket-card-title">Equipes</h2>

                            <div className="ticket-team-field">
                                <label htmlFor="ticketTeam">
                                    Equipe responsável
                                </label>
                                <select
                                    id="ticketTeam"
                                    value={ticket.teamId || ""}
                                    onChange={handleTeamChange}
                                >
                                    <option value="">
                                        Selecione uma equipe
                                    </option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTeam && (
                                <div className="ticket-team-info">
                                    <p className="ticket-team-desc">
                                        {selectedTeam.descricao}
                                    </p>
                                    <span className="ticket-team-members">
                                        Membros:{" "}
                                        {selectedTeamMembers.length > 0
                                            ? selectedTeamMembers
                                                  .map((m) => m.nome)
                                                  .join(", ")
                                            : "Nenhum agente alocado"}
                                    </span>
                                </div>
                            )}
                        </section>

                        <section className="ticket-card">
                            <h2 className="ticket-card-title">
                                Detalhes do Chamado
                            </h2>

                            <dl className="ticket-details-list">
                                <div>
                                    <dt>ID</dt>
                                    <dd>#{ticket.id}</dd>
                                </div>

                                <div>
                                    <dt>Fila</dt>
                                    <dd>{currentQueue}</dd>
                                </div>

                                <div>
                                    <dt>Responsável</dt>
                                    <dd>
                                        {assignedAgent
                                            ? assignedAgent.nome
                                            : "Não atribuído"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Equipe</dt>
                                    <dd>
                                        {selectedTeam
                                            ? selectedTeam.nome
                                            : "Não definida"}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Tipo</dt>
                                    <dd>{ticket.type || "—"}</dd>
                                </div>

                                <div>
                                    <dt>Impacto</dt>
                                    <dd>{ticket.impact || "—"}</dd>
                                </div>

                                <div>
                                    <dt>Prioridade</dt>
                                    <dd>{ticket.priority || "—"}</dd>
                                </div>

                                <div>
                                    <dt>Status</dt>
                                    <dd>{status}</dd>
                                </div>

                                <div>
                                    <dt>Criado em</dt>
                                    <dd>{formatDateTime(ticket.createdAt)}</dd>
                                </div>
                            </dl>
                        </section>
                    </aside>
                </div>

                {/* Rodapé com seletor de estado do chamado */}
                <section className="ticket-footer-status-bar">
                    <button
                        type="button"
                        className="ticket-back-button"
                        onClick={handleBackHome}
                    >
                        ← Área de Trabalho
                    </button>

                    <div className="ticket-status-selector">
                        <label htmlFor="ticketStatusSelect">
                            Estado do Chamado
                        </label>
                        <select
                            id="ticketStatusSelect"
                            value={status}
                            onChange={handleStatusChange}
                        >
                            {isClosedStatus && (
                                <option value={status} disabled>
                                    {status} (Encerrado)
                                </option>
                            )}
                            {WORKFLOW_STATUS_OPTIONS.map((statusOption) => (
                                <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>
            </main>

            <Toast
                message={toast.message}
                type={toast.type}
                duration={3500}
                toastKey={toast.key}
            />

            <Footer />
        </>
    );
}

export default TicketDetails;
