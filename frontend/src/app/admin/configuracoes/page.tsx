'use client';

import React from 'react';

export default function AdminConfiguracoesPage() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* CABEÇALHO */}
      <header className="content-header">
        <div>
          <h1 className="content-title">Configurações do Sistema</h1>
          <p className="content-subtitle">Gerencie os parâmetros gerais e configurações operacionais da plataforma KeepUnB.</p>
        </div>
      </header>

      {/* CONTAINER DAS CONFIGURAÇÕES */}
      <div className="premium-table-container" style={{ padding: '2.5rem', background: 'var(--white)' }}>
        <h3 style={{ fontFamily: 'Sora', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚙️</span> Parâmetros Operacionais
        </h3>
        <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Painel de configurações gerais da infraestrutura do KeepUnB. Esta área é restrita a administradores. 
          Configurações adicionais serão disponibilizadas conforme novos módulos de integração forem homologados.
        </p>

        {/* CONFIGS CARD */}
        <div style={{ border: '1px solid rgba(13, 43, 94, 0.08)', borderRadius: '14px', padding: '1.5rem', background: 'rgba(13, 43, 94, 0.01)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-text)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ambiente do Sistema</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'block', marginTop: '0.25rem' }}>FCTE Campus Gama — UnB</span>
          <span style={{ fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            Serviço de Banco de Dados Ativo
          </span>
        </div>
      </div>
    </div>
  );
}
