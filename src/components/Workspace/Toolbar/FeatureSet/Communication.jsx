import VerticalButton from '../Buttons/VerticalButton';
import HorizontalButton from '../Buttons/HorizontalButton';
import './FeatureSetStyle.css';

function Communication({ onNotify }) {
    function handleNotImplemented(featureName) {
        onNotify?.(`"${featureName}" estará disponível em breve.`, 'info');
    }

    return (
        <div className="option-set">
            <div className="subsection">
                <div className="vertical-buttons-block">
                    <VerticalButton
                        text="Novo Comunicado"
                        image="/assets/create-ticket.png"
                        action={() => handleNotImplemented('Novo Comunicado')}
                    />
                    <VerticalButton
                        text="Modelos de Resposta"
                        image="/assets/form-edit.png"
                        action={() => handleNotImplemented('Modelos de Resposta')}
                    />
                    <VerticalButton
                        text="Notificações"
                        image="/assets/bell.png"
                        action={() => handleNotImplemented('Notificações')}
                    />
                </div>
                <p className="section-title">Mensageria</p>
            </div>

            <span className="divisor"></span>

            <div className="subsection">
                <div className="horizontal-buttons-block">
                    <HorizontalButton
                        text="E-mail Corporativo"
                        image="/assets/import-data.png"
                        action={() => handleNotImplemented('E-mail Corporativo')}
                    />
                    <HorizontalButton
                        text="Portal do Cliente"
                        image="/assets/user.png"
                        action={() => handleNotImplemented('Portal do Cliente')}
                    />
                    <HorizontalButton
                        text="Logs de Envio"
                        image="/assets/data.png"
                        action={() => handleNotImplemented('Logs de Envio')}
                    />
                </div>
                <p className="section-title">Canais</p>
            </div>
        </div>
    );
}

export default Communication;
