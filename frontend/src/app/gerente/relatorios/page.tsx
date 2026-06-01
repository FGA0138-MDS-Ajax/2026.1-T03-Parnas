// page.tsx — Relatórios. TODO: Implementar.
'use client';

import React from 'react';

export default function RelatoriosPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>📈 Relatórios Mensais de Desempenho</h2>
      <button style={{ padding: '0.6rem 1rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        📥 Exportar PDF de Performance
      </button>
    </div>
  );
}