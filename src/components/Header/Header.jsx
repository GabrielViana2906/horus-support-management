import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import './HeaderStyle.css';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
    getCurrentUser,
    clearCurrentUser,
    getTickets,
    getCustomers
} from '../../database/db';

function Header({ searchQuery, onSearchChange }) {
    const navigate = useNavigate();
    const { alternarTema } = useTheme();
    const [currentUser] = useState(() => getCurrentUser());
    const [localSearch, setLocalSearch] = useState(searchQuery || '');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    const searchInputRef = useRef(null);
    const searchMenuRef = useRef(null);

    const activeSearch = searchQuery !== undefined ? searchQuery : localSearch;
    const trimmedSearch = activeSearch.trim().toLowerCase();

    const tickets = getTickets();
    const customers = getCustomers();

    const matchingTickets = trimmedSearch
        ? tickets.filter((ticket) => {
              const customer = customers.find(
                  (c) => String(c.id) === String(ticket.clientId)
              );
              const customerName = customer ? customer.nome : '';
              const text = `${ticket.id} ${ticket.subject} ${ticket.description || ''} ${ticket.status || ''} ${ticket.queue || ''} ${customerName}`.toLowerCase();
              return text.includes(trimmedSearch);
          }).slice(0, 6)
        : [];

    const matchingCustomers = trimmedSearch
        ? customers.filter((customer) => {
              const text = `${customer.nome} ${customer.empresa || ''} ${customer.email || ''}`.toLowerCase();
              return text.includes(trimmedSearch);
          }).slice(0, 4)
        : [];

    function updatePosition() {
        if (!searchInputRef.current) return;
        const rect = searchInputRef.current.getBoundingClientRect();
        setDropdownPos({
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width
        });
    }

    useEffect(() => {
        if (!isSearchOpen) return;

        function handleClickOutside(event) {
            const clickedInput = searchInputRef.current?.contains(event.target);
            const clickedMenu = searchMenuRef.current?.contains(event.target);
            if (!clickedInput && !clickedMenu) {
                setIsSearchOpen(false);
            }
        }

        function handleReposition() {
            updatePosition();
        }

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleReposition);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleReposition);
        };
    }, [isSearchOpen]);

    function handleSearchInput(event) {
        const value = event.target.value;
        if (onSearchChange) {
            onSearchChange(value);
        } else {
            setLocalSearch(value);
        }
        updatePosition();
        setIsSearchOpen(Boolean(value.trim()));
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        setIsSearchOpen(false);

        if (!onSearchChange) {
            const query = activeSearch.trim();
            navigate(query ? `/home?busca=${encodeURIComponent(query)}` : '/home');
        }
    }

    function handleLogout() {
        clearCurrentUser();
        navigate('/');
    }

    return (
        <header>
            <img
                src="/assets/logo.png"
                alt="Logotipo Hórus"
                className="logo"
                onClick={() => navigate('/home')}
            />

            <form onSubmit={handleSearchSubmit}>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={activeSearch}
                    onChange={handleSearchInput}
                    onFocus={() => {
                        if (activeSearch.trim()) {
                            updatePosition();
                            setIsSearchOpen(true);
                        }
                    }}
                    title="Digite o termo que deseja buscar"
                    placeholder="🔍︎  Pesquisar chamados, clientes, status..."
                    className="search-bar"
                />
            </form>

            {isSearchOpen &&
                trimmedSearch &&
                createPortal(
                    <div
                        ref={searchMenuRef}
                        className="header-search-results"
                        style={{
                            position: 'fixed',
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                            zIndex: 1100
                        }}
                    >
                        {matchingTickets.length === 0 &&
                        matchingCustomers.length === 0 ? (
                            <div className="header-search-empty">
                                Nenhum resultado encontrado para &quot;{activeSearch}&quot;.
                            </div>
                        ) : (
                            <>
                                {matchingTickets.length > 0 && (
                                    <div className="header-search-group">
                                        <span className="header-search-group-title">
                                            Chamados
                                        </span>
                                        {matchingTickets.map((ticket) => (
                                            <button
                                                key={ticket.id}
                                                type="button"
                                                className="header-search-item"
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    navigate(`/ticket/${ticket.id}`);
                                                }}
                                            >
                                                <strong>
                                                    #{ticket.id} — {ticket.subject}
                                                </strong>
                                                <span>
                                                    {ticket.status || 'Aberto'} ·{' '}
                                                    {ticket.queue || 'Não avaliados'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {matchingCustomers.length > 0 && (
                                    <div className="header-search-group">
                                        <span className="header-search-group-title">
                                            Clientes
                                        </span>
                                        {matchingCustomers.map((customer) => (
                                            <button
                                                key={customer.id}
                                                type="button"
                                                className="header-search-item"
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    if (onSearchChange) {
                                                        onSearchChange(customer.nome);
                                                    } else {
                                                        navigate(
                                                            `/home?busca=${encodeURIComponent(customer.nome)}`
                                                        );
                                                    }
                                                }}
                                            >
                                                <strong>{customer.nome}</strong>
                                                <span>
                                                    {customer.empresa || 'Sem empresa'} ·{' '}
                                                    {customer.email}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>,
                    document.body
                )}

            <div className="user-actions">
                <button
                    type="button"
                    id="inverted-color"
                    title="Alternar tema"
                    onClick={() => alternarTema()}
                >
                    <img src="/assets/inverted-color.png" alt="Alternar tema" />
                </button>

                <button type="button" className="notifications" title="Notificações">
                    <img src="/assets/bell.png" alt="Notificações" />
                </button>

                <button type="button" className="settings" title="Configurações">
                    <img src="/assets/settings.png" alt="Configurações" />
                </button>

                <span className="divisor"></span>

                <div className="user-profile">
                    <img src="/assets/userpfp.png" alt="Foto do usuário" />
                    <div>
                        <p className="username">
                            {currentUser ? currentUser.nome : 'Agente'}
                        </p>
                        <p className="status">Online</p>
                    </div>
                </div>

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                    title="Sair da conta"
                >
                    Sair
                </button>
            </div>
        </header>
    );
}

export default Header;
