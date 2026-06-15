// AprovarTecnicos.tsx - Componente para aprovação de técnicos pendentes
'use client';

import React, { useState, useEffect } from 'react';

interface TecnicoPendente {
  id: number;
  nome: string;
  email: string;
  areaManutencao: string;
}

interface AprovarTecnicosProps {
  // Props que o componente pode receber
}

const AprovarTecnicos: React.FC<AprovarTecnicosProps> = () => {
  const [tecnicos, setTecnicos] = useState<TecnicoPendente[]>([
    { id: 1, nome: 'João Silva', email: 'joao.silva@unb.br', areaManutencao: 'Elétrica' },
    { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@unb.br', areaManutencao: 'Hidráulica' },
    { id: 3, nome: 'Carlos Santos', email: 'carlos.santos@unb.br', areaManutencao: 'Pintura' },
  ]);

  const handleAprovar = (id: number) => {
    console.log(`Aprovando técnico com ID: ${id}`);
    // Remover o técnico da lista após aprovação
    setTecnicos(tecnicos.filter(tecnico => tecnico.id !== id));
  };

  const handleRejeitar = (id: number) => {
    console.log(`Rejeitando técnico com ID: ${id}`);
    // Remover o técnico da lista após rejeição
    setTecnicos(tecnicos.filter(tecnico => tecnico.id !== id));
  };

  return (
    <section className="section-panel" style={{ marginTop: '2rem' }}>
      <div className="panel-header-row">
        <h2 className="panel-title">Técnicos Pendentes de Aprovação ({tecnicos.length})</h2>
      </div>

      {tecnicos.length === 0 ? (
        <div className="table-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg className="empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.6 }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Não há técnicos pendentes de aprovação</p>
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Nome</th>
                <th style={{ width: '250px' }}>Email</th>
                <th>Área de Manutenção</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tecnicos.map((tecnico) => (
                <tr key={tecnico.id}>
                  <td className="ticket-cell-local">{tecnico.nome}</td>
                  <td className="ticket-cell-local">{tecnico.email}</td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: 'var(--green-pale, #D4F0DC)', color: 'var(--green, #1B7A3A)' }}>
                      {tecnico.areaManutencao}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="tecnico-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn-table-action" 
                        style={{ 
                          backgroundColor: 'var(--green, #1B7A3A)',
                          color: 'white',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          minWidth: '32px'
                        }}
                        onClick={() => handleAprovar(tecnico.id)}
                        title="Aprovar técnico"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                      <button 
                        className="btn-table-action" 
                        style={{ 
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          minWidth: '32px'
                        }}
                        onClick={() => handleRejeitar(tecnico.id)}
                        title="Rejeitar técnico"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AprovarTecnicos;