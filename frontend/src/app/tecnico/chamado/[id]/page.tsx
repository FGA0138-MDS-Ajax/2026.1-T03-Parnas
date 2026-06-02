'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { buscarChamadoPorId, type StatusChamado } from '../../chamados';

const statusLabels: Record<StatusChamado, string> = {
  ATRIBUIDO: 'Atribuído',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
};

const statusClasse = (status: StatusChamado) => {
  if (status === 'EM_ANDAMENTO') return 'tecnico-pill tecnico-pill-info';
  if (status === 'CONCLUIDO') return 'tecnico-pill tecnico-pill-success';
  return 'tecnico-pill tecnico-pill-warning';
};

export default function DetalheChamadoTecnicoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const chamado = buscarChamadoPorId(params.id);

  if (!chamado) {
    notFound();
  }

  const [statusAtual, setStatusAtual] = useState<StatusChamado>(chamado.status);
  const statusLabel = statusLabels[statusAtual];

  const handleIniciarAtendimento = () => {
    setStatusAtual('EM_ANDAMENTO');
  };

  const handleConcluirAtendimento = () => {
    setStatusAtual('CONCLUIDO');
  };

  return (
    <section className="tecnico-page">
      <div className="tecnico-hero chamado-hero">
        <div>
          <span className="tecnico-kicker">Detalhe do chamado</span>
          <h1 className="tecnico-title">{chamado.titulo}</h1>
          <p className="tecnico-subtitle">
            Visualize os dados principais do chamado e atualize o andamento do atendimento conforme a
            execução em campo.
          </p>
        </div>

        <aside className="tecnico-card chamado-status-card" aria-label="Status atual do chamado">
          <span className="chamado-id">{chamado.id}</span>
          <span className={statusClasse(statusAtual)}>{statusLabel}</span>
        </aside>
      </div>

      <div className="chamado-layout">
        <article className="tecnico-card chamado-card">
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
              <dd>{chamado.tipo}</dd>
            </div>
            <div>
              <dt>Status atual</dt>
              <dd>
                <span className={statusClasse(statusAtual)}>{statusLabel}</span>
              </dd>
            </div>
            <div>
              <dt>Estimativa</dt>
              <dd>{chamado.estimativa}</dd>
            </div>
          </dl>

          <div className="chamado-description">
            <span>Descrição do problema</span>
            <p>{chamado.descricao}</p>
          </div>
        </article>

        <aside className="tecnico-card chamado-actions">
          <div>
            <span className="chamado-section-kicker">Atualização</span>
            <h2>Andamento do atendimento</h2>
            <p>
              Altere o status para registrar o início do atendimento ou marcar o chamado como concluído.
            </p>
          </div>

          <div className="chamado-progress" aria-label={`Progresso atual: ${statusLabel}`}>
            {(['ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO'] as StatusChamado[]).map((status) => (
              <span
                key={status}
                className={`chamado-progress-step${statusAtual === status ? ' is-current' : ''}${
                  statusAtual === 'CONCLUIDO' ||
                  (statusAtual === 'EM_ANDAMENTO' && status === 'ATRIBUIDO')
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
              className="tecnico-button tecnico-button-secondary"
              disabled={statusAtual !== 'ATRIBUIDO'}
              onClick={handleIniciarAtendimento}
              type="button"
            >
              Iniciar atendimento
            </button>

            <button
              className="tecnico-button"
              disabled={statusAtual === 'CONCLUIDO'}
              onClick={handleConcluirAtendimento}
              type="button"
            >
              Concluir atendimento
            </button>

            <button
              className="chamado-muted-button"
              onClick={() => router.push('/tecnico/fila')}
              type="button"
            >
              Retornar à fila
            </button>
          </div>
        </aside>
      </div>

      <style jsx>{`
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
    </section>
  );
}
