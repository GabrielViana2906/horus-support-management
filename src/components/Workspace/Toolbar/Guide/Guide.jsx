import './GuideStyle.css';

function Guide({ activeGuideItem, setActiveGuideItem }) {
    return (
        <nav className="guides" aria-label="Guias da toolbar">
            <ul>
                <li>
                    <button className={activeGuideItem === 'Tickets' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Tickets')}>
                        <span>Tickets</span>
                    </button> 
                </li>

                <li>
                    <button className={activeGuideItem === 'Customers' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Customers')}>
                        <span>Customers</span>
                    </button>
                </li>

                <li>
                    <button className={activeGuideItem === 'Communication' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Communication')}>
                        <span>Communication</span>
                    </button>
                </li>

                <li>
                    <button className={activeGuideItem === 'Automation' ? 'active' : ''}
                    onClick={() => setActiveGuideItem('Automation')}>
                        <span>Automation</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Guide;