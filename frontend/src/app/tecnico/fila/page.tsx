// page.tsx — Fila de Chamados. TODO: Implementar.
'use client';

import React from 'react';

export default function FilaChamadosPage() {
  // Mock simples de chamados para o técnico ver na fila
  const chamados = [
    { id: 'CH001', titulo: 'Ar condicionado vazando', local: 'Sala A1', prioridade: 'Alta' },
    { id: 'CH002', titulo: 'Projetor não liga', local: 'Auditório', prioridade: 'Média' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#10b981', marginBottom: '1.5rem' }}>📥 Fila de Chamados Disponíveis</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chamados.map((c) => (
          <div key={c.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong>[{c.id}] {c.titulo}</strong> - <small>{c.local}</small>
            </div>
            <span style={{ padding: '0.3rem 0.6rem', backgroundColor: c.prioridade === 'Alta' ? '#fee2e2' : '#fef3c7', color: c.prioridade === 'Alta' ? '#991b1b' : '#92400e', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {c.prioridade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}