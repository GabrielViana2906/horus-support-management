import { useState, useEffect } from 'react';

export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo !== null ? JSON.parse(salvo) : valorInicial;
    } catch (e) {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      console.error('Erro ao salvar:', e);
    }
  }, [chave, valor]);

  return [valor, setValor];
}