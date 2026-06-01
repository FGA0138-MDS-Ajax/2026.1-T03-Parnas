'use client';

import React from 'react';
import Link from 'next/link';

export default function FilaChamadosPage() {
  // MOCK: Lista de chamados ATRIBUÍDOS especificamente a este técnico
  const chamadosAtribuidos = [
    { id: 'CH-001', titulo: 'Ar condicionado vazando no Auditório', local: 'Auditório - FCTE', status: 'ATRIBUIDO', prioridade: 'Média' },
    { id: 'CH-005', titulo: 'Manutenção do Forno do RU', local: 'RU - FCTE', status: 'EM EXECUÇÃO', prioridade: 'Urgente' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>
        <h2 style={{ color: '#065f46', margin: 0 }}> Meus Chamados Atribuídos</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>Estes são os chamados designados para a sua escala de trabalho hoje.</p>
      </div>

      {/* Listagem de Chamados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {chamadosAtribuidos.map((c) => (
          <div 
            key={c.id} 
            style={{ 
              border: '1px solid #e5e7eb', 
              padding: '1.2rem', 
              borderRadius: '8px', 
              backgroundColor: '#fff', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 'bold' }}>{c.id}</span>
              <h3 style={{ margin: '0.2rem 0', color: '#1f2937', fontSize: '1.1rem' }}>{c.titulo}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}> {c.local}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {c.status}
                </span>
                <span style={{ padding: '0.2rem 0.5rem', backgroundColor: c.prioridade === 'Urgente' ? '#fee2e2' : '#fef3c7', color: c.prioridade === 'Urgente' ? '#991b1b' : '#92400e', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {c.prioridade}
                </span>
              </div>
            </div>

            
            {/* Acesso ao detalhe do chamado passando dados via Query Params */}
<div>
  <Link 
    href={`/tecnico/chamado?id=${c.id}&titulo=${encodeURIComponent(c.titulo)}&local=${encodeURIComponent(c.local)}&status=${encodeURIComponent(c.status)}`}
    style={{ 
      padding: '0.5rem 1rem', 
      backgroundColor: '#10b981', 
      color: 'white', 
      textDecoration: 'none', 
      borderRadius: '4px', 
      fontWeight: 'bold', 
      fontSize: '0.85rem',
      display: 'inline-block'
    }}
  >
    Ver Detalhes
  </Link>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}