import VerticalButton from '../Buttons/VerticalButton';
import HorizontalButton from '../Buttons/HorizontalButton';
import './FeatureSetStyle.css';

function Automation({ onNotify }) {
    function handleNotImplemented(featureName) {
        onNotify?.(`"${featureName}" estará disponível em breve.`, 'info');
    }

    return (
        <div className="option-set">
            <div className="subsection">
                <div className="vertical-buttons-block">
                    <VerticalButton
                        text="Nova Regra"
                        image="/assets/create-ticket.png"
                        action={() => handleNotImplemented('Nova Regra')}
                    />
                    <VerticalButton
                        text="Roteamento"
                        image="/assets/quick-assign.png"
                        action={() => handleNotImplemented('Roteamento Automático')}
                    />
                    <VerticalButton
                        text="Escalonamento"
                        image="/assets/shield.png"
                        action={() => handleNotImplemented('Escalonamento SLA')}
                    />
                </div>
                <p className="section-title">Regras e Gatilhos</p>
            </div>

            <span className="divisor"></span>

            <div className="subsection">
                <div className="horizontal-buttons-block">
                    <HorizontalButton
                        text="Agendamentos"
                        image="/assets/settings.png"
                        action={() => handleNotImplemented('Agendamentos')}
                    />
                    <HorizontalButton
                        text="Monitoramento"
                        image="/assets/view.png"
                        action={() => handleNotImplemented('Monitoramento')}
                    />
                    <HorizontalButton
                        text="Relatórios"
                        image="/assets/export-data.png"
                        action={() => handleNotImplemented('Relatório de Execuções')}
                    />
                </div>
                <p className="section-title">Rotinas</p>
            </div>
        </div>
    );
}

export default Automation;
