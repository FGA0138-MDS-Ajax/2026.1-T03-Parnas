'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { tecnicoService } from '../../../../features/tecnico/services/tecnicoService';
import type { TechnicianUpdateStatus, Ticket } from '../../../../features/tecnico/types';

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
            Visualize os dados principais do chamado e atualize o andamento do atendimento conforme a execucao em campo.
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
              <dt>Tipo de manutencao</dt>
              <dd>{chamado.tipo_manutencao}</dd>
            </div>
            <div>
              <dt>Status atual</dt>
              <dd>
                <span className={statusClasse(chamado.status)}>{statusLabel}</span>
              </dd>
            </div>
            <div>
              <dt>Solicitante</dt>
              <dd>{chamado.solicitante_id}</dd>
            </div>
          </dl>

          <div className="chamado-description">
            <span>Descricao do problema</span>
            <p>{chamado.descricao}</p>
          </div>
        </article>

        <aside className="glass-card chamado-actions">
          <div>
            <span className="chamado-section-kicker">Atualizacao</span>
            <h2>Andamento do atendimento</h2>
            <p>
              Altere o status para registrar o inicio do atendimento ou marcar o chamado como concluido.
            </p>
          </div>

          <div className="chamado-progress" aria-label={`Progresso atual: ${statusLabel}`}>
            {(['ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO'] as Ticket['status'][]).map((status) => (
              <span
                key={status}
                className={`chamado-progress-step${chamado.status === status ? ' is-current' : ''}${
                  chamado.status === 'CONCLUIDO' ||
                  (chamado.status === 'EM_ANDAMENTO' && status === 'ATRIBUIDO')
                    ? ' is-complete'
                    : ''
                }`}
              >
                {statusLabels[status]}
              </span>
            ))}
          </div>

          <div className="chamado-button-row">
            <button
              className="btn-secondary"
              disabled={isUpdating || chamado.status !== 'ATRIBUIDO'}
              onClick={() => updateStatus('EM_ANDAMENTO')}
              type="button"
            >
              Iniciar atendimento
            </button>

            <button
              className="btn-primary"
              disabled={isUpdating || chamado.status === 'CONCLUIDO'}
              onClick={() => updateStatus('CONCLUIDO')}
              type="button"
            >
              Concluir atendimento
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
          align-items: start;
        }

        .chamado-card,
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
          color: var(--navy);
          font-size: 1rem;
          line-height: 1.45;
        }

        .chamado-description {
          margin-top: 1rem;
          padding: 1.1rem;
          border: 1px solid rgba(27, 122, 58, 0.16);
          border-radius: 20px;
          background: rgba(212, 240, 220, 0.46);
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
          display: grid;
          gap: 1.2rem;
        }

        .chamado-progress {
          display: grid;
          gap: 0.6rem;
        }

        .chamado-progress-step {
          display: flex;
          align-items: center;
          min-height: 2.75rem;
          padding: 0.65rem 0.85rem;
          border: 1px solid rgba(13, 43, 94, 0.08);
          border-radius: 14px;
          background: var(--off-white);
          color: var(--gray-text);
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .chamado-progress-step.is-current {
          border-color: rgba(27, 122, 58, 0.24);
          background: var(--green-pale);
          color: var(--green);
        }

        .chamado-progress-step.is-complete {
          border-color: rgba(27, 122, 58, 0.18);
          color: var(--green);
        }

        .chamado-button-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
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
