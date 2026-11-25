import './css/HomeStyle.css';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Workspace from '../components/Workspace/Workspace.jsx';
import ITAssets from '../components/ITAssets/ITAssets.jsx';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeModule, setActiveModule] = useState('workspace');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const searchQuery = searchParams.get('busca') || '';

    function handleSearchChange(value) {
        if (value) {
            setSearchParams({ busca: value }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }

    function renderizeModule() {
        switch (activeModule) {
            case 'workspace':
                return <Workspace searchQuery={searchQuery} />;
            case 'itassets':
                return <ITAssets />;
            default:
                return <ITAssets />;
        }
    }

    return (
        <div className={`home ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Header
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            <Sidebar
                activeModule={activeModule}
                onNavigate={setActiveModule}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() =>
                    setSidebarCollapsed((prev) => !prev)
                }
            />
            <main>{renderizeModule()}</main>
            <Footer />
        </div>
    );
}

export default Home;
