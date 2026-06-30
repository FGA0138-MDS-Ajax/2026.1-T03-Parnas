'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { tecnicoService } from '../../../../features/tecnico/services/tecnicoService';
import type { TechnicianUpdateStatus, Ticket } from '../../../../features/tecnico/types';
import { SERVERBASEURL } from '../../../../features/shared/services/apiClient';

const statusLabels: Record<Ticket['status'], string> = {
  ABERTO: 'Aberto',
  ATRIBUIDO: 'Atribuido',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
  NAO_INICIADO: 'Nao iniciado',
};

const statusClasse = (status: Ticket['status']) => {
  if (status === 'EM_ANDAMENTO') return 'badge-status em_andamento';
  if (status === 'CONCLUIDO') return 'badge-status concluido';
  if (status === 'CANCELADO') return 'badge-status cancelado';
  if (status === 'ATRIBUIDO') return 'badge-status atribuido';
  if (status === 'ABERTO') return 'badge-status aberto';
  if (status === 'NAO_INICIADO') return 'badge-status nao_iniciado';
  return 'badge-status';
};

export default function DetalheChamadoTecnicoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const ticketId = Number(params.id);
  const [chamado, setChamado] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadChamado = async () => {
      if (!Number.isInteger(ticketId) || ticketId <= 0) {
        setChamado(null);
        setNotFoundMessage('Chamado invalido.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        setNotFoundMessage('');
        const data = await tecnicoService.getChamadoAtribuido(ticketId);

        if (!data) {
          setChamado(null);
          setNotFoundMessage('Chamado nao encontrado ou nao atribuido a voce.');
          return;
        }

        setChamado(data);
      } catch (e) {
        console.error('Erro ao carregar chamado do tecnico:', e);
        setChamado(null);
        setError('Nao foi possivel carregar este chamado.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadChamado();
  }, [ticketId]);

  const updateStatus = async (status: TechnicianUpdateStatus) => {
    if (!chamado) return;

    try {
      setIsUpdating(true);
      setError('');
      const updated = await tecnicoService.atualizarStatus(chamado.id, status);
      setChamado(updated);
    } catch (e) {
      console.error('Erro ao atualizar status do chamado:', e);
      setError('Nao foi possivel atualizar o status deste chamado.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvancar = () => {
    if (!chamado) return;
    if (chamado.status === 'ATRIBUIDO' || chamado.status === 'NAO_INICIADO') {
      void updateStatus('EM_ANDAMENTO');
    } else if (chamado.status === 'EM_ANDAMENTO') {
      void updateStatus('CONCLUIDO');
    }
  };

  const handleVoltar = () => {
    if (!chamado) return;
    if (chamado.status === 'EM_ANDAMENTO') {
      void updateStatus('NAO_INICIADO');
    } else if (chamado.status === 'CONCLUIDO') {
      void updateStatus('EM_ANDAMENTO');
    }
  };

  if (isLoading) {
    return <p className="glass-card chamado-feedback">Carregando chamado...</p>;
  }

  if (notFoundMessage || !chamado) {
    return (
      <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
        <div className="glass-card chamado-empty-state">
          <span style={{ color: 'var(--green)', fontFamily: 'Sora', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Chamado indisponivel</span>
          <h1 className="page-title">Nao foi possivel abrir este chamado</h1>
          <p className="tecnico-subtitle">
            {notFoundMessage || 'Este chamado nao esta disponivel para o seu perfil tecnico.'}
          </p>

          <button
            className="btn-secondary"
            onClick={() => router.push('/tecnico/fila')}
            type="button"
          >
            Retornar a fila
          </button>
        </div>

        <style jsx>{`
          .chamado-empty-state {
            display: grid;
            gap: 1rem;
            max-width: 42rem;
            padding: clamp(1.25rem, 3vw, 2rem);
          }

          .chamado-empty-state .tecnico-button {
            justify-self: start;
          }
        `}</style>
      </div>
    );
  }

  const statusLabel = statusLabels[chamado.status];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
      {error && <p className="chamado-feedback">{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ color: 'var(--green)', fontFamily: 'Sora', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Detalhe do chamado</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>{chamado.tipo_manutencao}</h1>
          <p className="page-subtitle">
            Visualize os dados principais do chamado e atualize o andamento do atendimento conforme a execução em campo.
          </p>
        </div>

        <aside className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }} aria-label="Status atual do chamado">
          <span style={{ color: 'var(--green)', fontFamily: 'Sora', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.12em' }}>CH-{String(chamado.id).padStart(3, '0')}</span>
          <span className={statusClasse(chamado.status)}>{statusLabel}</span>
        </aside>
      </div>

      <div className="chamado-layout">
        <article className="glass-card chamado-card">
          <div className="chamado-section-header">
            <div>
              <span className="chamado-section-kicker">Dados principais</span>
              <h2>Resumo operacional</h2>
            </div>
          </div>

          <dl className="chamado-details">
            <div>
              <dt>Local</dt>
              <dd>{chamado.local}</dd>
            </div>
            <div>
              <dt>Tipo de manutenção</dt>
              <dd>{chamado.tipo_manutencao}</dd>
            </div>
          </dl>

          <div className="chamado-description">
            <span>Descrição do problema</span>
            <p style={{ color: '#000' }}>{chamado.descricao}</p>

            {(() => {
              const validPhotoPaths = chamado.photo_paths?.filter(
                path => path && path !== 'null' && path.trim() !== ''
              ) || [];

              if (validPhotoPaths.length > 0) {
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    {validPhotoPaths.map((path, index) => {
                      if (imageErrors[path]) {
                        return (
                          <div key={path} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '150px',
                            backgroundColor: 'var(--off-white, #F4F7FB)',
                            borderRadius: '12px',
                            border: '1px dashed rgba(13,43,94,0.2)',
                            color: 'var(--gray-text)',
                            fontSize: '0.85rem'
                          }}>
                            imagem indisponível
                          </div>
                        );
                      }
                      return (
                        <img
                          key={path}
                          src={`${SERVERBASEURL}${path}`}
                          alt={`Foto da ocorrência ${index + 1}`}
                          onError={() => setImageErrors(prev => ({ ...prev, [path]: true }))}
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(13,43,94,0.12)' }}
                        />
                      );
                    })}
                  </div>
                );
              }
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  minHeight: '150px',
                  marginTop: '1.5rem',
                  backgroundColor: 'var(--off-white, #F4F7FB)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(13,43,94,0.2)',
                  color: 'var(--gray-text)',
                  fontSize: '0.85rem'
                }}>
                  imagem indisponível
                </div>
              );
            })()}
          </div>
        </article>

        <aside className="glass-card chamado-actions">
          <div className="stepper-header">
            <span className="chamado-section-kicker" style={{ color: '#1B7A3A', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block' }}>Atualização</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-dark)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Andamento do atendimento</h2>
            
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Status Atual</span>
            <span className={statusClasse(chamado.status)}>{statusLabel}</span>
          </div>

          <hr className="stepper-divider" />

          <div className="stepper-container">
            <div className="stepper-track">
              {/* Connecting Line 1 (between Node 1 and Node 2) */}
              <div className={`stepper-line line-1 ${
                chamado.status === 'CONCLUIDO' 
                  ? 'is-completed' 
                  : (chamado.status === 'EM_ANDAMENTO' ? 'is-active-yellow' : '')
              }`}></div>

              {/* Connecting Line 2 (between Node 2 and Node 3) */}
              <div className={`stepper-line line-2 ${
                chamado.status === 'CONCLUIDO' 
                  ? 'is-completed' 
                  : ''
              }`}></div>

              {/* Node 1: Não iniciado */}
              <div className="stepper-node">
                <div className={`stepper-circle ${
                  (chamado.status === 'EM_ANDAMENTO' || chamado.status === 'CONCLUIDO') 
                    ? 'is-completed' 
                    : 'is-active is-active-red'
                }`}>
                  {(chamado.status === 'EM_ANDAMENTO' || chamado.status === 'CONCLUIDO') ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <div className="stepper-dot"></div>
                  )}
                </div>
                <span className={`stepper-label ${(chamado.status === 'ATRIBUIDO' || chamado.status === 'NAO_INICIADO') ? 'is-active is-active-red' : ''}`}>Não iniciado</span>
              </div>

              {/* Node 2: Em andamento */}
              <div className="stepper-node">
                <div className={`stepper-circle ${
                  chamado.status === 'CONCLUIDO' 
                    ? 'is-completed' 
                    : (chamado.status === 'EM_ANDAMENTO' ? 'is-active is-active-yellow' : 'is-pending')
                }`}>
                  {chamado.status === 'CONCLUIDO' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (chamado.status === 'EM_ANDAMENTO' ? (
                    <div className="stepper-dot"></div>
                  ) : null)}
                </div>
                <span className={`stepper-label ${chamado.status === 'EM_ANDAMENTO' ? 'is-active is-active-yellow' : ''}`}>Em andamento</span>
              </div>

              {/* Node 3: Concluído */}
              <div className="stepper-node">
                <div className={`stepper-circle ${
                  chamado.status === 'CONCLUIDO' 
                    ? 'is-completed' 
                    : 'is-pending'
                }`}>
                  {chamado.status === 'CONCLUIDO' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : null}
                </div>
                <span className={`stepper-label ${chamado.status === 'CONCLUIDO' ? 'is-active is-active-green' : ''}`}>Concluído</span>
              </div>
            </div>
          </div>

          <div className="chamado-button-row">
            <button
              className="btn-primary stepper-btn-next"
              disabled={isUpdating || chamado.status === 'CONCLUIDO'}
              onClick={handleAvancar}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="11 8 15 12 11 16" />
              </svg>
              Avançar status
            </button>

            <button
              className="btn-secondary stepper-btn-prev"
              disabled={isUpdating || chamado.status === 'ATRIBUIDO' || chamado.status === 'NAO_INICIADO'}
              onClick={handleVoltar}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Voltar status
            </button>

            <button
              className="chamado-muted-button"
              onClick={() => router.push('/tecnico/fila')}
              type="button"
            >
              Retornar a fila
            </button>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .chamado-feedback {
          padding: 1rem;
          color: var(--gray-text);
        }

        .chamado-hero {
          align-items: end;
        }

        .chamado-status-card {
          display: inline-flex;
          min-width: min(100%, 12rem);
          min-height: auto;
          flex-direction: column;
          justify-content: center;
          gap: 0.85rem;
          justify-self: end;
          padding: 1.1rem 1.35rem;
          border-radius: 18px;
        }

        .chamado-id {
          color: var(--green);
          font-family: 'Sora', sans-serif;
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .chamado-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.85fr);
          gap: 1rem;
          align-items: stretch;
        }

        .chamado-card {
          padding: clamp(1.1rem, 3vw, 1.5rem);
          display: flex;
          flex-direction: column;
        }

        .chamado-actions {
          padding: clamp(1.1rem, 3vw, 1.5rem);
        }

        .chamado-section-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 1rem;
        }

        .chamado-section-kicker {
          color: var(--green);
          font-family: 'Sora', sans-serif;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .chamado-card h2,
        .chamado-actions h2 {
          margin-top: 0.35rem;
          color: var(--navy-dark);
          font-family: 'Sora', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0;
        }

        .chamado-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 1.25rem;
        }

        .chamado-details div {
          min-height: 5.4rem;
          padding: 0.95rem;
          border: 1px solid rgba(13, 43, 94, 0.08);
          border-radius: 14px;
          background: var(--off-white);
        }

        .chamado-details dt {
          color: var(--gray-text);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .chamado-details dd {
          margin-top: 0.42rem;
          color: #000;
          font-size: 1rem;
          line-height: 1.45;
        }

        .chamado-description {
          margin-top: 1rem;
          padding: 1.1rem;
          border: 1px solid rgba(27, 122, 58, 0.16);
          border-radius: 20px;
          background: rgba(212, 240, 220, 0.46);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .chamado-description span {
          display: block;
          color: var(--green);
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .chamado-description p,
        .chamado-actions p {
          margin-top: 0.65rem;
          color: var(--gray-text);
          font-size: 0.98rem;
          line-height: 1.7;
        }

        .chamado-actions {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .stepper-header {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stepper-divider {
          border: 0;
          height: 1px;
          background-color: rgba(13, 43, 94, 0.08);
          margin: 1.5rem 0 1.25rem 0;
          width: 100%;
        }

        .stepper-container {
          padding: 1.5rem 0 3.5rem;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .stepper-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 320px;
          position: relative;
          height: 2.2rem;
        }

        .stepper-node {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
          width: 2.2rem;
          height: 2.2rem;
        }

        .stepper-circle {
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .stepper-circle.is-pending {
          border: 2px solid #E2E8F0;
        }

        .stepper-circle.is-completed {
          border: 2px solid var(--green, #1B7A3A);
          color: var(--green, #1B7A3A);
        }

        .stepper-circle.is-active-red {
          border: 2px solid #dc2626;
        }
        .stepper-circle.is-active-yellow {
          border: 2px solid #d97706;
        }
        .stepper-circle.is-active-green {
          border: 2px solid var(--green, #1B7A3A);
        }

        .stepper-dot {
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 50%;
          animation: scaleIn 0.2s ease forwards;
        }
        .stepper-circle.is-active-red .stepper-dot {
          background-color: #dc2626;
        }
        .stepper-circle.is-active-yellow .stepper-dot {
          background-color: #d97706;
        }
        .stepper-circle.is-active-green .stepper-dot {
          background-color: var(--green, #1B7A3A);
        }

        .stepper-label {
          position: absolute;
          top: 3rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gray-text);
          white-space: nowrap;
          transition: color 0.3s ease;
        }

        .stepper-label.is-active {
          font-weight: 700;
        }
        .stepper-label.is-active-red {
          color: #dc2626;
        }
        .stepper-label.is-active-yellow {
          color: #d97706;
        }
        .stepper-label.is-active-green {
          color: var(--green, #1B7A3A);
        }

        .stepper-line {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 2px;
          background: #E2E8F0;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .stepper-line.line-1 {
          left: 1.1rem;
          right: 50%;
        }

        .stepper-line.line-2 {
          left: 50%;
          right: 1.1rem;
        }

        .stepper-line.is-completed {
          background: var(--green, #1B7A3A);
        }

        .stepper-line.is-active-red {
          background: #dc2626;
        }
        .stepper-line.is-active-yellow {
          background: #d97706;
        }

        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .stepper-btn-next {
          background: #1B7A3A !important;
          border: none;
          color: var(--white) !important;
          border-radius: 12px;
          padding: 0.95rem 1.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }

        .stepper-btn-next:hover {
          background: #156E33 !important;
          transform: translateY(-1px);
        }

        .stepper-btn-next:disabled {
          background: #A0AEC0 !important;
          cursor: not-allowed;
          transform: none;
        }

        .stepper-btn-prev {
          background: var(--white) !important;
          border: 1px solid #D2D6DC !important;
          color: var(--navy-dark) !important;
          border-radius: 12px;
          padding: 0.95rem 1.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
        }

        .stepper-btn-prev:hover {
          background: #F8FAFC !important;
          border-color: #B8BFC9 !important;
          transform: translateY(-1px);
        }

        .stepper-btn-prev:disabled {
          background: #F8FAFC !important;
          border-color: #E2E8F0 !important;
          color: #A0AEC0 !important;
          cursor: not-allowed;
          transform: none;
        }

        .chamado-button-row {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .chamado-muted-button {
          min-height: 2.5rem;
          border: 0;
          background: transparent;
          color: var(--gray-text);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 0.86rem;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .chamado-layout,
          .chamado-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
