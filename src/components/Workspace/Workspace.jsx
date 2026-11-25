import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { getTickets, getCustomers, deleteTickets } from '../../database/db';
import './WorkspaceStyle.css';
import Toolbar from './Toolbar/Toolbar';

function Workspace() {

    const navigate = useNavigate();
    const [tickets, setTickets] = useState(() => getTickets());
    const [customers] = useState(() => getCustomers());
    const [selectedTicketIds, setSelectedTicketIds] = useState([]);
    const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);
    const [bulkMenuPos, setBulkMenuPos] = useState({ top: 0, left: 0 });

    const selectAllRef = useRef(null);
    const bulkButtonRef = useRef(null);
    const bulkMenuRef = useRef(null);

    const hasSelection = selectedTicketIds.length > 0;
    const hasMultipleSelected = selectedTicketIds.length > 1;
    const allSelected = tickets.length > 0 && selectedTicketIds.length === tickets.length;

    const bulkOptions = [
        { id: 'responder', label: 'Responder', image: '/assets/import-data.png' },
        { id: 'atualizar', label: 'Atualizar', image: '/assets/quick-assign.png' },
        { id: 'mesclar', label: 'Mesclar', image: '/assets/settings.png' }
    ];

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate =
                selectedTicketIds.length > 0 && selectedTicketIds.length < tickets.length;
        }
    }, [selectedTicketIds, tickets.length]);

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

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => String(c.id) === String(customerId));
        return customer ? customer.nome : 'Cliente não encontrado';
    };

    function toggleSelectAll() {
        if (allSelected) {
            setSelectedTicketIds([]);
            setIsBulkMenuOpen(false);
            return;
        }

        setSelectedTicketIds(tickets.map((ticket) => String(ticket.id)));
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

    function handleBulkAction() {
        setIsBulkMenuOpen(false);
    }

    function handleDeleteSelected() {
        if (!hasSelection) {
            return;
        }

        const updatedTickets = deleteTickets(selectedTicketIds);
        setTickets(updatedTickets);
        setSelectedTicketIds([]);
        setIsBulkMenuOpen(false);
    }

    return (
        <>
            <section className="workspace">
                <Toolbar/>
                <div className="dashboard-content">
                    <h2 className="welcome-message">Bem-vindo, John Doe!</h2>

                    {tickets.length > 0 && (
                        <div className="ticket-table-actions">
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

                                {isBulkMenuOpen && createPortal(
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
                                                onClick={() => handleBulkAction(option.id)}
                                            >
                                                <img src={option.image} alt="" />
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>,
                                    document.body
                                )}
                            </div>

                            <button
                                type="button"
                                className="delete-tickets-button"
                                onClick={handleDeleteSelected}
                                disabled={!hasSelection}
                                title="Excluir tickets selecionados"
                            >
                                <img src="/assets/delete-icon.png" alt="Excluir" />
                                <span>
                                    Excluir{hasSelection ? ` (${selectedTicketIds.length})` : ''}
                                </span>
                            </button>
                        </div>
                    )}

                    <div className="ticket-list-container">
                        {tickets.length === 0 ? (
                            <div className="empty-state">
                                <h3>Não há nenhum ticket pendente.</h3>
                                <button
                                    className="create-ticket-button"
                                    onClick={() => navigate('/newTicket')}
                                >
                                    [Criar um ticket]
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
                                                checked={allSelected}
                                                onChange={toggleSelectAll}
                                                aria-label="Selecionar todos os tickets"
                                            />
                                        </th>
                                        <th>ID</th>
                                        <th>Assunto</th>
                                        <th>Solicitante</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => {
                                        const isSelected = selectedTicketIds.includes(String(ticket.id));

                                        return (
                                            <tr
                                                key={ticket.id}
                                                className={isSelected ? 'selected' : ''}
                                            >
                                                <td className="ticket-checkbox-col">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectTicket(ticket.id)}
                                                        aria-label={`Selecionar ticket ${ticket.id}`}
                                                    />
                                                </td>
                                                <td>#{ticket.id}</td>
                                                <td>{ticket.subject}</td>
                                                <td>{getCustomerName(ticket.clientId)}</td>
                                                <td>
                                                    <span className={'status-badge ' + (ticket.status || 'aberto').toLowerCase()}>
                                                        {ticket.status || 'Aberto'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Workspace;
