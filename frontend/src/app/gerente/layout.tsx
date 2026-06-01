// layout.tsx — Layout do Gerente. TODO: Implementar.
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GerenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const botaoEstilo = (rota: string) => ({
    padding: '0.5rem 1rem',
    backgroundColor: pathname === rota ? '#b45309' : '#f59e0b',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#fffbeb' }}>
      
      {/* HEADER DO GERENTE */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        background: '#78350f', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ margin: 0 }}>KeepUnB - Área do Gerente</h2>
        
        {/* MENU */}
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/gerente/painel" style={botaoEstilo('/gerente/painel')}>
            📊 Painel
          </Link>
          
          <Link href="/gerente/atribuicao" style={botaoEstilo('/gerente/atribuicao')}>
            🎯 Atribuição
          </Link>

          <Link href="/gerente/relatorios" style={botaoEstilo('/gerente/relatorios')}>
            📈 Relatórios
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