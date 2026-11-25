import './css/LoginStyle.css';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { getSetting, setSetting, getAgents, setCurrentUser } from '../database/db';

function Login() {
    const navigate = useNavigate();
    const [lembrar, setLembrar] = useState(() => getSetting('lembrar') || false);
    const [perfil, setPerfil] = useState('agent');
    const [email, setEmail] = useState(() =>
        getSetting('lembrar') ? getSetting('email') || '' : ''
    );
    const [password, setPassword] = useState('');
    const [erros, setErros] = useState({ email: '', password: '', geral: '' });

    useEffect(() => {
        setSetting('lembrar', lembrar);
        if (!lembrar) {
            setSetting('email', '');
        }
    }, [lembrar]);

    function validar() {
        const novosErros = { email: '', password: '', geral: '' };
        const emailDigitado = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailDigitado) {
            novosErros.email = 'Informe seu e-mail ou usuário.';
        } else if (emailDigitado !== 'admin' && !emailRegex.test(emailDigitado)) {
            novosErros.email = 'Digite um e-mail válido (ex: nome@empresa.com).';
        }

        if (!password) {
            novosErros.password = 'Informe sua senha.';
        } else if (emailDigitado !== 'admin' && password.length < 6) {
            novosErros.password = 'A senha deve ter pelo menos 6 caracteres.';
        }

        setErros(novosErros);
        return !novosErros.email && !novosErros.password;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validar()) return;

        if (perfil !== 'agent') {
            setErros((prev) => ({
                ...prev,
                geral: 'O acesso de cliente ainda não está disponível.'
            }));
            return;
        }

        const agents = getAgents();

        if (!agents || agents.length === 0) {
            setErros((prev) => ({
                ...prev,
                geral: 'Nenhum usuário do tipo agente encontrado.'
            }));
            return;
        }

        const emailDigitado = email.trim().toLowerCase();
        const agent = agents.find(
            (a) => (a.email || '').trim().toLowerCase() === emailDigitado
        );

        if (!agent) {
            setErros((prev) => ({
                ...prev,
                email: 'E-mail de agente não encontrado.'
            }));
            return;
        }

        if (agent.role !== 'agent') {
            setErros((prev) => ({
                ...prev,
                geral: 'Este usuário não é do tipo agente.'
            }));
            return;
        }

        if (agent.password !== password) {
            setErros((prev) => ({
                ...prev,
                password: 'Senha incorreta.'
            }));
            return;
        }

        if (lembrar) {
            setSetting('email', email.trim());
        }

        setCurrentUser({
            id: agent.id,
            nome: agent.nome,
            email: agent.email,
            role: agent.role
        });

        navigate('/home');
    }

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-header">
                    <h1>Hórus</h1>
                    <p>Portal Unificado de Atendimento &amp; Governança</p>
                </div>

                <section className="login-card">

                    <div className="login-user-type">
                        <button
                            type="button"
                            className={`tipo-login ${perfil === 'agent' ? 'active' : ''}`}
                            onClick={() => {
                                setPerfil('agent');
                                setErros({ email: '', password: '', geral: '' });
                            }}
                        >
                            <img
                                src="assets/shield.png"
                                alt="shield"
                                className="icon"
                            />
                            Sou Agente
                        </button>

                        <button
                            type="button"
                            className={`tipo-login ${perfil === 'customer' ? 'active' : ''}`}
                            onClick={() => {
                                setPerfil('customer');
                                setErros({ email: '', password: '', geral: '' });
                            }}
                        >
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

                    <form
                        className="login-form"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        {erros.geral && <span className="erro-campo">{erros.geral}</span>}

                        <div className="form-group">
                            <label htmlFor="email">E-mail Corporativo</label>

                            <div className="input-container">
                                <i className="fa-solid fa-at"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu.email@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {erros.email && <span className="erro-campo">{erros.email}</span>}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {erros.password && <span className="erro-campo">{erros.password}</span>}
                        </div>

                        <label className="remember-option">
                            <input
                                type="checkbox"
                                checked={lembrar}
                                onChange={(e) => setLembrar(e.target.checked)}
                            />
                            <span>Lembrar deste computador</span>
                        </label>

                        <button type="submit" className="meu-botao login-button">
                            Acessar Workspace
                        </button>

                        <button type="button" className="register-button" onClick={() => navigate('/cadastro')}>
                            Não possui conta? Clique aqui para se cadastrar
                        </button>

                    </form>
                </section>
            </div>
        </div>
    );
}

export default Login;