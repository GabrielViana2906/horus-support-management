import './GuideStyle.css';

function Guide({ activeGuideItem, setActiveGuideItem }) {
    return (
        <nav className="guides" aria-label="Guias da toolbar">
            <ul>
                <li
                    className={activeGuideItem === 'Tickets' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Tickets')}
                >
                    <span>Tickets</span>
                </li>

                <li
                    className={activeGuideItem === 'Customers' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Customers')}
                >
                    <span>Customers</span>
                </li>

                <li
                    className={activeGuideItem === 'Communication' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Communication')}
                >
                    <span>Communication</span>
                </li>

                <li
                    className={activeGuideItem === 'Automation' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Automation')}
                >
                    <span>Automation</span>
                </li>
            </ul>
        </nav>
    );
}

export default Guide;