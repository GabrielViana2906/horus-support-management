import { useState } from 'react';
import Guide from './Guide/Guide.jsx';
import './ToolbarStyle.css';
import Tickets from './FeatureSet/Tickets.jsx';
import Users from './FeatureSet/Users.jsx';
import Communication from './FeatureSet/Communication.jsx';
import Automation from './FeatureSet/Automation.jsx';

function Toolbar({ onNotify, onRefreshTickets }) {
    const [activeGuideItem, setActiveGuideItem] = useState('Tickets');
    const [isCollapsed, setIsCollapsed] = useState(false);

    function renderizeButtons() {
        switch (activeGuideItem) {
            case 'Tickets':
                return (
                    <Tickets
                        onNotify={onNotify}
                        onRefreshTickets={onRefreshTickets}
                    />
                );

            case 'Users':
                return <Users onNotify={onNotify} />;

            case 'Communication':
                return <Communication onNotify={onNotify} />;

            case 'Automation':
                return <Automation onNotify={onNotify} />;

            default:
                return (
                    <Tickets
                        onNotify={onNotify}
                        onRefreshTickets={onRefreshTickets}
                    />
                );
        }
    }

    return (
        <div className={`toolbar ${isCollapsed ? 'collapsed' : ''}`}>
            <Guide
                activeGuideItem={activeGuideItem}
                setActiveGuideItem={setActiveGuideItem}
                collapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
            />

            {!isCollapsed && (
                <div className="toolbar-scroll">
                    <div className="toolbar-content">{renderizeButtons()}</div>
                </div>
            )}
        </div>
    );
}

export default Toolbar;
