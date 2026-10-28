import './HeaderStyle.css';
import { useTheme } from '../../context/ThemeContext.jsx'

function Header() {

    const { alternarTema } = useTheme();

    return (
        <>
            <header>
                <img src="/assets/logo.png" alt="Logotipo" className="logo" />

                <form action="">
                    <input type="text" title="Digite o termo que deseja buscar" placeholder="🔍︎​  Pesquisar chamados, artigos, usuários, ativos..." className="search-bar" />
                </form>

                <div className="user-actions">
                    <button id="inverted-color" onClick={() => alternarTema()}>
                        <img src="/assets/inverted-color.png" alt="inverted-color-icon"/>
                    </button>

                    <button className="notifications">
                        <img src="/assets/bell.png" alt="notification-icon" />
                    </button>
                    
                    <button className="settings">
                        <img src="/assets/settings.png" alt="settings-icon" />
                    </button>

                    <span className="divisor"></span>

                    <div className="user-profile">
                        <img src="/assets/userpfp.png" alt="user-profile" />
                        <div>
                            <p className="username">John Doe</p>
                            <p className="status">Online</p>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;