
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../../features/solicitante/components/solicitante.css';
import AuthGuard from '../../features/shared/components/AuthGuard';
import { authService } from '../../features/shared/services/authService';

export default function SolicitanteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Solicitante');
  const [userMatricula, setUserMatricula] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('keepunb_email') || '';
      const nome = sessionStorage.getItem('keepunb_nome') || '';
      const matricula = sessionStorage.getItem('keepunb_matricula') || '';
      setUserMatricula(matricula);

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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    authService.logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  return (
    <AuthGuard allowedRoles={['SOLICITANTE']}>
    <div className={`solicitante-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      
      <aside className={`solicitante-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header-mobile">
          <div className="sidebar-logo">
            <img src="/logo-red.png" width="36" height="36" alt="KeepUnB" style={{ marginRight: '8px' }} />
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
        <nav style={{ flex: 1 }}>
          <ul className="sidebar-menu">
            <li className="menu-li-dashboard">
              <Link href="/solicitante/dashboard" className={`menu-item-link ${isActive('/solicitante/dashboard')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Início</span>
              </Link>
            </li>
            
            <li className="menu-li-nova">
              <Link href="/solicitante/nova-solicitacao" className={`menu-item-link ${isActive('/solicitante/nova-solicitacao')}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" strokeWidth="2.5" />
                </svg>
                <span>Nova Solicitação</span>
              </Link>
            </li>
            
            <li className="menu-li-outras">
              <Link 
                href="/solicitante/dashboard#outras-solicitacoes" 
                className="menu-item-link"
                onClick={(e) => {
                  if (pathname === '/solicitante/dashboard') {
                    e.preventDefault();
                    window.dispatchEvent(new Event('openOutrasSolicitacoes'));
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Outras Solicitações</span>
              </Link>
            </li>

          </ul>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <h4 className="user-name">{userName}</h4>
            <span className="user-role">Solicitante FCTE</span>
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

      <main className="solicitante-content">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
