import './SidebarStyle.css';

function Sidebar({ activeModule, onNavigate }) {
    
    return(
        <>
            <aside>
                <nav id="sidebar" className="sidebar">
                    <h3>Operations</h3>
                    <ul>
                        <li><button className={`${activeModule === 'workspace' ? 'active' : ''}`} onClick={() => onNavigate('workspace')}>Workspace</button></li>
                        <li><button className={`${activeModule === 'operationalview' ? 'active' : ''}`} onClick={() => onNavigate('operationalview')}>Operational View</button></li>
                        <li><button className={`${activeModule === 'knowledgebase' ? 'active' : ''}`} onClick={() => onNavigate('knowledgebase')}>Knowledge Base</button></li>
                        <li><button className={`${activeModule === 'critical' ? 'active' : ''}`} onClick={() => onNavigate('critical')}>Critical</button></li>
                        <li><button className={`${activeModule === 'itassets' ? 'active' : ''}`} onClick={() => onNavigate('itassets')}>IT Assets</button></li>
                    </ul>

                    <h3>Management</h3>
                    <ul>
                        <li><button className={`${activeModule === 'reports' ? 'active' : ''}`} onClick={() => onNavigate('reports')}>Reports</button></li>
                        <li><button className={`${activeModule === 'scheduler' ? 'active' : ''}`} onClick={() => onNavigate('scheduler')}>Scheduler</button></li>
                    </ul>

                    <h3>Administration</h3>
                    <ul>
                        <li><button className={`${activeModule === 'globalconfig' ? 'active' : ''}`} onClick={() => onNavigate('globalconfig')}>Global Configurations</button></li>
                        <li><button className={`${activeModule === 'useradmin' ? 'active' : ''}`} onClick={() => onNavigate('useradmin')}>User Administration</button></li>
                    </ul>
                </nav>
            </aside>
        </>
    )
}

export default Sidebar;