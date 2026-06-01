// page.tsx — Detalhes do Chamado [id]. TODO: Implementar.
'use client';

import React from 'react';

export default function DetalhesChamadoPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#10b981', marginBottom: '1.5rem' }}>🔧 Detalhes do Chamado em Execução</h2>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h3>CH001 - Ar condicionado vazando</h3>
        <p style={{ color: '#666', marginTop: '0.5rem' }}><strong>Solicitante:</strong> Prof. Carlos (Engenharia)</p>
        <p style={{ color: '#666' }}><strong>Descrição:</strong> O aparelho está ligando, mas após 10 minutos começa a gotejar muito em cima das mesas.</p>
        <button style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Concluir Manutenção
        </button>
      </div>
    </div>
  );
}