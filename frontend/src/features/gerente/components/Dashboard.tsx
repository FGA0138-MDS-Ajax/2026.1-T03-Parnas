// Dashboard.tsx — Painel Central do Gerente
'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, DashboardStats } from '../types';
import { gerenteService } from '../services/gerenteService';
import ModalAtribuicao from './ModalAtribuicao';
import AprovarTecnicos from './AprovarTecnicos';

export default function Dashboard() {
  const [userName, setUserName] = useState('Gerente de Operações');
  const [userMatricula, setUserMatricula] = useState('123456789');
  const [stats, setStats] = useState<DashboardStats>({
    abertos: 0,
    atribuidos: 0,
    emAndamento: 0,
    concluidos: 0,
    totalTecnicos: 0,
  });
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('TODAS');
  
  // Controle do Modal de Atribuição
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ticketsData] = await Promise.all([
        gerenteService.getDashboardStats(),
        gerenteService.getChamadosAbertos(),
      ]);
      setStats(statsData);
      setChamados(ticketsData);
    } catch (e) {
      console.error('Erro ao carregar dados do painel do gerente', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('keepunb_email') || 'gerente@gmail.com';
      const nome = localStorage.getItem('keepunb_nome') || '';
      const matricula = localStorage.getItem('keepunb_matricula') || '242012345';
      setUserMatricula(matricula);
      
      if (nome) {
        const formattedName = nome
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else if (email.includes('gerente')) {
        setUserName('Gerente de Operações');
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
  }, []);

  const handleOpenAssign = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleAssignSuccess = async (tecnicoNome: string) => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    showToast(`Chamado delegado com sucesso para: ${tecnicoNome}!`);
    // Recarrega todos os dados
    await loadData();
  };

  const showToast = (message: string, isError: boolean = false) => {
    setToastMessage({ text: message, error: isError });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtragem dos chamados abertos
  const chamadosFiltrados = chamados.filter((ticket) => {
    const matchesSearch = 
      ticket.local.toLowerCase().includes(search.toLowerCase()) ||
      ticket.descricao.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toString().includes(search);
      
    const matchesCategory = 
      filterCategory === 'TODAS' || 
      ticket.tipo_manutencao.toUpperCase() === filterCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  const formatarData = (dataStr: string) => {
    try {
      const data = new Date(dataStr);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dataStr;
    }
  };

  // Extrai categorias únicas para o filtro
  const categorias = ['TODAS', ...Array.from(new Set(chamados.map(c => c.tipo_manutencao.toUpperCase())))];

  return (
    <div>
      {/* HEADER */}
      <header className="content-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="content-title">Painel de Controle</h1>
          <p className="content-subtitle">Fila geral de triagem e distribuição de chamados técnicos do campus FCTE.</p>
        </div>
        <button className="btn-header-action" onClick={loadData}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Atualizar Dados</span>
        </button>
      </header>

      {/* GREETING CARD */}
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
            Acompanhe as demandas de manutenção e coordene a equipe de infraestrutura.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Perfil do Gerente</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--navy-dark)', fontWeight: 600 }}>Matrícula: {userMatricula}</span>
          </div>
          <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy-light)', color: 'white', borderRadius: '50%', fontWeight: 'bold' }}>
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-abertos">
          <div className="kpi-header">
            <span>Aguardando Triagem</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : stats.abertos}</div>
          <div className="kpi-footer alert">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Necessita de ação rápida</span>
          </div>
        </div>

        <div className="kpi-card kpi-atribuidos">
          <div className="kpi-header">
            <span>Delegados / Atribuídos</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : stats.atribuidos}</div>
          <div className="kpi-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Aguardando início técnico</span>
          </div>
        </div>

        <div className="kpi-card kpi-em-andamento">
          <div className="kpi-header">
            <span>Manutenções em Curso</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : stats.emAndamento}</div>
          <div className="kpi-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>Executores trabalhando</span>
          </div>
        </div>

        <div className="kpi-card kpi-tecnicos">
          <div className="kpi-header">
            <span>Equipe Técnica Ativa</span>
            <div className="kpi-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div className="kpi-value">{loading ? '...' : stats.totalTecnicos}</div>
          <div className="kpi-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Todos disponíveis</span>
          </div>
        </div>
      </section>

      {/* PAINEL DA FILA DE CHAMADOS */}
      <section className="section-panel">
        <div className="panel-header-row">
          <h2 className="panel-title">Fila de Solicitações em Aberto ({chamadosFiltrados.length})</h2>
          
          <div className="filter-bar">
            {/* Campo de Busca */}
            <div className="search-input-wrap">
              <input
                type="text"
                placeholder="Buscar chamado por local ou descrição..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="search-icon-svg" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Filtro por Categoria */}
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="TODAS">Categorias: Todas</option>
              {categorias.filter(c => c !== 'TODAS').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABELA DE CHAMADOS */}
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
            <p>Carregando fila de chamados de manutenção...</p>
          </div>
        ) : chamadosFiltrados.length === 0 ? (
          <div className="table-empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg className="empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.6 }}>
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            <p>Excelente! Nenhum chamado em aberto aguardando triagem.</p>
          </div>
        ) : (
          <div className="premium-table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th style={{ width: '220px' }}>Local da Ocorrência</th>
                  <th style={{ width: '150px' }}>Categoria</th>
                  <th>Descrição do Problema</th>
                  <th style={{ width: '130px' }}>Abertura</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Distribuição</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="ticket-cell-id">#{ticket.id}</td>
                    <td className="ticket-cell-local">{ticket.local}</td>
                    <td>
                      <span className="status-badge aberto" style={{ fontSize: '0.65rem' }}>
                        {ticket.tipo_manutencao}
                      </span>
                    </td>
                    <td className="ticket-cell-desc" title={ticket.descricao}>
                      {ticket.descricao}
                    </td>
                    <td>{formatarData(ticket.created_at)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn-table-action" 
                        onClick={() => handleOpenAssign(ticket)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Atribuir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* COMPONENTE DE APROVAÇÃO DE TÉCNICOS */}
      <AprovarTecnicos />

      {/* MODAL DE ATRIBUIÇÃO */}
      {isModalOpen && selectedTicket && (
        <ModalAtribuicao
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAssignSuccess}
          onError={(err) => showToast(err, true)}
        />
      )}

      {/* TOAST SYSTEM */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast ${toastMessage.error ? 'error' : ''}`}>
            {toastMessage.error ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Global styles moved to global.css or App Router layout for better performance */}
    </div>
  );
}