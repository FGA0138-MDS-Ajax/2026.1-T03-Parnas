// AprovarTecnicos.tsx - Componente para aprovação de técnicos pendentes
'use client';

import React, { useState, useEffect } from 'react';
import { gerenteService, TecnicoPendente } from '../services/gerenteService';

const AprovarTecnicos: React.FC = () => {
  const [tecnicos, setTecnicos] = useState<TecnicoPendente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{[key: number]: 'approve' | 'reject' | null}>({});

  useEffect(() => {
    loadTecnicosPendentes();
  }, []);

  const loadTecnicosPendentes = async () => {
    try {
      setLoading(true);
      const data = await gerenteService.getTecnicosPendentes();
      setTecnicos(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar técnicos pendentes:', err);
      setError('Falha ao carregar técnicos pendentes. Por favor, atualize a página.');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [id]: 'approve' }));
    try {
      await gerenteService.aprovarTecnico(id);
      // Remove o técnico da lista após aprovação
      setTecnicos(tecnicos.filter(tecnico => tecnico.id !== id));
    } catch (err) {
      console.error(`Erro ao aprovar técnico com ID: ${id}`, err);
      setError('Falha ao aprovar técnico. Por favor, tente novamente.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleRejeitar = async (id: number) => {
    setActionLoading(prev => ({ ...prev, [id]: 'reject' }));
    try {
      await gerenteService.rejeitarTecnico(id);
      // Remove o técnico da lista após rejeição
      setTecnicos(tecnicos.filter(tecnico => tecnico.id !== id));
    } catch (err) {
      console.error(`Erro ao rejeitar técnico com ID: ${id}`, err);
      setError('Falha ao rejeitar técnico. Por favor, tente novamente.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  if (error) {
    return (
      <section className="section-panel" style={{ marginTop: '2rem' }}>
        <div className="panel-header-row">
          <h2 className="panel-title">Técnicos Pendentes de Aprovação</h2>
        </div>
        <div className="table-error-state" style={{ padding: '2rem', textAlign: 'center', color: '#e74c3c' }}>
          <p>{error}</p>
          <button 
            className="btn-header-action" 
            onClick={loadTecnicosPendentes}
            style={{ marginTop: '1rem' }}
          >
            Tentar Novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-panel" style={{ marginTop: '2rem' }}>
      <div className="panel-header-row">
        <h2 className="panel-title">Técnicos Pendentes de Aprovação ({tecnicos.length})</h2>
      </div>

      {loading ? (
        <div className="table-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg className="empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem', opacity: 0.6 }}>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <p>Carregando técnicos pendentes...</p>
        </div>
      ) : tecnicos.length === 0 ? (
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
                      {tecnico.area_manutencao}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="tecnico-actions" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn-table-action" 
                        style={{ 
                          backgroundColor: actionLoading[tecnico.id] === 'approve' ? '#166534' : 'var(--green, #1B7A3A)',
                          color: 'white',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          cursor: actionLoading[tecnico.id] ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          minWidth: '32px',
                          opacity: actionLoading[tecnico.id] ? 0.7 : 1
                        }}
                        onClick={() => handleAprovar(tecnico.id)}
                        title="Aprovar técnico"
                        disabled={!!actionLoading[tecnico.id]}
                      >
                        {actionLoading[tecnico.id] === 'approve' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                      <button 
                        className="btn-table-action" 
                        style={{ 
                          backgroundColor: actionLoading[tecnico.id] === 'reject' ? '#993333' : '#e74c3c',
                          color: 'white',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          cursor: actionLoading[tecnico.id] ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          minWidth: '32px',
                          opacity: actionLoading[tecnico.id] ? 0.7 : 1
                        }}
                        onClick={() => handleRejeitar(tecnico.id)}
                        title="Rejeitar técnico"
                        disabled={!!actionLoading[tecnico.id]}
                      >
                        {actionLoading[tecnico.id] === 'reject' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
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

// Adicionando a animação de spin ao componente
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
