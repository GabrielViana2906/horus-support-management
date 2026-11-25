import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getTickets, getCustomers } from '../../database/db';
import './WorkspaceStyle.css';
import Toolbar from './Toolbar/Toolbar';

function Workspace() {

    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        setTickets(getTickets());
        setCustomers(getCustomers());
    }, []);

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => c.id == customerId);
        return customer ? customer.nome : 'Cliente não encontrado';
    };

    return (
        <>
            <section className="workspace">
                <Toolbar/>
                <div className="dashboard-content">
                    <h2 className="welcome-message">Bem-vindo, John Doe!</h2>

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
                                        <th>ID</th>
                                        <th>Assunto</th>
                                        <th>Solicitante</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>#{ticket.id}</td>
                                            <td>{ticket.subject}</td>
                                            <td>{getCustomerName(ticket.clientId)}</td>
                                            <td>
                                                <span className={'status-badge ' + (ticket.status || 'aberto').toLowerCase()}>
                                                    {ticket.status || 'Aberto'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
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

