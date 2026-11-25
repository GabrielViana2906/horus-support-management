import { useNavigate } from 'react-router';
import { getTickets } from '../../../../database/db';
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from '../Buttons/SplitButton';
import HorizontalButton from '../Buttons/HorizontalButton';
import './FeatureSetStyle.css';

function Tickets({ onNotify, onRefreshTickets }) {
    const navigate = useNavigate();

    const ticketOptions = [
        {
            id: 'technical',
            label: 'Chamado Técnico',
            image: '/assets/data.png',
            action: () => navigate('/newTicket')
        },
        {
            id: 'financial',
            label: 'Chamado Financeiro',
            image: '/assets/filter.png',
            action: () => navigate('/newTicket')
        },
        {
            id: 'general',
            label: 'Dúvida Geral',
            image: '/assets/import-data.png',
            action: () => navigate('/newTicket')
        }
    ];

    function handleFocusSearch() {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.focus();
        }
    }

    function handleExportCsv() {
        const tickets = getTickets();

        if (!tickets || tickets.length === 0) {
            onNotify?.('Não há chamados para exportar.', 'warning');
            return;
        }

        const header = 'ID;Assunto;Status;Fila;Prioridade;Impacto;CriadoEm';
        const rows = tickets.map((t) =>
            [
                t.id,
                `"${String(t.subject || '').replace(/"/g, '""')}"`,
                t.status || 'Aberto',
                t.queue || 'Não avaliados',
                t.priority || '',
                t.impact || '',
                t.createdAt || ''
            ].join(';')
        );

        const csvContent = [header, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'chamados-horus.csv';
        link.click();
        URL.revokeObjectURL(url);

        onNotify?.('Lista de chamados exportada com sucesso!', 'success');
    }

    function handleNotImplemented(featureName) {
        onNotify?.(`"${featureName}" estará disponível em breve.`, 'info');
    }

    return (
        <div className="option-set">
            <div className="subsection">
                <div className="vertical-buttons-block">
                    <VerticalButton
                        text="Novo Chamado"
                        image="/assets/create-ticket.png"
                        action={() => navigate('/newTicket')}
                    />
                    <VerticalButton
                        text="Atribuir Rápido"
                        image="/assets/quick-assign.png"
                        action={() => handleNotImplemented('Atribuir Rápido')}
                    />
                    <VerticalButton
                        text="Busca Avançada"
                        image="/assets/advanced-search.png"
                        action={handleFocusSearch}
                    />
                    <VerticalButton
                        text="Atualizar Lista"
                        image="/assets/view.png"
                        action={() => {
                            onRefreshTickets?.();
                            onNotify?.('Lista de chamados atualizada.', 'info');
                        }}
                    />
                </div>
                <p className="section-title">Ações Rápidas</p>
            </div>

            <span className="divisor"></span>

            <div className="subsection">
                <div className="vertical-buttons-block">
                    <VerticalButton
                        text="Importar Dados"
                        image="/assets/import-data.png"
                        action={() => handleNotImplemented('Importar Dados')}
                    />
                    <VerticalButton
                        text="Exportar CSV"
                        image="/assets/export-data.png"
                        action={handleExportCsv}
                    />
                    <SplitButton
                        text="Tipos"
                        image="/assets/form-edit.png"
                        action={() => navigate('/newTicket')}
                        options={ticketOptions}
                    />
                </div>
                <p className="section-title">Dados</p>
            </div>

            <span className="divisor"></span>

            <div className="subsection">
                <div className="horizontal-buttons-block">
                    <HorizontalButton
                        text="Alterar Visão"
                        image="/assets/view.png"
                        action={() => handleNotImplemented('Alterar Visão')}
                    />
                    <HorizontalButton
                        text="Filtros Salvos"
                        image="/assets/filter.png"
                        action={() => handleNotImplemented('Filtros Salvos')}
                    />
                    <HorizontalButton
                        text="Editar Formulário"
                        image="/assets/form-edit.png"
                        action={() => handleNotImplemented('Editar Formulário')}
                    />
                </div>
                <p className="section-title">Visualização</p>
            </div>

            <span className="divisor"></span>

            <div className="subsection">
                <div className="horizontal-buttons-block">
                    <HorizontalButton
                        text="Gerenciar Filas"
                        image="/assets/data.png"
                        action={() => handleNotImplemented('Gerenciar Filas')}
                    />
                    <HorizontalButton
                        text="Regras de SLA"
                        image="/assets/shield.png"
                        action={() => handleNotImplemented('Regras de SLA')}
                    />
                    <HorizontalButton
                        text="Histórico"
                        image="/assets/briefcase.png"
                        action={() => handleNotImplemented('Histórico')}
                    />
                </div>
                <p className="section-title">Filas e SLA</p>
            </div>
        </div>
    );
}

export default Tickets;
