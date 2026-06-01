import React from 'react';
import Link from 'next/link';
import './landing.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      <div className="hero-content">
        <h1>Solicitação de manutenção<br/><em>simplificada</em></h1>
        <div className="hero-actions">
          <Link href="/login" className="btn-primary">Abrir chamado</Link>
          <a href="#features" className="btn-ghost">Como funciona →</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <div className="hero-logo-wrap">
            <img src="/Keep-unb-logo.png" alt="KeepUnB Logo" style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block', margin: '0 auto' }} />
          </div>
          <div className="stats-row">
            <div className="stat-pill">
              <strong>99</strong>
              <span>chamados atendidos</span>
            </div>
            <div className="stat-pill">
              <strong>99h</strong>
              <span>tempo médio</span>
            </div>
            <div className="stat-pill">
              <strong>99%</strong>
              <span>satisfação</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
