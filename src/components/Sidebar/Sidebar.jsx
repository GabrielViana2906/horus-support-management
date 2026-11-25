
import { useState } from 'react';
import './SidebarStyle.css';

function Sidebar({ activeModule, onNavigate }) {

    const [isOpen, setIsOpen] = useState(false);

    function navigate(module) {
        onNavigate(module);
        setIsOpen(false);
    }

    return (
        <aside className="sidebar">

            <button
                className="sidebar-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="sidebar"
            >
                <span>Navigation Menu</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            <nav
                id="sidebar"
                className={`sidebar-content ${isOpen ? 'open' : ''}`}
            >
                <h3>Operations</h3>
                <ul>
                    <li>
                        <button className={activeModule === 'workspace' ? 'active' : ''} onClick={() => navigate('workspace')}>Workspace</button>
                    </li>
                    <li>
                        <button className={activeModule === 'operationalview' ? 'active' : ''} onClick={() => navigate('operationalview')}>Operational View</button>
                    </li>
                    <li>
                        <button className={activeModule === 'knowledgebase' ? 'active' : ''} onClick={() => navigate('knowledgebase')}>Knowledge Base</button>
                    </li>
                    <li>
                        <button className={activeModule === 'critical' ? 'active' : ''} onClick={() => navigate('critical')}>Critical</button>
                    </li>
                    <li>
                        <button className={activeModule === 'itassets' ? 'active' : ''} onClick={() => navigate('itassets')}>IT Assets</button>
                    </li>
                </ul>

                <h3>Management</h3>
                <ul>
                    <li>
                        <button className={activeModule === 'reports' ? 'active' : ''} onClick={() => navigate('reports')}>Reports</button>
                    </li>
                    <li>
                        <button className={activeModule === 'scheduler' ? 'active' : ''} onClick={() => navigate('scheduler')}>Scheduler</button>
                    </li>
                </ul>

                <h3>Administration</h3>
                <ul>
                    <li>
                        <button className={activeModule === 'globalconfig' ? 'active' : ''} onClick={() => navigate('globalconfig')}>Global Configurations</button>
                    </li>
                    <li>
                        <button className={activeModule === 'useradmin' ? 'active' : ''} onClick={() => navigate('useradmin')}>User Administration</button>
                    </li>
                </ul>
            </nav>

        </aside>
    );
}

export default Sidebar;
