'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { tecnicoService } from '../../../features/tecnico/services/tecnicoService';
import type { Ticket } from '../../../features/tecnico/types';

const statusLabels: Record<Ticket['status'], string> = {
  ABERTO: 'Aberto',
  ATRIBUIDO: 'Atribuido',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
  NAO_INICIADO: 'Nao iniciado',
};

const statusClasse = (status: Ticket['status']) => {
  if (status === 'EM_ANDAMENTO') return 'tecnico-pill tecnico-pill-info';
  if (status === 'CONCLUIDO') return 'tecnico-pill tecnico-pill-success';
  if (status === 'CANCELADO') return 'tecnico-pill tecnico-pill-danger';
  return 'tecnico-pill tecnico-pill-warning';
};

export default function FilaChamadosPage() {
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChamados = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await tecnicoService.getChamadosAtribuidos();
        setChamados(data);
      } catch (e) {
        console.error('Erro ao carregar chamados do tecnico:', e);
        setError('Nao foi possivel carregar seus chamados atribuidos.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadChamados();
  }, []);

  const resumo = [
    { label: 'Atribuidos', value: chamados.length.toString(), tone: 'success' },
    {
      label: 'Em andamento',
      value: chamados.filter((chamado) => chamado.status === 'EM_ANDAMENTO').length.toString(),
      tone: 'info',
    },
    {
      label: 'Concluidos',
      value: chamados.filter((chamado) => chamado.status === 'CONCLUIDO').length.toString(),
      tone: 'success',
    },
  ];

  return (
    <section className="tecnico-page">
      <div className="tecnico-hero">
        <div>
          <span className="tecnico-kicker">Fila operacional</span>
          <h1 className="tecnico-title">Meus chamados atribuidos</h1>
          <p className="tecnico-subtitle">
            Acompanhe os servicos designados para voce, veja o status atual e abra o detalhe para
            iniciar ou finalizar o atendimento.
          </p>
        </div>

        <div className="fila-summary" aria-label="Resumo da fila">
          {resumo.map((item) => (
            <div key={item.label} className={`fila-summary-item is-${item.tone}`}>
              <strong>{isLoading ? '...' : item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="tecnico-card fila-empty">{error}</p>}

      {!error && isLoading && <p className="tecnico-card fila-empty">Carregando chamados...</p>}

      {!error && !isLoading && chamados.length === 0 && (
        <p className="tecnico-card fila-empty">Nenhum chamado atribuido a voce no momento.</p>
      )}

      {!error && chamados.length > 0 && (
        <div className="fila-grid" aria-label="Lista de chamados atribuidos">
          {chamados.map((chamado) => (
            <article className="tecnico-card fila-card" key={chamado.id}>
              <div className="fila-card-main">
                <div className="fila-card-topline">
                  <span className="fila-id">CH-{String(chamado.id).padStart(3, '0')}</span>
                  <span className={statusClasse(chamado.status)}>{statusLabels[chamado.status]}</span>
                </div>

                <h2>{chamado.tipo_manutencao}</h2>

                <dl className="fila-meta">
                  <div>
                    <dt>Local</dt>
                    <dd>{chamado.local}</dd>
                  </div>
                  <div>
                    <dt>Solicitante</dt>
                    <dd>{chamado.solicitante_id}</dd>
                  </div>
                  <div>
                    <dt>Atualizado em</dt>
                    <dd>{new Date(chamado.updated_at).toLocaleDateString('pt-BR')}</dd>
                  </div>
                </dl>

                <div className="fila-status-row">
                  <span className={statusClasse(chamado.status)}>{statusLabels[chamado.status]}</span>
                  <span>{chamado.descricao}</span>
                </div>
              </div>

              <Link
                className="tecnico-button fila-action"
                href={`/tecnico/chamado/${chamado.id}`}
              >
                Ver detalhes
              </Link>
            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        .fila-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(7.5rem, 1fr));
          gap: 0.75rem;
          min-width: min(100%, 27rem);
        }

        .fila-summary-item,
        .fila-empty {
          padding: 1rem;
          border: 1px solid rgba(13, 43, 94, 0.08);
          border-radius: 20px;
          background: var(--white);
          box-shadow: 0 18px 50px rgba(7, 26, 62, 0.06);
        }

        .fila-summary-item strong {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: 0;
          color: var(--navy-dark);
        }

        .fila-summary-item span,
        .fila-empty {
          display: block;
          margin-top: 0.18rem;
          color: var(--gray-text);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .fila-summary-item.is-success {
          border-color: rgba(61, 201, 102, 0.32);
        }

        .fila-summary-item.is-info {
          border-color: rgba(37, 87, 167, 0.42);
        }

        .fila-grid {
          display: grid;
          gap: 1rem;
        }

        .fila-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 1.25rem;
          align-items: center;
          padding: clamp(1rem, 3vw, 1.35rem);
          transition: border-color 0.2s ease, transform 0.15s ease, background 0.2s ease;
        }

        .fila-card:hover {
          transform: translateY(-2px);
          border-color: rgba(27, 122, 58, 0.22);
          background: var(--white);
        }

        .fila-card-topline,
        .fila-status-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .fila-id {
          color: var(--green);
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .fila-card h2 {
          margin-top: 0.6rem;
          color: var(--navy-dark);
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1.22;
        }

        .fila-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .fila-meta div {
          padding: 0.75rem;
          border-radius: 14px;
          background: var(--off-white);
        }

        .fila-meta dt {
          color: var(--gray-text);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .fila-meta dd {
          margin-top: 0.25rem;
          color: var(--navy);
          font-size: 0.95rem;
          line-height: 1.35;
        }

        .fila-status-row {
          margin-top: 1rem;
          color: var(--gray-text);
          font-size: 0.9rem;
        }

        .fila-status-row span:last-child {
          flex: 1 1 20rem;
        }

        .fila-action {
          min-width: 9.5rem;
        }

        @media (max-width: 780px) {
          .fila-summary,
          .fila-card,
          .fila-meta {
            grid-template-columns: 1fr;
          }

          .fila-action {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
