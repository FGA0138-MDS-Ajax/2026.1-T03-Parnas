'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { tecnicoService } from '../../../features/tecnico/services/tecnicoService';
import type { Ticket } from '../../../features/tecnico/types';

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'ABERTO': return 'aberto';
    case 'ATRIBUIDO': return 'atribuido';
    case 'EM_ANDAMENTO': return 'em_andamento';
    case 'CONCLUIDO': return 'concluido';
    case 'CANCELADO': return 'cancelado';
    case 'NAO_INICIADO': return 'nao_iniciado';
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

export default function FilaChamadosPage() {
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('Técnico');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nome = sessionStorage.getItem('keepunb_nome') || '';
      const email = sessionStorage.getItem('keepunb_email') || '';

      if (nome) {
        const formattedName = nome
          .replace(/\./g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUserName(formattedName);
      } else if (email) {
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

  // Carrega a lista de chamados que foram atribuídos a este técnico
  useEffect(() => {
    const loadChamados = async () => {
      try {
        setIsLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 300));
        const data = await tecnicoService.getChamadosAtribuidos();
        setChamados(data);
      } catch (e) {
        console.error('Erro ao carregar chamados do tecnico:', e);
        setError('Não foi possível carregar seus chamados atribuídos.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadChamados();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ color: 'var(--gray-text)', fontFamily: 'Sora', fontSize: '1rem' }}>Carregando sua fila de chamados...</p>
      </div>
    );
  }

  const atribuidos = chamados.length;
  const emAndamento = chamados.filter((c) => c.status === 'EM_ANDAMENTO').length;
  const concluidos = chamados.filter((c) => c.status === 'CONCLUIDO').length;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Sora', fontSize: '2.2rem', fontWeight: 800, color: 'var(--navy-dark)', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
          Painel Geral do Técnico
        </h1>
        <p style={{ color: 'var(--gray-text)', fontSize: '1.05rem', margin: 0 }}>
          Acompanhe a fila operacional e os serviços designados para você.
        </p>
      </div>

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
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--gray-text)', fontSize: '0.95rem' }}>
            Acompanhe os serviços designados para você na fila operacional.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Perfil do Técnico</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--navy-dark)', fontWeight: 600 }}>Manutenção Predial</span>
          </div>
          <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="kpi-card kpi-total">
          <span className="kpi-label">Atribuídos</span>
          <span className="kpi-value">{atribuidos}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(37, 87, 167, 0.25)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div className="kpi-card kpi-progresso">
          <span className="kpi-label">Em Andamento</span>
          <span className="kpi-value">{emAndamento}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(58, 176, 255, 0.35)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        </div>
        <div className="kpi-card kpi-concluido">
          <span className="kpi-label">Concluídos</span>
          <span className="kpi-value">{concluidos}</span>
          <svg style={{ position: 'absolute', right: '1.25rem', bottom: '1.25rem', color: 'rgba(61, 201, 102, 0.35)' }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', flexWrap: 'wrap' }} className="responsive-dashboard-grid">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Sora', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
              📋 Fila de Chamados
            </h3>
          </div>

          {error && <p className="empty-state-title" style={{ color: '#991b1b' }}>{error}</p>}

          {!error && chamados.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
              <h4 className="empty-state-title">Nenhum chamado atribuído</h4>
              <p className="empty-state-desc">
                Você não possui chamados designados no momento.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {chamados.map((ticket) => (
                <div key={ticket.id} style={{
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
                  flexWrap: 'wrap'
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Sora', fontSize: '0.92rem', fontWeight: 600, color: '#000000' }}>CH-{String(ticket.id).padStart(3, '0')} — {ticket.local}</span>
                      <span className={`badge-status ${getStatusBadgeClass(ticket.status)}`} style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                        {translateStatus(ticket.status)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-text)', display: 'block', marginBottom: '0.35rem' }}>
                      Categoria: <strong>{ticket.tipo_manutencao}</strong> • Atualizado em: {new Date(ticket.updated_at).toLocaleDateString('pt-BR')}
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#4A5568', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {ticket.descricao}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link href={`/tecnico/chamado/${ticket.id}`} className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.88rem', padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}>
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
