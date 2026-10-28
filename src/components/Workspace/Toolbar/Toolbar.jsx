import { useState } from 'react';
import Guide from './Guide/Guide.jsx';
import './ToolbarStyle.css';
import Tickets from './FeatureSet/Tickets.jsx';
import Customers from './FeatureSet/Customers.jsx';

function Toolbar() {
    const [activeGuideItem, setActiveGuideItem] = useState('Tickets');

    function renderizeButtons() {
        switch (activeGuideItem) {
            case 'Tickets':
                return <Tickets />;

            case 'Customers':
                return <Customers />;

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