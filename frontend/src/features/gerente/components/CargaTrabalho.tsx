// CargaTrabalho.tsx — Supervisão de Carga de Trabalho por Técnico
'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Technician } from '../types';
import { gerenteService } from '../services/gerenteService';

export default function CargaTrabalho() {
  const [tecnicos, setTecnicos] = useState<Technician[]>([]);
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [tecnicosData, chamadosData] = await Promise.all([
        gerenteService.getTecnicosDisponiveis(),
        gerenteService.getTodosChamados(),
      ]);
      setTecnicos(tecnicosData);
      setChamados(chamadosData);
    } catch (e) {
      console.error('Erro ao carregar dados de atribuição e carga de trabalho', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Agrupa os chamados que não estão ABERTOS para cada técnico
  const getChamadosDoTecnico = (matricula: string) => {
    return chamados.filter(c => c.tecnico_id === matricula && c.status !== 'ABERTO');
  };

  return (
    <div>
      {/* HEADER */}
      <header className="content-header">
        <div>
          <h1 className="content-title">Carga de Trabalho da Equipe</h1>
          <p className="content-subtitle">Acompanhe a distribuição de chamados ativos entre os executores técnicos da FCTE.</p>
        </div>
        <button 
          className="btn-header-action" 
          onClick={loadData} 
          disabled={loading}
        >
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={loading ? { animation: 'spin 1.5s linear infinite' } : {}}
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>{loading ? 'Atualizando...' : 'Atualizar Carga'}</span>
        </button>
      </header>

      {loading ? (
        <div className="table-empty-state">
          <div className="empty-icon" style={{ animation: 'spin 1.5s linear infinite' }}>⏳</div>
          <p>Carregando distribuição de carga técnica...</p>
        </div>
      ) : error ? (
        <div className="table-empty-state" style={{ backgroundColor: 'var(--off-white)', borderRadius: '14px' }}>
          <div className="empty-icon">⚠️</div>
          <p>Erro ao carregar dados da equipe. Tente atualizar a página.</p>
        </div>
      ) : tecnicos.length === 0 ? (
        <div className="table-empty-state">
          <div className="empty-icon">❌</div>
          <p>Não há técnicos cadastrados ou ativos no sistema.</p>
        </div>
      ) : (
        <section className="team-grid">
          {tecnicos.map((tec) => {
            const chamadosDoTec = getChamadosDoTecnico(tec.matricula);
            return (
              <div key={tec.matricula} className="team-card">
                {/* CABEÇALHO DO CARD DO TÉCNICO */}
                <div className="team-card-header">
                  <div className="team-card-avatar">
                    {tec.nome.substring(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="team-card-info">
                    <h3 className="team-card-name">{tec.nome}</h3>
                    <span className="team-card-matricula">Matrícula: {tec.matricula}</span>
                  </div>

                  <span className="task-counter-pill">
                    {chamadosDoTec.length} {chamadosDoTec.length === 1 ? 'chamado' : 'chamados'}
                  </span>
                </div>

                {/* FILA DE TAREFAS */}
                <div className="task-list">
                  {chamadosDoTec.length === 0 ? (
                    <div className="task-empty-state">
                      <p>Livre de chamados no momento. Pronto para receber novas delegações.</p>
                    </div>
                  ) : (
                    chamadosDoTec.map((ticket) => (
                      <div key={ticket.id} className="task-card">
                        <div className="task-card-header">
                          <span className="task-card-id">#{ticket.id}</span>
                          <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                            {ticket.status === 'EM_ANDAMENTO' ? 'EM ANDAMENTO' : ticket.status}
                          </span>
                        </div>

                        <h4 className="task-card-local">{ticket.local}</h4>
                        
                        <p className="task-card-desc" style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}>
                          <strong>Categoria:</strong> {ticket.tipo_manutencao}
                        </p>
                        
                        <p className="task-card-desc">
                          {ticket.descricao}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
