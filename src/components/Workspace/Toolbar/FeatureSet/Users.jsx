import { useState } from 'react';
import { useNavigate } from 'react-router';
import './FeatureSetStyle.css';
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from '../Buttons/SplitButton';
import CreateAgentModal from './CreateAgentModal';

function Users() {

    const navigate = useNavigate();
    const [showCreateAgent, setShowCreateAgent] = useState(false);

    const newCustomerOptions = [
        {
            id: 'organization',
            label: 'Organization',
            image: '/assets/organization.png',
            action: () => navigate('/newTicket')
        },
        {
            id: 'user',
            label: 'Customer User',
            image: '/assets/user.png',
            action: () => navigate('/newTicket')
        }
    ]

    return(
        <>
        <div className="option-set">
            <div>
                <div className="vertical-buttons-block">
                    <SplitButton text="New Customer" image="assets/create-ticket.png" options={newCustomerOptions}/>
                    <VerticalButton text="Manage Customers" image="assets/user-management.png"/>
                    <VerticalButton text="Bulk Import" image="assets/bulk-user-import.png"/>
                    <VerticalButton text="Manage Groups" image="assets/group-management.png"/>
                    <VerticalButton text="Criar agente" image="/assets/create-ticket.png" action={() => setShowCreateAgent(true)}/>
                </div>
                <p className='section-title'>User Operations</p>
            </div>

            <div className="divisor"></div>
        </div>

        {showCreateAgent && <CreateAgentModal onClose={() => setShowCreateAgent(false)} />}

        </>
    )

}

export default Users;