'use client';

import { useEffect, useState } from 'react';

/**
 * Hook reutilizável que lê o nome do usuário logado a partir do sessionStorage
 * e retorna o nome formatado (capitalizado, pontos convertidos em espaços).
 *
 * Utilizado pelo layout do técnico e pela página de fila de chamados.
 */
export function useUserName(fallback = 'Técnico'): string {
  const [userName, setUserName] = useState(fallback);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nome = sessionStorage.getItem('keepunb_nome') || '';
      const email = sessionStorage.getItem('keepunb_email') || '';

      if (nome) {
        const formattedName = nome
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else if (email) {
        const parsedName = email.split('@')[0];
        const formattedName = parsedName
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      }
    }
  }, []);

  return userName;
}
