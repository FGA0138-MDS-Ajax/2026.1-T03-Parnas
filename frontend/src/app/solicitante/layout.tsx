// layout.tsx — Layout da Área do Solicitante com identidade visual KeepUnB
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

  useEffect(() => {
    // Tenta carregar informações salvas no localStorage
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('keepunb_email') || '';
      const nome = localStorage.getItem('keepunb_nome') || '';
      const matricula = localStorage.getItem('keepunb_matricula') || '';
      setUserMatricula(matricula);

      if (nome) {
        setUserName(nome);
      } else if (email) {
        const parsedName = email.split('@')[0];
        setUserName(parsedName.charAt(0).toUpperCase() + parsedName.slice(1));
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
    return pathname === path ? 'active' : '';
  };

  return (
    <AuthGuard allowedRoles={['SOLICITANTE']}>
    <div className="solicitante-layout">
      {/* SIDEBAR DO SOLICITANTE */}
      <aside className="solicitante-sidebar">
        <div className="sidebar-logo">
          {/* Ícone de operário/manutenção SVG nativo */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
          <span>Keep<em>UnB</em></span>
        </div>

        {/* NAVEGAÇÃO INTERNA */}
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

          </ul>
        </nav>

        {/* INFORMAÇÕES DE LOGIN E LOGOUT */}
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

      {/* ÁREA DE CONTEÚDO PRINCIPAL DA ROTA */}
      <main className="solicitante-content">
        {children}
      </main>
    </div>
    </AuthGuard>
  );
}
