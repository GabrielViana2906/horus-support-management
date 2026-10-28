import './FeatureSetStyle.css';
import '../Buttons/VerticalButton'
import VerticalButton from '../Buttons/VerticalButton';
import SplitButton from '../Buttons/SplitButton';

function Customers() {

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
                </div>
                <p className='section-title'>User Operations</p>
            </div>
                
            <div className="divisor"></div>
        </div>
        
        </>
    )

}

export default Customers;