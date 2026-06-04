// layout.tsx — Layout da Área do Gerente com identidade visual KeepUnB
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../../features/gerente/components/gerente.css';
import AuthGuard from '../../features/shared/components/AuthGuard';
import { authService } from '../../features/shared/services/authService';

export default function GerenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Gerente de Operações');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Fecha a barra lateral automaticamente na mudança de página
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Tenta recuperar o nome real do usuario autenticado
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('keepunb_email') || '';
      const nome = localStorage.getItem('keepunb_nome') || '';
      if (nome) {
        setUserName(nome);
      } else if (email) {
        setUserName(email.split('@')[0]);
      }
    }
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Deseja realmente sair da plataforma KeepUnB?')) {
      authService.logout();
      router.push('/login');
    }
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <AuthGuard allowedRoles={['GERENTE']}>
    <div className={`gerente-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* SIDEBAR DO GERENTE */}
      <aside className={`gerente-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-mobile">
          <div className="sidebar-logo">
            {/* Ícone de ferramenta SVG nativo do React */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>Keep<em>UnB</em></span>
          </div>

          <button 
            className="hamburger-menu" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* NAVEGAÇÃO */}
        <nav style={{ flex: 1 }} className="sidebar-nav">
          <ul className="sidebar-menu">
            <li>
              <Link href="/gerente/painel" className={`menu-item-link ${isActive('/gerente/painel')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                </svg>
                <span>Painel Geral</span>
              </Link>
            </li>
            
            <li>
              <Link href="/gerente/atribuicao" className={`menu-item-link ${isActive('/gerente/atribuicao')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                <span>Atribuição Fila</span>
              </Link>
            </li>

            <li>
              <Link href="/gerente/relatorios" className={`menu-item-link ${isActive('/gerente/relatorios')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Relatórios</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* PERFIL DO USUÁRIO LOGADO */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <h4 className="user-name">{userName}</h4>
            <span className="user-role">Supervisão Geral</span>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Sair do Sistema">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DA ROTA */}
      <main className="gerente-content">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
