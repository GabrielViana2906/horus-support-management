import { useState } from 'react';
import './FeatureSetStyle.css';
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from '../Buttons/SplitButton';
import HorizontalButton from '../Buttons/HorizontalButton';
import CreateAgentModal from './CreateAgentModal';
import CreateCustomerModal from './CreateCustomerModal';

function Users({ onNotify }) {
    const [showCreateAgent, setShowCreateAgent] = useState(false);
    const [showCreateCustomer, setShowCreateCustomer] = useState(false);

    function handleNotImplemented(featureName) {
        onNotify?.(`"${featureName}" estará disponível em breve.`, 'info');
    }

    const newUserOptions = [
        {
            id: 'customer',
            label: 'Novo Cliente',
            image: '/assets/user.png',
            action: () => setShowCreateCustomer(true)
        },
        {
            id: 'agent',
            label: 'Novo Agente',
            image: '/assets/shield.png',
            action: () => setShowCreateAgent(true)
        },
        {
            id: 'organization',
            label: 'Organização',
            image: '/assets/organization.png',
            action: () => handleNotImplemented('Cadastro de Organização')
        }
    ];

    return (
        <>
            <div className="option-set">
                <div className="subsection">
                    <div className="vertical-buttons-block">
                        <VerticalButton
                            text="Criar Cliente"
                            image="/assets/user.png"
                            action={() => setShowCreateCustomer(true)}
                        />
                        <VerticalButton
                            text="Criar Agente"
                            image="/assets/shield.png"
                            action={() => setShowCreateAgent(true)}
                        />
                    </div>
                    <p className="section-title">Cadastros</p>
                </div>

                <span className="divisor"></span>

                <div className="subsection">
                    <div className="vertical-buttons-block">
                        <VerticalButton
                            text="Gerenciar Clientes"
                            image="/assets/user-management.png"
                            action={() => handleNotImplemented('Gerenciar Clientes')}
                        />
                        <VerticalButton
                            text="Importar em Lote"
                            image="/assets/bulk-user-import.png"
                            action={() => handleNotImplemented('Importação em Lote')}
                        />
                        <VerticalButton
                            text="Gerenciar Equipes"
                            image="/assets/group-management.png"
                            action={() => handleNotImplemented('Gerenciar Equipes')}
                        />
                    </div>
                    <p className="section-title">Gestão de Usuários</p>
                </div>

                <span className="divisor"></span>

                <div className="subsection">
                    <div className="horizontal-buttons-block">
                        <HorizontalButton
                            text="Empresas"
                            image="/assets/organization.png"
                            action={() => handleNotImplemented('Empresas')}
                        />
                        <HorizontalButton
                            text="Perfis e Acesso"
                            image="/assets/settings.png"
                            action={() => handleNotImplemented('Perfis e Acesso')}
                        />
                    </div>
                    <p className="section-title">Organizações</p>
                </div>
            </div>

            {showCreateAgent && (
                <CreateAgentModal
                    onClose={() => setShowCreateAgent(false)}
                    onCreated={() =>
                        onNotify?.('Agente cadastrado com sucesso!', 'success')
                    }
                />
            )}

            {showCreateCustomer && (
                <CreateCustomerModal
                    onClose={() => setShowCreateCustomer(false)}
                    onCreated={() =>
                        onNotify?.('Cliente cadastrado com sucesso!', 'success')
                    }
                />
            )}
        </>
    );
}

export default Users;
