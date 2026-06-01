'use client';

import React from 'react';
import Link from 'next/link'; // Importa o componente de navegação do Next.js
import { usePathname } from 'next/navigation'; // Muda a cor do botao ativo

export default function SolicitanteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Destacar os botoes
  const botaoEstilo = (rota: string) => ({
    padding: '0.5rem 1rem',
    backgroundColor: pathname === rota ? '#002244' : '#004488',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f7fafc' }}>
      
      {/* HEADER PRINCIPAL COM O MENU DE BOTÕES */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        background: '#003366', 
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ margin: 0 }}>KeepUnB - Área do Solicitante</h2>
        
        {/* BOTÕES DE NAVEGAÇÃO */}
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/solicitante/dashboard" style={botaoEstilo('/solicitante/dashboard')}>
            📊 Dashboard
          </Link>
          
          <Link href="/solicitante/nova-solicitacao" style={botaoEstilo('/solicitante/nova-solicitacao')}>
            ➕ Nova Solicitação
          </Link>

          <Link href="/solicitante/minhas-solicitacoes" style={botaoEstilo('/solicitante/minhas-solicitacoes')}>
            📋 Minhas Solicitações
          </Link>
        </nav>
      </header>
      
      {/* CONTEÚDO DINÂMICO (ir pra pagina dos botoes*/}
      <main style={{ flex: 1, padding: '2rem' }}>
        {children} 
      </main>
    </div>
  );
}