import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(() => {
        return localStorage.getItem('tema') || 'claro';
    });

    useEffect(() => {
        document.documentElement.setAttribute('tema', tema);
        localStorage.setItem('tema', tema);
    }, [tema]);

    function alternarTema() {
        setTema(temaAtual => (temaAtual === 'claro' ? 'escuro' : 'claro'));
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}