// ListaSolicitacoes.tsx — Listagem interativa, filtros, cancelamento e stepper de progresso de chamados
'use client';

import React, { useEffect, useState } from 'react';
import { solicitanteService } from '../services/solicitanteService';
import { Ticket, TicketStatus } from '../types';
import './solicitante.css';

export default function ListaSolicitacoes() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ABERTO' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'CANCELADO'>('TODOS');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Controle do modal de cancelamento
  const [cancelingTicketId, setCancelingTicketId] = useState<number | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await solicitanteService.getChamados();
      setTickets(data);
      setFilteredTickets(data);
    } catch (e) {
      console.error('Erro ao carregar chamados do solicitante:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filtro e busca em tempo real
  useEffect(() => {
    let result = [...tickets];

    // Filtro por status
    if (statusFilter !== 'TODOS') {
      if (statusFilter === 'EM_PROGRESSO') {
        result = result.filter(t => t.status === 'ATRIBUIDO' || t.status === 'EM_ANDAMENTO');
      } else {
        result = result.filter(t => t.status === statusFilter);
      }
    }

    // Busca por termo
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        t => t.local.toLowerCase().includes(term) || 
             t.descricao.toLowerCase().includes(term) ||
             t.id.toString().includes(term) ||
             t.tipo_manutencao.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(result);
  }, [search, statusFilter, tickets]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCancelClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Evita expandir a linha ao clicar no botão
    setCancelingTicketId(id);
  };

  const confirmCancel = async () => {
    if (!cancelingTicketId) return;
    setIsCanceling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600)); // Latência simulada
      await solicitanteService.cancelarChamado(cancelingTicketId);
      
      // Atualiza localmente
      setTickets(prev => prev.map(t => t.id === cancelingTicketId ? { ...t, status: 'CANCELADO', updated_at: new Date().toISOString() } : t));
      
      setToastMsg('Solicitação cancelada com sucesso!');
      setTimeout(() => setToastMsg(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Erro ao cancelar chamado.');
    } finally {
      setIsCanceling(false);
      setCancelingTicketId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'aberto';
      case 'ATRIBUIDO': return 'atribuido';
      case 'EM_ANDAMENTO': return 'em_andamento';
      case 'CONCLUIDO': return 'concluido';
      case 'CANCELADO': return 'cancelado';
      default: return '';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'Aberto';
      case 'ATRIBUIDO': return 'Atribuído';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'CONCLUIDO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      case 'NAO_INICIADO': return 'Não Iniciado';
      default: return status;
    }
  };

  // Retorna os dados do técnico fictício/real
  const getTecnicoNome = (tecnicoId: string | null) => {
    if (!tecnicoId) return 'Aguardando designação';
    if (tecnicoId === '190012345') return 'Alessandro da Silva';
    if (tecnicoId === '200054321') return 'Maria Eduarda Ribeiro';
    return `Técnico Matrícula: ${tecnicoId}`;
  };

  // Helper para verificar o estágio do stepper
  const getStepStatus = (ticketStatus: TicketStatus, step: 'ABERTO' | 'ATRIBUIDO' | 'EM_ANDAMENTO' | 'CONCLUIDO') => {
    if (ticketStatus === 'CANCELADO') {
      return 'cancelled';
    }

    const order = ['ABERTO', 'ATRIBUIDO', 'EM_ANDAMENTO', 'CONCLUIDO'];
    const currentIndex = order.indexOf(ticketStatus);
    const stepIndex = order.indexOf(step);

    if (currentIndex >= stepIndex) {
      return 'completed';
    } else if (currentIndex + 1 === stepIndex) {
      return 'active';
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ color: 'var(--gray-text)', fontFamily: 'Sora', fontSize: '1rem' }}>Carregando suas solicitações...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Toast de Notificação */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--green)',
          color: 'var(--white)',
          padding: '1rem 1.5rem',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontFamily: 'Sora',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease forwards'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {toastMsg}
        </div>
      )}

      {/* Barra de Filtros e Pesquisa */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Pesquisar por ID, local ou problema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${statusFilter === 'TODOS' ? 'active' : ''}`}
            onClick={() => setStatusFilter('TODOS')}
          >
            Ver Todas
          </button>
          <button
            className={`filter-pill ${statusFilter === 'ABERTO' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ABERTO')}
          >
            Abertas
          </button>
          <button
            className={`filter-pill ${statusFilter === 'EM_PROGRESSO' ? 'active' : ''}`}
            onClick={() => setStatusFilter('EM_PROGRESSO')}
          >
            Em Atendimento
          </button>
          <button
            className={`filter-pill ${statusFilter === 'CONCLUIDO' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CONCLUIDO')}
          >
            Resolvidas
          </button>
          <button
            className={`filter-pill ${statusFilter === 'CANCELADO' ? 'active' : ''}`}
            onClick={() => setStatusFilter('CANCELADO')}
          >
            Canceladas
          </button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      {filteredTickets.length === 0 ? (
        <div className="glass-card empty-state">
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <h4 className="empty-state-title">Nenhuma solicitação localizada</h4>
          <p className="empty-state-desc">
            Não encontramos nenhum chamado correspondente aos filtros de busca atuais. Tente alterar sua pesquisa.
          </p>
        </div>
      ) : (
        <div className="table-container glass-card" style={{ padding: 0 }}>
          <table className="solicitante-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Local do Chamado</th>
                <th>Tipo Manutenção</th>
                <th>Aberto Em</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const isExpanded = expandedId === ticket.id;
                return (
                  <React.Fragment key={ticket.id}>
                    <tr 
                      onClick={() => toggleExpand(ticket.id)}
                      className={isExpanded ? 'expanded' : ''}
                    >
                      <td style={{ fontFamily: 'Sora', fontWeight: 600 }}>#{ticket.id}</td>
                      <td style={{ fontWeight: 500 }}>{ticket.local}</td>
                      <td>{ticket.tipo_manutencao}</td>
                      <td>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`}>
                          {translateStatus(ticket.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {ticket.status === 'ABERTO' ? (
                          <button
                            className="btn-danger-outline"
                            onClick={(e) => handleCancelClick(e, ticket.id)}
                          >
                            Cancelar
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-text)', fontStyle: 'italic' }}>Em andamento</span>
                        )}
                      </td>
                    </tr>
                    
                    {/* Seção Expandida com Detalhes e Stepper */}
                    {isExpanded && (
                      <tr className="details-row">
                        <td colSpan={6}>
                          <div className="details-wrapper">
                            
                            <div className="details-grid">
                              <div className="details-block">
                                <h4>Descrição Completa do Problema</h4>
                                <p style={{ fontSize: '0.95rem' }}>{ticket.descricao}</p>
                              </div>
                              <div className="details-block">
                                <h4>Equipe de Atendimento</h4>
                                <div style={{ 
                                  padding: '1rem', 
                                  background: 'rgba(255, 255, 255, 0.02)', 
                                  border: '1px solid rgba(255, 255, 255, 0.08)',
                                  borderRadius: '10px',
                                  fontSize: '0.9rem' 
                                }}>
                                  <span style={{ display: 'block', color: 'var(--gray-text)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Técnico Responsável</span>
                                  <strong style={{ display: 'block', marginTop: '0.2rem', color: ticket.tecnico_id ? 'var(--white)' : 'var(--gray-text)' }}>
                                    {getTecnicoNome(ticket.tecnico_id)}
                                  </strong>
                                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gray-text)', marginTop: '0.5rem' }}>
                                    Última atualização: {new Date(ticket.updated_at).toLocaleDateString('pt-BR')} às {new Date(ticket.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stepper de Progresso Visual de Status */}
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.8rem' }}>
                              <h4 style={{ fontFamily: 'Sora', fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                                Status de Acompanhamento do Chamado
                              </h4>
                              
                              {ticket.status === 'CANCELADO' ? (
                                <div className="stepper-container">
                                  <div className="stepper-step completed">
                                    <div className="stepper-icon">✓</div>
                                    <div className="stepper-label">Aberto</div>
                                    <div className="stepper-sub">{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                  <div className="stepper-step cancelled">
                                    <div className="stepper-icon">✕</div>
                                    <div className="stepper-label">Cancelado</div>
                                    <div className="stepper-sub">{new Date(ticket.updated_at).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="stepper-container">
                                  <div className={`stepper-step ${getStepStatus(ticket.status, 'ABERTO')}`}>
                                    <div className="stepper-icon">1</div>
                                    <div className="stepper-label">Aberto</div>
                                    <div className="stepper-sub">Chamado criado</div>
                                  </div>
                                  <div className={`stepper-step ${getStepStatus(ticket.status, 'ATRIBUIDO')}`}>
                                    <div className="stepper-icon">2</div>
                                    <div className="stepper-label">Atribuído</div>
                                    <div className="stepper-sub">Técnico escalado</div>
                                  </div>
                                  <div className={`stepper-step ${getStepStatus(ticket.status, 'EM_ANDAMENTO')}`}>
                                    <div className="stepper-icon">3</div>
                                    <div className="stepper-label">Em Execução</div>
                                    <div className="stepper-sub">Reparo iniciado</div>
                                  </div>
                                  <div className={`stepper-step ${getStepStatus(ticket.status, 'CONCLUIDO')}`}>
                                    <div className="stepper-icon">4</div>
                                    <div className="stepper-label">Resolvido</div>
                                    <div className="stepper-sub">Conclusão</div>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {cancelingTicketId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontFamily: 'Sora', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Confirmar Cancelamento
            </h3>
            <p style={{ color: 'var(--gray-text)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Tem certeza que deseja cancelar a solicitação **#{cancelingTicketId}**? Esta ação mudará o status do chamado para cancelado e ele não será mais triado ou encaminhado aos executores.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setCancelingTicketId(null)}
                disabled={isCanceling}
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
              >
                Voltar
              </button>
              <button
                className="btn-primary"
                onClick={confirmCancel}
                disabled={isCanceling}
                style={{ 
                  background: 'linear-gradient(135deg, #ff4a4a 0%, #ff6b6b 100%)', 
                  boxShadow: '0 4px 15px rgba(255, 74, 74, 0.25)',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.88rem'
                }}
              >
                {isCanceling ? (
                  <>
                    <div className="spinner" style={{ marginRight: '4px' }} /> Cancelando...
                  </>
                ) : (
                  'Confirmar Cancelamento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
