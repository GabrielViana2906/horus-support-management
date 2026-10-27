import { useState } from 'react';
import Guide from './Guide/Guide.jsx';
import './ToolbarStyle.css';
import Tickets from './Tickets/Tickets.jsx';

function Toolbar() {
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
                <Guide
                    activeGuideItem={activeGuideItem}
                    setActiveGuideItem={setActiveGuideItem}
                />

                {renderizeButtons()}
            </div>
        </div>
    );
}

export default Toolbar;