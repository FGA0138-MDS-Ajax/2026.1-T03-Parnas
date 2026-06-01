import React from 'react';
import Link from 'next/link';
import './landing.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Manutenção da UnB<br />mais simples<br />com o KeepUnB.</h1>
        <p>
          Abra e acompanhe seus chamados de manutenção<br />
          de forma rápida, fácil e transparente.
        </p>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <div className="card-icon-wrap">
            <img src="/keep-unb-half.png" alt="KeepUnB Logo" className="card-logo-img" />
          </div>
          <h2 className="card-title">Abra seu chamado</h2>
          
          <div className="card-form">
            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <input type="text" placeholder="Digite seu local ou bloco" className="form-input" />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <select className="form-select" defaultValue="">
                <option value="" disabled>Tipo de problema</option>
                <option value="eletrica">Elétrica</option>
                <option value="hidraulica">Hidráulica</option>
                <option value="estrutura">Estrutura</option>
              </select>
              <div className="select-chevron">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <Link href="/login" className="btn-card-submit">
              Continuar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
