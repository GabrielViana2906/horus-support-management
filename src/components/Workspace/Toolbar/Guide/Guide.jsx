import './GuideStyle.css';

function Guide({ activeGuideItem, setActiveGuideItem }) {
    return (
        <nav className="guides" aria-label="Guias da toolbar">
            <ul>
                <li>
                    <button className={activeGuideItem === 'Tickets' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Tickets')}>
                        <span>Chamados</span>
                    </button> 
                </li>

                <li>
                    <button className={activeGuideItem === 'Users' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Users')}>
                        <span>Usuários</span>
                    </button>
                </li>

                <li>
                    <button className={activeGuideItem === 'Communication' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Communication')}>
                        <span>Comunicação</span>
                    </button>
                </li>

                <li>
                    <button className={activeGuideItem === 'Automation' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Automation')}>
                        <span>Automação</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Guide;