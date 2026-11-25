import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import {
    getTickets,
    getCustomers,
    deleteTickets,
    getCurrentUser
} from '../../database/db';
import './WorkspaceStyle.css';
import Toolbar from './Toolbar/Toolbar';
import Toast from '../Toast/Toast';

const STATUS_FILTER_OPTIONS = [
    'Aberto',
    'Pendente',
    'Aguardando Resposta do Cliente',
    'Em Andamento',
    'Em Homologação',
    'Em Teste Interno',
    'Em Desenvolvimento',
    'Fechado',
    'Resolvido',
    'Paliativo'
];

function toClassName(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-');
}

function Workspace({ searchQuery = '' }) {
    const navigate = useNavigate();
    const [currentUser] = useState(() => getCurrentUser());
    const [tickets, setTickets] = useState(() => getTickets());
    const [customers] = useState(() => getCustomers());
    const [selectedTicketIds, setSelectedTicketIds] = useState([]);
    const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
    const [bulkMenuPos, setBulkMenuPos] = useState({ top: 0, left: 0 });

    const [filters, setFilters] = useState({
        id: '',
        subject: '',
        requester: '',
        status: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const [toast, setToast] = useState({ message: '', type: 'info', key: 0 });
    const toastTimerRef = useRef(null);

    const selectAllRef = useRef(null);
    const bulkButtonRef = useRef(null);
    const bulkMenuRef = useRef(null);

    const bulkOptions = [
        { id: 'responder', label: 'Responder', image: '/assets/import-data.png' },
        { id: 'atualizar', label: 'Atualizar', image: '/assets/quick-assign.png' },
        { id: 'mesclar', label: 'Mesclar', image: '/assets/settings.png' }
    ];

    function showToast(message, type = 'info') {
        clearTimeout(toastTimerRef.current);
        setToast((prev) => ({ message, type, key: prev.key + 1 }));
        toastTimerRef.current = setTimeout(() => {
            setToast((prev) => ({ ...prev, message: '' }));
        }, 3500);
    }

    useEffect(() => {
        return () => clearTimeout(toastTimerRef.current);
    }, []);

    function getCustomerName(customerId) {
        const customer = customers.find(
            (c) => String(c.id) === String(customerId)
        );
        return customer ? customer.nome : 'Cliente não encontrado';
    }

    const normalizedGlobalSearch = searchQuery.trim().toLowerCase();

    const filteredTickets = tickets.filter((ticket) => {
        const ticketId = String(ticket.id || '');
        const subject = String(ticket.subject || '');
        const requester = getCustomerName(ticket.clientId);
        const status = ticket.status || 'Aberto';

        if (
            filters.id &&
            !ticketId.toLowerCase().includes(filters.id.trim().toLowerCase())
        ) {
            return false;
        }

        if (
            filters.subject &&
            !subject.toLowerCase().includes(filters.subject.trim().toLowerCase())
        ) {
            return false;
        }

        if (
            filters.requester &&
            !requester
                .toLowerCase()
                .includes(filters.requester.trim().toLowerCase())
        ) {
            return false;
        }

        if (filters.status && status !== filters.status) {
            return false;
        }

        if (normalizedGlobalSearch) {
            const searchable = `${ticketId} ${subject} ${requester} ${status} ${ticket.queue || ''} ${ticket.description || ''}`.toLowerCase();
            if (!searchable.includes(normalizedGlobalSearch)) {
                return false;
            }
        }

        return true;
    });

    const visibleTickets = [...filteredTickets].sort((a, b) => {
        if (!sortConfig.key) {
            return 0;
        }

        let valueA = '';
        let valueB = '';

        if (sortConfig.key === 'id') {
            valueA = String(a.id || '');
            valueB = String(b.id || '');
        } else if (sortConfig.key === 'subject') {
            valueA = String(a.subject || '');
            valueB = String(b.subject || '');
        } else if (sortConfig.key === 'requester') {
            valueA = getCustomerName(a.clientId);
            valueB = getCustomerName(b.clientId);
        } else if (sortConfig.key === 'status') {
            valueA = String(a.status || 'Aberto');
            valueB = String(b.status || 'Aberto');
        }

        const comparison = valueA.localeCompare(valueB, 'pt-BR', {
            numeric: true,
            sensitivity: 'base'
        });

        return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    const hasSelection = selectedTicketIds.length > 0;
    const hasMultipleSelected = selectedTicketIds.length > 1;
    const allVisibleSelected =
        visibleTickets.length > 0 &&
        visibleTickets.every((t) => selectedTicketIds.includes(String(t.id)));

    const hasActiveFilters = Boolean(
        filters.id || filters.subject || filters.requester || filters.status
    );

    useEffect(() => {
        if (selectAllRef.current) {
            const selectedVisibleCount = visibleTickets.filter((t) =>
                selectedTicketIds.includes(String(t.id))
            ).length;

            selectAllRef.current.indeterminate =
                selectedVisibleCount > 0 &&
                selectedVisibleCount < visibleTickets.length;
        }
    }, [selectedTicketIds, visibleTickets]);

    useEffect(() => {
        if (!isBulkMenuOpen) {
            return;
        }

        function handleClickOutside(event) {
            const clickedButton = bulkButtonRef.current?.contains(event.target);
            const clickedMenu = bulkMenuRef.current?.contains(event.target);

            if (!clickedButton && !clickedMenu) {
                setIsBulkMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isBulkMenuOpen]);

    function handleSort(columnKey) {
        setSortConfig((current) => {
            if (current.key !== columnKey) {
                return { key: columnKey, direction: 'asc' };
            }
            if (current.direction === 'asc') {
                return { key: columnKey, direction: 'desc' };
            }
            return { key: null, direction: 'asc' };
        });
    }

    function getSortIndicator(columnKey) {
        if (sortConfig.key !== columnKey) {
            return '⇅';
        }
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    }

    function handleFilterChange(field, value) {
        setFilters((prev) => ({ ...prev, [field]: value }));
    }

    function clearColumnFilters() {
        setFilters({ id: '', subject: '', requester: '', status: '' });
    }

    function toggleSelectAll() {
        if (allVisibleSelected) {
            const visibleSet = new Set(visibleTickets.map((t) => String(t.id)));
            setSelectedTicketIds((current) => {
                const next = current.filter((id) => !visibleSet.has(id));
                if (next.length <= 1) setIsBulkMenuOpen(false);
                return next;
            });
            return;
        }

        const merged = new Set([
            ...selectedTicketIds,
            ...visibleTickets.map((t) => String(t.id))
        ]);
        setSelectedTicketIds(Array.from(merged));
    }

    function toggleSelectTicket(ticketId) {
        const normalizedId = String(ticketId);

        setSelectedTicketIds((current) => {
            const next = current.includes(normalizedId)
                ? current.filter((id) => id !== normalizedId)
                : [...current, normalizedId];

            if (next.length <= 1) {
                setIsBulkMenuOpen(false);
            }

            return next;
        });
    }

    function toggleBulkMenu() {
        if (!hasMultipleSelected) {
            return;
        }

        if (!isBulkMenuOpen && bulkButtonRef.current) {
            const rect = bulkButtonRef.current.getBoundingClientRect();
            setBulkMenuPos({
                top: rect.bottom + 4,
                left: rect.left
            });
        }

        setIsBulkMenuOpen((previous) => !previous);
    }

    function handleBulkAction(actionId) {
        setIsBulkMenuOpen(false);
        showToast(
            `Ação "${actionId}" selecionada para ${selectedTicketIds.length} chamados.`,
            'info'
        );
    }

    function handleDeleteSelected() {
        if (!hasSelection) {
            return;
        }

        const count = selectedTicketIds.length;
        const updatedTickets = deleteTickets(selectedTicketIds);
        setTickets(updatedTickets);
        setSelectedTicketIds([]);
        setIsBulkMenuOpen(false);
        showToast(`${count} chamado(s) excluído(s) com sucesso.`, 'success');
    }

    function handleOpenTicket(ticketId) {
        navigate(`/ticket/${ticketId}`);
    }

    return (
        <section className="workspace">
            <Toolbar
                onNotify={showToast}
                onRefreshTickets={() => setTickets(getTickets())}
            />

            <div className="dashboard-content">
                <h2 className="welcome-message">
                    Bem-vindo, {currentUser?.nome || 'Agente'}!
                </h2>

                {tickets.length > 0 && (
                    <div className="ticket-table-actions">
                        <div className="ticket-table-actions-left">
                            <div className="bulk-dropdown-wrapper">
                                <button
                                    ref={bulkButtonRef}
                                    type="button"
                                    className="bulk-dropdown-trigger"
                                    onClick={toggleBulkMenu}
                                    disabled={!hasMultipleSelected}
                                    aria-haspopup="menu"
                                    aria-expanded={isBulkMenuOpen}
                                >
                                    <span>Ações em massa</span>
                                    <span className="bulk-dropdown-arrow">
                                        {isBulkMenuOpen ? '▴' : '▾'}
                                    </span>
                                </button>

                                {isBulkMenuOpen &&
                                    createPortal(
                                        <div
                                            ref={bulkMenuRef}
                                            className="bulk-dropdown-menu"
                                            role="menu"
                                            style={{
                                                position: 'fixed',
                                                top: bulkMenuPos.top,
                                                left: bulkMenuPos.left,
                                                zIndex: 950
                                            }}
                                        >
                                            {bulkOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    role="menuitem"
                                                    className="bulk-dropdown-option"
                                                    onClick={() =>
                                                        handleBulkAction(
                                                            option.label
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={option.image}
                                                        alt=""
                                                    />
                                                    <span>{option.label}</span>
                                                </button>
                                            ))}
                                        </div>,
                                        document.body
                                    )}
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="clear-filters-button"
                                    onClick={clearColumnFilters}
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            className="delete-tickets-button"
                            onClick={handleDeleteSelected}
                            disabled={!hasSelection}
                            title="Excluir chamados selecionados"
                        >
                            <img src="/assets/delete-icon.png" alt="Excluir" />
                            <span>
                                Excluir
                                {hasSelection
                                    ? ` (${selectedTicketIds.length})`
                                    : ''}
                            </span>
                        </button>
                    </div>
                )}

                <div className="ticket-list-container">
                    {tickets.length === 0 ? (
                        <div className="empty-state">
                            <h3>Não há nenhum chamado pendente.</h3>
                            <button
                                type="button"
                                className="create-ticket-button"
                                onClick={() => navigate('/newTicket')}
                            >
                                Criar um chamado
                            </button>
                        </div>
                    ) : (
                        <table className="ticket-table">
                            <thead>
                                <tr>
                                    <th className="ticket-checkbox-col">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={toggleSelectAll}
                                            aria-label="Selecionar todos os chamados"
                                        />
                                    </th>
                                    <th>
                                        <button
                                            type="button"
                                            className="sort-header-btn"
                                            onClick={() => handleSort('id')}
                                        >
                                            <span>ID</span>
                                            <span>{getSortIndicator('id')}</span>
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            type="button"
                                            className="sort-header-btn"
                                            onClick={() => handleSort('subject')}
                                        >
                                            <span>Assunto</span>
                                            <span>
                                                {getSortIndicator('subject')}
                                            </span>
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            type="button"
                                            className="sort-header-btn"
                                            onClick={() =>
                                                handleSort('requester')
                                            }
                                        >
                                            <span>Solicitante</span>
                                            <span>
                                                {getSortIndicator('requester')}
                                            </span>
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            type="button"
                                            className="sort-header-btn"
                                            onClick={() => handleSort('status')}
                                        >
                                            <span>Status</span>
                                            <span>
                                                {getSortIndicator('status')}
                                            </span>
                                        </button>
                                    </th>
                                </tr>
                                <tr className="ticket-filter-row">
                                    <th></th>
                                    <th>
                                        <input
                                            type="text"
                                            value={filters.id}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'id',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Filtrar ID..."
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            value={filters.subject}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'subject',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Filtrar assunto..."
                                        />
                                    </th>
                                    <th>
                                        <input
                                            type="text"
                                            value={filters.requester}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'requester',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Filtrar solicitante..."
                                        />
                                    </th>
                                    <th>
                                        <select
                                            value={filters.status}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    'status',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Todos</option>
                                            {STATUS_FILTER_OPTIONS.map(
                                                (option) => (
                                                    <option
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleTickets.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="ticket-table-no-results"
                                        >
                                            Nenhum chamado corresponde aos
                                            filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    visibleTickets.map((ticket) => {
                                        const isSelected =
                                            selectedTicketIds.includes(
                                                String(ticket.id)
                                            );
                                        const statusText =
                                            ticket.status || 'Aberto';

                                        return (
                                            <tr
                                                key={ticket.id}
                                                className={
                                                    isSelected ? 'selected' : ''
                                                }
                                                style={{ cursor: 'pointer' }}
                                                tabIndex={0}
                                                onClick={() =>
                                                    handleOpenTicket(ticket.id)
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter') {
                                                        handleOpenTicket(
                                                            ticket.id
                                                        );
                                                    }
                                                }}
                                            >
                                                <td
                                                    className="ticket-checkbox-col"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelectTicket(
                                                                ticket.id
                                                            )
                                                        }
                                                        aria-label={`Selecionar chamado ${ticket.id}`}
                                                    />
                                                </td>
                                                <td>#{ticket.id}</td>
                                                <td>{ticket.subject}</td>
                                                <td>
                                                    {getCustomerName(
                                                        ticket.clientId
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`status-badge ${toClassName(statusText)}`}
                                                    >
                                                        {statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Toast
                message={toast.message}
                type={toast.type}
                duration={3500}
                toastKey={toast.key}
            />
        </section>
    );
}

export default Workspace;
