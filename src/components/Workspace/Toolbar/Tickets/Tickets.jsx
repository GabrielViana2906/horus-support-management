function Tickets() {
    return (
        <div className="ticket-actions">
                                    <div className="subsection">
                                        <div className="v-buttons">
                                            <button id="create-ticket" className="v-button" onClick={() => navigate('/newTicket')}>
                                                <img src="assets/create-ticket.png" alt="create-ticket.png" /><br />
                                                <span>Create Ticket</span>
                                            </button>
                                            <button id="quick-assign" className="v-button">
                                                <img src="assets/quick-assign.png" alt="quick-assign-icon" /><br />
                                                <span>Quick Assign</span>
                                            </button>
                                            <button id="advanced-search" className="v-button">
                                                <img src="assets/advanced-search.png" alt="advanced-search-icon" /><br />
                                                <span>Advanced<br />Search</span>
                                            </button>
                                        </div>
                                        <p className="section-title">Ações Rápidas</p>
                                    </div>

                                    <span className="divisor"></span>

                                    <div className="subsection">
                                        <div className="v-buttons">
                                            <button id="export-data" className="v-button">
                                                <img src="assets/export-data.png" alt="export-data-icon" /><br />
                                                <span>Export Data</span>
                                            </button>
                                            <button id="import-data" className="v-button">
                                                <img src="assets/import-data.png" alt="import-data-icon" /><br />
                                                <span>Import Data</span>
                                            </button>
                                            <button id="form-edit" className="v-button">
                                                <img src="assets/form-edit.png" alt="form-edit-icon" /><br />
                                                <span>Form Edit</span>
                                            </button>
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