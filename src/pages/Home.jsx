import './css/HomeStyle.css';
import Header from '../components/Header/Header.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Footer from '../components/Footer/Footer.jsx';
import Workspace from '../components/Workspace/Workspace.jsx';
import ITAssets from '../components/ITAssets/ITAssets.jsx';
import { useState } from 'react';

function Home() {

    const [activeModule, setActiveModule] = useState('workspace');

    // Renderiza o módulo ativo dentro do Main
    function renderizeModule() {
        switch (activeModule) {
            case 'workspace':
                return <Workspace/>;
            case 'itassets':
                return <ITAssets/>;
            default:
                return <ITAssets/>;
        }    
    }

    return (
        <>
            <div className="home">  
                <Header/>
                <Sidebar activeModule={activeModule} onNavigate={setActiveModule}/>  
                <main>
                    {renderizeModule()}
                </main>
                <Footer/>
            </div>
        </>
    );
}

export default Home;