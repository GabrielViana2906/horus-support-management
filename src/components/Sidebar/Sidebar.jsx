import { useState } from 'react';
import './SidebarStyle.css';

function Sidebar({ activeModule, onNavigate, collapsed, onToggleCollapse }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    function navigate(module) {
        onNavigate(module);
        setIsMobileOpen(false);
    }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button
                type="button"
                className="sidebar-desktop-toggle"
                onClick={onToggleCollapse}
                title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
                aria-expanded={!collapsed}
            >
                {!collapsed && <span>Menu</span>}
                <span>{collapsed ? '»' : '«'}</span>
            </button>

            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-expanded={isMobileOpen}
                aria-controls="sidebar"
            >
                <span>Menu de Navegação</span>
                <span>{isMobileOpen ? '▲' : '▼'}</span>
            </button>

            <nav
                id="sidebar"
                className={`sidebar-content ${isMobileOpen ? 'open' : ''}`}
            >
                <h3>Operações</h3>
                <ul>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'workspace' ? 'active' : ''}
                            onClick={() => navigate('workspace')}
                        >
                            Área de Trabalho
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'operationalview' ? 'active' : ''}
                            onClick={() => navigate('operationalview')}
                        >
                            Visão Operacional
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'knowledgebase' ? 'active' : ''}
                            onClick={() => navigate('knowledgebase')}
                        >
                            Base de Conhecimento
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'critical' ? 'active' : ''}
                            onClick={() => navigate('critical')}
                        >
                            Críticos
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'itassets' ? 'active' : ''}
                            onClick={() => navigate('itassets')}
                        >
                            Ativos de TI
                        </button>
                    </li>
                </ul>

                <h3>Gestão</h3>
                <ul>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'reports' ? 'active' : ''}
                            onClick={() => navigate('reports')}
                        >
                            Relatórios
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'scheduler' ? 'active' : ''}
                            onClick={() => navigate('scheduler')}
                        >
                            Agendador
                        </button>
                    </li>
                </ul>

                <h3>Administração</h3>
                <ul>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'globalconfig' ? 'active' : ''}
                            onClick={() => navigate('globalconfig')}
                        >
                            Configurações Globais
                        </button>
                    </li>
                    <li>
                        <button
                            type="button"
                            className={activeModule === 'useradmin' ? 'active' : ''}
                            onClick={() => navigate('useradmin')}
                        >
                            Administração de Usuários
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
