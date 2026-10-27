import './WorkspaceStyle.css';
import Toolbar from './Toolbar/Toolbar';

function Workspace() {

    return (
        <>
            <section className="workspace">
                <Toolbar/>
                <div className="dashboard-content">
                    <h2 className="welcome-message">Bem-vindo, John Doe!</h2>
                                
                    <div className="ticket-list-container">
                        <table className="ticket-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Assunto</th>
                                                <th>Solicitante</th>
                                                <th>Status</th>
                                                <th>Prioridade</th>
                                                <th>Última Atualização</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>#10452</td>
                                                <td>Falha na conexão com a VPN</td>
                                                <td>Maria Silva</td>
                                                <td><span className="status-badge open">Aberto</span></td>
                                                <td>Alta</td>
                                                <td>Hoje, 10:30</td>
                                            </tr>
                                        </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Workspace;