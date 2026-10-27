import { useState } from 'react';
import './ToolbarStyle.css';
import { useNavigate } from 'react-router';
import Tickets from './Tickets/Tickets.jsx'

function Toolbar() {
    const navigate = useNavigate();
    const [activeGuideItem, setActiveGuideItem] = useState('Tickets');

    function renderizeButtons() {
        switch (activeGuideItem) {
            case 'Tickets':
                return <Tickets />;
            case 'Customers':
                return <p>Em desenvolvimento Customers</p>;
            case 'Communication':
                return <p>Em desenvolvimento Communication</p>;
            case 'Automation':
                return <p>Em desenvolvimento Automation</p>;
            default:
                return <Tickets />;
        }
    }
    
    return(
        <div className="toolbar">
            <div className="toolbar-content">
                <nav className="guides">
                                    <ul>
                                        <li className="active" onClick={()=>setActiveGuideItem('Tickets')}><a>Tickets</a></li>
                                        <li onClick={()=>setActiveGuideItem('Customers')}><a>Customers</a></li>
                                        <li onClick={()=>setActiveGuideItem('Communication')}><a href="#">Communication</a></li>
                                        <li onClick={()=>setActiveGuideItem('Automation')}><a href="#">Automation</a></li>
                                    </ul>
                </nav>
                {renderizeButtons()}
            </div>
                                
        </div>
    )
}

export default Toolbar;