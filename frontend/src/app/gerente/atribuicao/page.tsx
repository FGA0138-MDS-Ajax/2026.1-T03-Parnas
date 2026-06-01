// page.tsx — Atribuição de Chamados. TODO: Implementar.
'use client';

import React from 'react';

export default function AtribuicaoPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Atribuição de Ordens de Serviço</h2>
      <p style={{ color: '#666' }}>Selecione um chamado da lista para vincular a um técnico disponível.</p>
      <div style={{ border: '1px dashed #ccc', padding: '2rem', textAlign: 'center', marginTop: '1rem', borderRadius: '6px' }}>
        [llista de chamados não gerenciados aparecera aqui]
      </div>
    </div>
  );
}