import './css/LoginStyle.css'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { addCustomer, generateCustomerId } from '../database/db';

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [erros, setErros] = useState({});

    function validar() {
        const novosErros = {};

        if (!nome.trim()) {
            novosErros.nome = 'Informe seu nome completo.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            novosErros.email = 'Informe seu e-mail.';
        } else if (!emailRegex.test(email)) {
            novosErros.email = 'Digite um e-mail válido (ex: nome@empresa.com).';
        }

        if (!password) {
            novosErros.password = 'Informe uma senha.';
        } else if (password.length < 6) {
            novosErros.password = 'A senha deve ter pelo menos 6 caracteres.';
        }

        if (!confirmar) {
            novosErros.confirmar = 'Confirme sua senha.';
        } else if (confirmar !== password) {
            novosErros.confirmar = 'As senhas não coincidem.';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validar()) return;

        const customer = {
            id: generateCustomerId(),
            nome: nome.trim(),
            email: email.trim(),
            password,
            role: 'customer',
            criadoEm: new Date().toISOString()
        };

        
        addCustomer(customer);

        navigate('/');
    }

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-header">
                    <h1>Hórus</h1>
                    <p>Crie sua conta</p>
                </div>

                <section className="login-card">
                    <form className="login-form" noValidate onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="nome">Nome completo</label>
                            <div className="input-container">
                                <i className="fa-solid fa-user"></i>
                                <input
                                    type="text"
                                    id="nome"
                                    placeholder="Seu nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            {erros.nome && <span className="erro-campo">{erros.nome}</span>}
                        </div>

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
                            <label htmlFor="password">Senha</label>
                            <div className="input-container">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Mínimo de 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {erros.password && <span className="erro-campo">{erros.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmar">Confirmar senha</label>
                            <div className="input-container">
                                <i className="fa-solid fa-key"></i>
                                <input
                                    type="password"
                                    id="confirmar"
                                    placeholder="Repita a senha"
                                    value={confirmar}
                                    onChange={(e) => setConfirmar(e.target.value)}
                                />
                            </div>
                            {erros.confirmar && <span className="erro-campo">{erros.confirmar}</span>}
                        </div>

                        <button type="submit" className="meu-botao login-button">
                            Criar conta
                        </button>

                        <button
                            type="button"
                            className="register-button"
                            onClick={() => navigate('/')}
                        >
                            Já possui conta? Voltar para o login
                        </button>

                    </form>
                </section>
            </div>
        </div>
    );
}

export default Cadastro;