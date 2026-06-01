// page.tsx — Painel do Gerente. TODO: Implementar.
'use client';

import React from 'react';

export default function PainelGerentePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>📊 Painel Geral de Indicadores</h2>
      <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff' }}>
        <p><strong>Chamados Abertos:</strong> 14</p>
        <p><strong>Técnicos em Campo:</strong> 4</p>
        <p><strong>Tempo Médio de Atendimento:</strong> 45 min</p>
      </div>
    </div>
  );
}