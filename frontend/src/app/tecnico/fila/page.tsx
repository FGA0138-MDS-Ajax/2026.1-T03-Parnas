'use client';

import React from 'react';
import Link from 'next/link';

import { chamadosAtribuidos } from '../chamados';

const resumo = [
  { label: 'Atribuídos', value: chamadosAtribuidos.length.toString(), tone: 'success' },
  { label: 'Urgentes', value: chamadosAtribuidos.filter((c) => c.prioridade === 'Urgente').length.toString(), tone: 'danger' },
  { label: 'Tempo médio', value: '35 min', tone: 'info' },
];

const prioridadeClasse = (prioridade: string) =>
  prioridade === 'Urgente' ? 'tecnico-pill tecnico-pill-danger' : 'tecnico-pill tecnico-pill-warning';

export default function FilaChamadosPage() {
  return (
    <section className="tecnico-page">
      <div className="tecnico-hero">
        <div>
          <span className="tecnico-kicker">Fila operacional</span>
          <h1 className="tecnico-title">Meus chamados atribuídos</h1>
          <p className="tecnico-subtitle">
            Acompanhe os serviços designados para a sua escala, veja prioridades e abra o detalhe para
            iniciar ou finalizar o atendimento sem perder o contexto do chamado.
          </p>
        </div>

        <div className="fila-summary" aria-label="Resumo da fila">
          {resumo.map((item) => (
            <div key={item.label} className={`fila-summary-item is-${item.tone}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fila-grid" aria-label="Lista de chamados atribuídos">
        {chamadosAtribuidos.map((chamado) => (
          <article className="tecnico-card fila-card" key={chamado.id}>
            <div className="fila-card-main">
              <div className="fila-card-topline">
                <span className="fila-id">{chamado.id}</span>
                <span className={prioridadeClasse(chamado.prioridade)}>{chamado.prioridade}</span>
              </div>

              <h2>{chamado.titulo}</h2>

              <dl className="fila-meta">
                <div>
                  <dt>Local</dt>
                  <dd>{chamado.local}</dd>
                </div>
                <div>
                  <dt>Tipo</dt>
                  <dd>{chamado.tipo}</dd>
                </div>
                <div>
                  <dt>Estimativa</dt>
                  <dd>{chamado.estimativa}</dd>
                </div>
              </dl>

              <div className="fila-status-row">
                <span className="tecnico-pill tecnico-pill-success">{chamado.status}</span>
                <span>Pronto para atendimento em campo</span>
              </div>
            </div>

            <Link
              className="tecnico-button fila-action"
              href={`/tecnico/chamado/${encodeURIComponent(chamado.id)}`}
            >
              Ver detalhes
            </Link>
          </article>
        ))}
      </div>

      <style jsx>{`
        .fila-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(7.5rem, 1fr));
          gap: 0.75rem;
          min-width: min(100%, 27rem);
        }

        .fila-summary-item {
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

        .fila-summary-item span {
          display: block;
          margin-top: 0.18rem;
          color: var(--gray-text);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .fila-summary-item.is-success {
          border-color: rgba(61, 201, 102, 0.32);
        }

        .fila-summary-item.is-danger {
          border-color: rgba(248, 113, 113, 0.3);
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
