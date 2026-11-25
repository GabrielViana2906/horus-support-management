import './GuideStyle.css';

function Guide({
    activeGuideItem,
    setActiveGuideItem,
    collapsed,
    onToggleCollapse
}) {
    function handleSelectGuide(item) {
        setActiveGuideItem(item);
        if (collapsed) {
            onToggleCollapse();
        }
    }

    return (
        <nav className="guides" aria-label="Guias da barra de ferramentas">
            <ul>
                <li>
                    <button
                        type="button"
                        className={activeGuideItem === 'Tickets' ? 'active' : ''}
                        onClick={() => handleSelectGuide('Tickets')}
                    >
                        <span>Chamados</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        className={activeGuideItem === 'Users' ? 'active' : ''}
                        onClick={() => handleSelectGuide('Users')}
                    >
                        <span>Usuários</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        className={
                            activeGuideItem === 'Communication' ? 'active' : ''
                        }
                        onClick={() => handleSelectGuide('Communication')}
                    >
                        <span>Comunicação</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        className={
                            activeGuideItem === 'Automation' ? 'active' : ''
                        }
                        onClick={() => handleSelectGuide('Automation')}
                    >
                        <span>Automação</span>
                    </button>
                </li>
            </ul>

            <button
                type="button"
                className="guides-collapse-btn"
                onClick={onToggleCollapse}
                title={collapsed ? 'Expandir barra de ferramentas' : 'Recolher barra de ferramentas'}
                aria-expanded={!collapsed}
            >
                <span className="guides-collapse-label">
                    {collapsed ? 'Expandir' : 'Recolher'}
                </span>
                <span>{collapsed ? '▾' : '▴'}</span>
            </button>
        </nav>
    );
}

export default Guide;
