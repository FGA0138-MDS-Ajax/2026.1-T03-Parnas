
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { solicitanteService } from '../services/solicitanteService';
import { Ticket, SolicitanteDashboardStats } from '../types';
import { SERVERBASEURL } from '../../shared/services/apiClient';
import './solicitante.css';

export default function DashboardContent() {
  const [userName, setUserName] = useState('Gabriel Sousa');
  const [userMatricula, setUserMatricula] = useState('211043210');
  const [stats, setStats] = useState<SolicitanteDashboardStats>({ total: 0, abertos: 0, emAndamento: 0, concluidos: 0 });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [outrosChamados, setOutrosChamados] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'nao_iniciados' | 'em_andamento' | 'concluidos'>('nao_iniciados');
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const email = sessionStorage.getItem('keepunb_email') || 'solicitante@gmail.com';
      const nome = sessionStorage.getItem('keepunb_nome') || '';
      const matricula = sessionStorage.getItem('keepunb_matricula') || '211043210';
      setUserMatricula(matricula);
      
      if (nome) {
        const formattedName = nome
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else if (email.includes('solicitante')) {
        setUserName('Gabriel Sousa');
      } else {
        const parsedName = email.split('@')[0];
        const formattedName = parsedName
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      }
    }

    // Busca as métricas gerais e as listas de chamados do solicitante
    const fetchData = async () => {
      try {
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [tickets, dashboardStats, outros] = await Promise.all([
          solicitanteService.getChamados(),
          solicitanteService.getEstatisticas(),
          solicitanteService.getOutrosChamados()
        ]);

        setStats(dashboardStats);

        setTickets(tickets);
        setOutrosChamados(outros);
      } catch (e) {
        console.error('Erro ao buscar dados do dashboard do solicitante:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Controla a abertura do modal de "Outras Solicitações" através da URL (hash) ou evento customizado
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#outras-solicitacoes') {
        setIsModalOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    const handleCustomOpen = () => {
      setIsModalOpen(true);
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('openOutrasSolicitacoes', handleCustomOpen);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openOutrasSolicitacoes', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    setImageErrors({});
  }, [selectedTicket]);

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ color: 'var(--gray-text)', fontFamily: 'Sora', fontSize: '1rem' }}>Carregando seu painel...</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(37, 87, 167, 0.12) 0%, rgba(13, 43, 94, 0.08) 100%)',
        padding: '1.75rem 2.25rem',
        borderRadius: '20px',
        border: '1px solid rgba(13, 43, 94, 0.08)',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontFamily: 'Sora', fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--navy-dark)' }}>
            Olá, {userName}! <span style={{ fontSize: '1.6rem' }}>👋</span>
          </h2>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.98rem', marginTop: '0.35rem' }}>
            Acompanhe a conservação da infraestrutura da FCTE.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Perfil do Solicitante</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--navy-dark)', fontWeight: 600 }}>Matrícula: {userMatricula}</span>
          </div>
          <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="kpis-grid">
        <div className="kpi-card kpi-total">
          <span className="kpi-label">Total Solicitado</span>
          <span className="kpi-value">{stats.total}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(37, 87, 167, 0.25)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div className="kpi-card kpi-aberto">
          <span className="kpi-label">Em Aberto</span>
          <span className="kpi-value">{stats.abertos}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(255, 176, 58, 0.35)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div className="kpi-card kpi-progresso">
          <span className="kpi-label">Em Atendimento</span>
          <span className="kpi-value">{stats.emAndamento}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(58, 176, 255, 0.35)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div className="kpi-card kpi-concluido">
          <span className="kpi-label">Resolvidos</span>
          <span className="kpi-value">{stats.concluidos}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(61, 201, 102, 0.35)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '2rem', flexWrap: 'wrap' }} className="responsive-dashboard-grid">
        
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
              📋 Minhas Solicitações
            </h3>
          </div>

          {tickets.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
              <h4 className="empty-state-title">Nenhum chamado aberto</h4>
              <p className="empty-state-desc">
                Parece que você ainda não registrou nenhum chamado de manutenção no KeepUnB.
              </p>
              <Link href="/solicitante/nova-solicitacao" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.88rem', padding: '0.75rem 1.5rem', marginTop: '0.5rem' }}>
                Abrir meu 1º Chamado
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid rgba(13, 43, 94, 0.12)',
                  boxShadow: '0 2px 6px rgba(13, 43, 94, 0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Sora', fontSize: '0.92rem', fontWeight: 600, color: '#000000' }}>#{ticket.id} — {ticket.local}</span>
                      <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`} style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                        {translateStatus(ticket.status)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', marginBottom: '0.35rem' }}>
                      Categoria: <strong>{ticket.tipo_manutencao}</strong> • Aberto em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')} às {new Date(ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#4A5568', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {ticket.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button 
            className="other-requests-trigger"
            onClick={() => setIsModalOpen(true)}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(37, 87, 167, 0.05) 0%, rgba(13, 43, 94, 0.03) 100%)',
              border: '1px solid rgba(13, 43, 94, 0.15)',
              color: 'var(--navy)',
              fontFamily: 'Sora',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Ver Outras Solicitações</span>
            <span style={{ 
              background: 'var(--navy-light)', 
              color: 'white', 
              borderRadius: '100px', 
              padding: '0.2rem 0.6rem', 
              fontSize: '0.8rem' 
            }}>
              {outrosChamados.length}
            </span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ 
            background: 'linear-gradient(135deg, rgba(27, 122, 58, 0.12) 0%, rgba(13, 43, 94, 0.1) 100%)', 
            borderColor: 'rgba(61, 201, 102, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            textAlign: 'center',
            padding: '2.25rem 2rem'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(61, 201, 102, 0.1)',
              color: 'var(--green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '1px solid rgba(61, 201, 102, 0.2)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            
            <div>
              <h4 style={{ fontFamily: 'Sora', fontSize: '1.15rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '0.5rem' }}>
                Encontrou algum vazamento ou tomada quebrada?
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>
                Registre o problema de infraestrutura agora mesmo para que nossa equipe técnica possa atuar com rapidez na manutenção.
              </p>
            </div>

            <Link href="/solicitante/nova-solicitacao" className="btn-primary" style={{ textDecoration: 'none', width: '100%', marginTop: '0.5rem' }}>
              Novo Chamado
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontFamily: 'Sora', fontSize: '1rem', fontWeight: 600, color: 'var(--navy-dark)', marginBottom: '0.75rem', borderBottom: '1px solid rgba(13, 43, 94, 0.08)', paddingBottom: '0.5rem' }}>
              💡 Central de Dúvidas
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', padding: 0 }}>
              <li>
                <span style={{ fontWeight: 600, color: 'var(--navy-dark)', display: 'block' }}>Quem realiza o conserto?</span>
                <span style={{ color: 'var(--gray-text)' }}>Os técnicos capacitados da FCTE que atuam na coordenação de infraestrutura.</span>
              </li>
              <li>
                <span style={{ fontWeight: 600, color: 'var(--navy-dark)', display: 'block' }}>Qual o prazo médio de resposta?</span>
                <span style={{ color: 'var(--gray-text)' }}>A triagem é realizada pelo Gerente em até 24 horas úteis a contar da abertura.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontFamily: 'Sora', color: 'var(--navy-dark)', fontSize: '1.3rem' }}>
                Outras Solicitações
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.8rem',
                  color: 'var(--gray-text)',
                  cursor: 'pointer',
                  padding: '0 0.5rem',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="search-bar-container" style={{ marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Pesquisar por local, categoria ou descrição..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="tabs-container" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <button 
                  className={`tab-btn ${activeTab === 'nao_iniciados' ? 'active' : ''}`}
                  onClick={() => setActiveTab('nao_iniciados')}
                >
                  Não Iniciados
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'em_andamento' ? 'active' : ''}`}
                  onClick={() => setActiveTab('em_andamento')}
                >
                  Em Andamento
                </button>
              </div>

              <div className="tickets-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(() => {
                  const filteredOutros = outrosChamados.filter((ticket) => {
                    if (activeTab === 'nao_iniciados' && !['ABERTO', 'NAO_INICIADO'].includes(ticket.status)) return false;
                    if (activeTab === 'em_andamento' && !['ATRIBUIDO', 'EM_ANDAMENTO'].includes(ticket.status)) return false;

                    const query = searchQuery.toLowerCase();
                    if (!query) return true;
                    return (
                      ticket.local.toLowerCase().includes(query) ||
                      ticket.tipo_manutencao.toLowerCase().includes(query) ||
                      ticket.descricao.toLowerCase().includes(query) ||
                      ticket.id.toString().includes(query)
                    );
                  });

                  if (filteredOutros.length === 0) {
                    return (
                      <div className="empty-state" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                        <p style={{ color: 'var(--gray-text)', margin: 0 }}>Nenhuma solicitação encontrada nesta aba.</p>
                      </div>
                    );
                  }

                  return filteredOutros.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => setSelectedTicket(ticket)}
                      style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      background: '#ffffff',
                      border: '1px solid rgba(13, 43, 94, 0.12)',
                      boxShadow: '0 2px 6px rgba(13, 43, 94, 0.03)',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'Sora', fontSize: '0.92rem', fontWeight: 600, color: '#000000' }}>#{ticket.id} — {ticket.local}</span>
                        <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`} style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                          {translateStatus(ticket.status)}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', marginBottom: '0.35rem' }}>
                        Categoria: <strong>{ticket.tipo_manutencao}</strong> • Aberto em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')} às {new Date(ticket.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <p style={{ fontSize: '0.88rem', color: '#4A5568', margin: 0 }}>
                        {ticket.descricao}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTicket && (
        <div className="modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontFamily: 'Sora', color: 'var(--navy-dark)', fontSize: '1.3rem' }}>
                Chamado #{selectedTicket.id}
              </h3>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', color: 'var(--gray-text)', cursor: 'pointer', padding: '0 0.5rem', lineHeight: 1 }}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`badge-status ${getStatusBadgeClass(selectedTicket.status)}`}>
                  {translateStatus(selectedTicket.status)}
                </span>
              </div>

              <p style={{ margin: '0.4rem 0' }}><strong>Local:</strong> {selectedTicket.local}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>Categoria:</strong> {selectedTicket.tipo_manutencao}</p>
              <p style={{ margin: '0.4rem 0' }}><strong>Aberto em:</strong> {new Date(selectedTicket.created_at).toLocaleDateString('pt-BR')}</p>
              <div style={{
                marginTop: '1.2rem',
                marginBottom: '1.2rem',
                padding: '1rem',
                backgroundColor: 'var(--off-white, #F4F7FB)',
                borderRadius: '10px',
                border: '1px solid rgba(13,43,94,0.08)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--navy, #0D2B5E)' }}>Descrição</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--navy-dark, #071A3E)', lineHeight: 1.5 }}>
                  {selectedTicket.descricao}
                </p>
              </div>

              {(() => {
                const validPhotoPaths = selectedTicket.photo_paths?.filter(
                  path => path && path !== 'null' && path.trim() !== ''
                ) || [];

                if (validPhotoPaths.length > 0) {
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                      {validPhotoPaths.map((path, index) => {
                        if (imageErrors[path]) {
                          return (
                            <div key={path} style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '150px',
                              backgroundColor: 'var(--off-white, #F4F7FB)',
                              borderRadius: '12px',
                              border: '1px dashed rgba(13,43,94,0.2)',
                              color: 'var(--gray-text)',
                              fontSize: '0.85rem'
                            }}>
                              imagem indisponível
                            </div>
                          );
                        }
                        return (
                          <img
                            key={path}
                            src={`${SERVERBASEURL}${path}`}
                            alt={`Foto da ocorrência ${index + 1}`}
                            onError={() => setImageErrors(prev => ({ ...prev, [path]: true }))}
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(13,43,94,0.12)' }}
                          />
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <p style={{ color: 'var(--gray-text)', fontSize: '0.85rem', marginTop: '1rem' }}>
                    imagem indisponível
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
