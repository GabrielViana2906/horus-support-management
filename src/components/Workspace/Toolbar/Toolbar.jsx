import { useState } from 'react';
import './ToolbarStyle.css';
import Tickets from './Tickets/Tickets.jsx';
import { useNavigate } from 'react-router';

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

    return (
        <div className="toolbar">
            <div className="toolbar-content">
                <nav className="guides">
                    <ul>
                        <li
                            className={activeGuideItem === 'Tickets' ? 'active' : ''}
                            onClick={() => {setActiveGuideItem('Tickets')}}>
                            <spam>
                                Tickets
                            </spam>
                        </li>

                        <li
                            className={activeGuideItem === 'Customers' ? 'active' : ''}
                            onClick={() => setActiveGuideItem('Customers')}
                        >
                            <a href="#" onClick={(event) => event.preventDefault()}>
                                Customers
                            </a>
                        </li>

                        <li
                            className={activeGuideItem === 'Communication' ? 'active' : ''}
                            onClick={() => setActiveGuideItem('Communication')}
                        >
                            <a href="#" onClick={(event) => event.preventDefault()}>
                                Communication
                            </a>
                        </li>

                        <li
                            className={activeGuideItem === 'Automation' ? 'active' : ''}
                            onClick={() => setActiveGuideItem('Automation')}
                        >
                            <a href="#" onClick={(event) => event.preventDefault()}>
                                Automation
                            </a>
                        </li>
                    </ul>
                </nav>

                {renderizeButtons()}
            </div>
        </div>
    );
}

export default Toolbar;