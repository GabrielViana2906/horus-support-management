import './css/LoginStyle.css'
import { useNavigate } from 'react-router';

function Login() {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-header">
                    <h1>Hórus</h1>
                    <p>Portal Unificado de Atendimento &amp; Governança</p>
                </div>

                <section className="login-card">

                    <div className="login-user-type">
                        <button type="button" className="tipo-login active">
                            <img
                                src="assets/shield.png"
                                alt="shield"
                                className="icon"
                            />
                            Sou Agente
                        </button>

                        <button type="button" className="tipo-login">
                            <img
                                src="assets/briefcase.png"
                                alt="briefcase"
                                className="icon"
                            />
                            Sou Cliente
                        </button>
                    </div>

                    <button type="button" className="login-google">
                        <img
                            src="assets/google.png"
                            alt="google"
                            className="google-icon"
                        />
                        Continuar com o Google
                    </button>

                    <div className="login-separator">
                        <span></span>
                        <p>OU CONTINUE COM SEU E-MAIL CORPORATIVO</p>
                        <span></span>
                    </div>

                    <form className="login-form" onSubmit={(event) => {
                        event.preventDefault();
                        navigate('/home');
                    }}>

                        <div className="form-group">
                            <label htmlFor="email">E-mail Corporativo</label>

                            <div className="input-container">
                                <i className="fa-solid fa-at"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu.email@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="password-label">
                                <label htmlFor="password">
                                    Chave de Segurança / Senha
                                </label>

                                <a href="#">Esqueci minha senha</a>
                            </div>

                            <div className="input-container">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Digite sua senha"
                                    required
                                />
                            </div>
                        </div>

                        <label className="remember-option">
                            <input type="checkbox" />
                            <span>Lembrar deste computador</span>
                        </label>

                        <button type="submit" className="meu-botao login-button">
                            Acessar Workspace
                        </button>

                        <button type="button" className="register-button">
                            Não possui conta? Clique aqui para se cadastrar
                        </button>

                    </form>
                </section>
            </div>
        </div>
    );
}

export default Login;