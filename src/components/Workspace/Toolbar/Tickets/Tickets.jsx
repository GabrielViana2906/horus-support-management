import { useNavigate } from "react-router";
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from "../Buttons/SplitButton";

function Tickets() {

    const navigate = useNavigate();

    const ticketOptions = [
        {
            id: 'technical',
            label: 'Technical Ticket',
            image: '/assets/data.png',
            action: () => navigate('/newTicket')
        },
        {
            id: 'financial',
            label: 'Financial Ticket',
            image: '/assets/filter.png',
            action: () => navigate('/newTicket')
        },
        {
            id: 'general',
            label: 'General Ticket',
            image: '/assets/import-data.png',
            action: () => navigate('/newTicket')
        }
    ];

    return (
        <div className="ticket-actions">
                                    <div className="subsection">
                                        <div className="v-buttons">
                                            <VerticalButton text="Create Ticket" image="/assets/create-ticket.png" action={() => navigate('/newTicket')}/>
                                            <VerticalButton text="Quick Assign" image="/assets/quick-assign.png" action={() => navigate('/newTicket')}/>
                                            <VerticalButton text="Advanced Search" image="/assets/advanced-search.png" action={() => navigate('/newTicket')}/>
                                        </div>
                                        <p className="section-title">Ações Rápidas</p>
                                    </div>

                                    <span className="divisor"></span>

                                    <div className="subsection">
                                        <div className="v-buttons">
                                            <VerticalButton text="Import Data" image="/assets/import-data.png" action={() => navigate('/newTicket')}/>
                                            <VerticalButton text="Export Data" image="/assets/export-data.png" action={() => navigate('/newTicket')}/>
                                            <VerticalButton text="Form Edit" image="/assets/form-edit.png" action={() => navigate('/newTicket')}/>
                                            <SplitButton text="Split Button" image="/assets/form-edit.png" action={() => navigate('/newTicket')} options={ticketOptions}/>
                                        </div>
                                        <p className="section-title">Dados</p>
                                    </div>

                                    <span className="divisor"></span>

                                    <div className="subsection">
                                        <div className="h-buttons">
                                            {/* As tags <img> abaixo foram devidamente fechadas com /> */}
                                            <button id="alterar-visao" className="h-button">
                                                <img src="assets/view.png" alt="export-data-icon" /><span>Alterar Visão</span>
                                            </button>
                                            <button id="filtros-salvos" className="h-button">
                                                <img src="assets/filter.png" alt="import-data-icon" /><span>Filtros Salvos</span>
                                            </button>
                                            <button id="form-edit-view" className="h-button">
                                                <img src="assets/filter.png" alt="form-edit-icon" /><span>Form Edit</span>
                                            </button>
                                        </div>
                                        <p className="section-title">Visão</p>
                                    </div>

                                    <span className="divisor"></span>

                                    <div className="subsection">
                                        <div className="h-buttons">
                                            {/* As tags <img> abaixo também foram fechadas com /> */}
                                            <button id="responder" className="h-button" disabled>
                                                <img src="assets/shield.png" alt="export-data-icon" /><span>Responder</span>
                                            </button>
                                            <button id="atualizar" className="h-button" disabled>
                                                <img src="assets/shield.png" alt="import-data-icon" /><span>Atualizar</span>
                                            </button>
                                            <button id="mesclar" className="h-button" disabled>
                                                <img src="assets/shield.png" alt="form-edit-icon" /><span>Mesclar</span>
                                            </button>
                                        </div>
                                        <p className="section-title">Lotes</p>
                                    </div>
                                    
                                </div>
    )
}

export default Tickets;