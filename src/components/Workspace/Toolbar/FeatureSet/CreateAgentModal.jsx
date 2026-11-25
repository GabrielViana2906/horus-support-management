import { useState } from 'react';
import { addAgent, generateAgentId } from '../../../../database/db';
import './FeatureSetStyle.css';

export default function CreateAgentModal({ onClose }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [exigirTroca, setExigirTroca] = useState(false);
    const [erros, setErros] = useState({});

    function validar() {
        const novosErros = {};

        if (!nome.trim()) {
            novosErros.nome = 'Informe o nome do agente.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            novosErros.email = 'Informe o e-mail.';
        } else if (!emailRegex.test(email)) {
            novosErros.email = 'Digite um e-mail válido.';
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

        const agent = {
            id: generateAgentId(),
            nome: nome.trim(),
            email: email.trim(),
            password,
            role: 'agent',
            exigirTrocaSenha: exigirTroca ? 1 : 0, // binário: 1 = sim, 0 = não
            criadoEm: new Date().toISOString()
        };

        addAgent(agent);
        onClose();
    }

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Criar Agente</h3>
                        <button className="modal-close" onClick={onClose}>&times;</button>
                    </div>

                    <form className="modal-form" noValidate onSubmit={handleSubmit}>
                        <div className="modal-field">
                            <label>Nome do agente</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Nome completo do agente"
                            />
                            {erros.nome && <span className="modal-erro">{erros.nome}</span>}
                        </div>

                        <div className="modal-field">
                            <label>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu.email@empresa.com"
                            />
                            {erros.email && <span className="modal-erro">{erros.email}</span>}
                        </div>

                        <div className="modal-field">
                            <label>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo de 6 caracteres"
                            />
                            {erros.password && <span className="modal-erro">{erros.password}</span>}
                        </div>

                        <div className="modal-field">
                            <label>Confirmar senha</label>
                            <input
                                type="password"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                placeholder="Repita a senha"
                            />
                            {erros.confirmar && <span className="modal-erro">{erros.confirmar}</span>}
                        </div>

                        <div className="modal-field modal-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={exigirTroca}
                                    onChange={(e) => setExigirTroca(e.target.checked)}
                                />
                                Exigir troca de senha no próximo login
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="modal-btn-cancel" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="modal-btn-save">
                                Criar agente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
