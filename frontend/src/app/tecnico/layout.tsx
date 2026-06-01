// layout.tsx — Layout do Técnico. TODO: Implementar.
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const botaoEstilo = (rota: string) => ({
    padding: '0.5rem 1rem',
    backgroundColor: pathname === rota ? '#065f46' : '#10b981',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
      
      {/* HEADER DO TÉCNICO */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        background: '#064e3b', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ margin: 0 }}>KeepUnB - Área do Técnico</h2>
        
        {/* MENU */}
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/tecnico/fila" style={botaoEstilo('/tecnico/fila')}>
            Fila de Chamados
          </Link>
          
          <Link href="/tecnico/chamado" style={botaoEstilo('/tecnico/chamado')}>
            Chamado Atual
          </Link>
        </nav>
      </header>
      
      {/* CONTEÚDO */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {children} 
      </main>
    </div>
  );
}