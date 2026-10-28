import { useNavigate } from "react-router";
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from "../Buttons/SplitButton";
import HorizontalButton from "../Buttons/HorizontalButton";
import './FeatureSetStyle.css';

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
        <>
            <div className="option-set">
                <div className="subsection"> 
                    <div className="vertical-buttons-block">
                        <VerticalButton text="Create Ticket" image="/assets/create-ticket.png" action={() => navigate('/newTicket')}/>
                        <VerticalButton text="Quick Assign" image="/assets/quick-assign.png" action={() => navigate('/newTicket')}/>
                        <VerticalButton text="Advanced Search" image="/assets/advanced-search.png" action={() => navigate('/newTicket')}/>
                    </div>
                    <p className="section-title">Quick Actions</p>
                </div>

                <span className="divisor"></span>

                <div className="subsection">
                    <div className="vertical-buttons-block">
                        <VerticalButton text="Import Data" image="/assets/import-data.png" action={() => navigate('/newTicket')}/>
                        <VerticalButton text="Export Data" image="/assets/export-data.png" action={() => navigate('/newTicket')}/>
                        <SplitButton text="Split Button" image="/assets/form-edit.png" action={() => navigate('/newTicket')} options={ticketOptions}/>
                    </div>
                    <p className="section-title">Data</p>
                </div>

                <span className="divisor"></span>

                <div className="subsection">
                    <div className="horizontal-buttons-block">
                        <HorizontalButton text="Change View" image="assets/view.png"/>
                        <HorizontalButton text="Saved Filters" image="assets/filter.png"/> 
                        <HorizontalButton text="Form Edit" image="assets/form-edit.png"/>
                    </div>
                    <p className="section-title">View</p>
                </div>

                <span className="divisor"></span>

                <div className="subsection">
                    <div className="horizontal-buttons-block">
                        <HorizontalButton text="Responder" image="assets/import-data.png" disabled="True"/>
                        <HorizontalButton text="Atualizar" image="assets/quick-assign.png" disabled="True"/>
                        <HorizontalButton text="Mesclar" image="assets/settings.png" disabled="True"/>
                    </div>
                    <p className="section-title">Bulk</p>
                </div>
            </div>
        </>
    )
}

export default Tickets;