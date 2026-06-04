'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import AuthGuard from '../../features/shared/components/AuthGuard';
import { authService } from '../../features/shared/services/authService';

const navItems = [
  { href: '/tecnico/fila', label: 'Fila de chamados', eyebrow: 'Triagem' },
  { href: '/tecnico/chamado', label: 'Chamado atual', eyebrow: 'Execução' },
];

export default function TecnicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Técnico');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nome = localStorage.getItem('keepunb_nome') || '';
      const email = localStorage.getItem('keepunb_email') || '';

      if (nome) {
        setUserName(nome);
      } else if (email) {
        setUserName(email.split('@')[0]);
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  return (
    <AuthGuard allowedRoles={['TECNICO']}>
    <div className="tecnico-shell">
      <aside className="tecnico-sidebar">
        <Link href="/tecnico/fila" className="tecnico-brand" aria-label="Ir para a fila de chamados">
          <strong>
            Keep<span>UnB</span>
          </strong>
          <small>Área do Técnico</small>
        </Link>

        <nav className="tecnico-nav" aria-label="Navegação do técnico">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/tecnico/chamado' && pathname.startsWith('/tecnico/chamado/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`tecnico-nav-link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <small>{item.eyebrow}</small>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="tecnico-user-card" aria-label="Perfil do usuário logado">
          <span className="tecnico-user-avatar" aria-hidden="true">
            {userName.substring(0, 2).toUpperCase()}
          </span>
          <span className="tecnico-user-info">
            <strong>{userName}</strong>
            <small>Manutenção Predial</small>
          </span>
          <button className="tecnico-user-exit" onClick={handleLogout} type="button" aria-label="Sair">
            →
          </button>
        </div>
      </aside>

      <main className="tecnico-main">{children}</main>

      <style jsx global>{`
        .tecnico-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 17rem minmax(0, 1fr);
          background:
            linear-gradient(180deg, rgba(244, 247, 251, 0.92) 0%, rgba(255, 255, 255, 0.98) 24rem),
            var(--white);
          color: var(--navy-dark);
          font-family: 'DM Sans', sans-serif;
        }

        .tecnico-sidebar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          min-height: 100vh;
          height: 100vh;
          flex-direction: column;
          gap: 2rem;
          padding: 1.35rem 1.25rem;
          background: var(--navy-dark);
          border-right: 1px solid rgba(13, 43, 94, 0.18);
          box-shadow: 12px 0 28px rgba(7, 26, 62, 0.12);
        }

        .tecnico-brand {
          display: grid;
          gap: 0.25rem;
          color: var(--white);
          text-decoration: none;
          width: 100%;
        }

        .tecnico-brand strong {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.05;
        }

        .tecnico-brand strong span {
          color: var(--green-light);
        }

        .tecnico-brand small {
          display: block;
          margin-top: 0.18rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .tecnico-nav {
          display: grid;
          gap: 0.75rem;
        }

        .tecnico-nav-link {
          width: 100%;
          padding: 0.75rem 0.95rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
          text-decoration: none;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }

        .tecnico-nav-link:hover {
          transform: translateY(-2px);
          border-color: rgba(61, 201, 102, 0.42);
          background: rgba(255, 255, 255, 0.14);
        }

        .tecnico-nav-link.is-active {
          border-color: rgba(61, 201, 102, 0.65);
          background: var(--green);
          box-shadow: 0 14px 30px rgba(27, 122, 58, 0.32);
        }

        .tecnico-nav-link small {
          display: block;
          color: rgba(255, 255, 255, 0.66);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .tecnico-nav-link span {
          display: block;
          margin-top: 0.15rem;
          font-family: 'Sora', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0;
        }

        .tecnico-user-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 0.75rem;
          align-items: center;
          margin-top: auto;
          padding: 0.85rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--white);
        }

        .tecnico-user-avatar {
          display: grid;
          place-items: center;
          width: 2.4rem;
          height: 2.4rem;
          border: 2px solid var(--green-light);
          border-radius: 100px;
          background: rgba(61, 201, 102, 0.14);
          color: var(--white);
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0;
        }

        .tecnico-user-info {
          min-width: 0;
        }

        .tecnico-user-info strong,
        .tecnico-user-info small {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tecnico-user-info strong {
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0;
        }

        .tecnico-user-info small {
          margin-top: 0.12rem;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.74rem;
          font-weight: 500;
        }

        .tecnico-user-exit {
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          font-weight: 800;
        }

        .tecnico-main {
          width: calc(100% - clamp(3rem, 6vw, 7rem));
          max-width: 1120px;
          margin: 0 auto;
          padding: clamp(1.5rem, 4vw, 3rem) 0 3.5rem;
        }

        .tecnico-page {
          display: grid;
          gap: 1.35rem;
        }

        .tecnico-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 1.25rem;
          align-items: end;
        }

        .tecnico-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 0.45rem;
          padding: 0.38rem 0.78rem;
          border-radius: 100px;
          background: var(--green-pale);
          color: var(--green);
          font-family: 'Sora', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .tecnico-title {
          margin-top: 0.85rem;
          font-family: 'Sora', sans-serif;
          font-size: clamp(2rem, 4vw, 3.15rem);
          font-weight: 800;
          letter-spacing: 0;
          line-height: 1.04;
          color: var(--navy-dark);
        }

        .tecnico-subtitle {
          max-width: 44rem;
          margin-top: 0.8rem;
          color: var(--gray-text);
          font-size: 1.02rem;
          line-height: 1.7;
        }

        .tecnico-card {
          border: 1px solid rgba(13, 43, 94, 0.08);
          border-radius: 20px;
          background: var(--white);
          box-shadow: 0 18px 50px rgba(7, 26, 62, 0.08);
        }

        .tecnico-pill {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          min-height: 1.7rem;
          padding: 0.28rem 0.68rem;
          border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .tecnico-pill-success {
          background: var(--green-pale);
          color: var(--green);
        }

        .tecnico-pill-info {
          background: rgba(37, 87, 167, 0.12);
          color: var(--navy-light);
        }

        .tecnico-pill-warning {
          background: #fff4d8;
          color: #9a6500;
        }

        .tecnico-pill-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .tecnico-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.85rem;
          padding: 0.75rem 1rem;
          border: 0;
          border-radius: 10px;
          background: var(--green);
          color: var(--white);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
        }

        .tecnico-button:hover {
          background: var(--green-mid);
          transform: translateY(-2px);
        }

        .tecnico-button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          transform: none;
        }

        .tecnico-button-secondary {
          border: 1px solid rgba(13, 43, 94, 0.14);
          background: var(--white);
          color: var(--navy);
        }

        .tecnico-button-secondary:hover {
          background: var(--off-white);
        }

        @media (max-width: 780px) {
          .tecnico-shell {
            display: block;
          }

          .tecnico-sidebar,
          .tecnico-hero {
            align-items: stretch;
            grid-template-columns: 1fr;
          }

          .tecnico-sidebar {
            position: static;
            min-height: auto;
            height: auto;
            gap: 1rem;
          }

          .tecnico-brand,
          .tecnico-nav,
          .tecnico-nav-link {
            width: 100%;
          }

          .tecnico-nav {
            display: grid;
            grid-template-columns: 1fr;
          }

          .tecnico-user-card {
            margin-top: 0.25rem;
          }

          .tecnico-main {
            width: min(100% - 2rem, 1120px);
          }
        }
      `}</style>
    </div>
    </AuthGuard>
  );
}
