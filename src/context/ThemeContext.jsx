import { createContext, useContext, useState, useEffect } from 'react';
import { getSetting, setSetting } from '../database/db';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState(() => {
        return getSetting('tema') || 'claro';
    });

    useEffect(() => {
        document.documentElement.setAttribute('tema', tema);
        setSetting('tema', tema);
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