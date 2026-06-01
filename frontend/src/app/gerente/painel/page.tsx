'use client';

import React, { useState } from 'react';

export default function PainelGerentePage() {
  // MOCK 1: Lista de chamados com status ABERTO inicialmente 
  const [chamados, setChamados] = useState([
    { id: 'CH-001', titulo: 'Ar condicionado vazando no Auditório', status: 'ABERTO', tecnico: '-' },
    { id: 'CH-002', titulo: 'Lâmpadas queimadas no Lab', status: 'ABERTO', tecnico: '-' },
    { id: 'CH-003', titulo: 'Projetor sem imagem na S1', status: 'ABERTO', tecnico: '-' },
  ]);

  // MOCK 2: Lista de técnicos disponíveis 
  const tecnicosDisponiveis = ['Carlos Silva', 'Ana Souza', 'Marcos Lima'];

  // Estados para controlar qual chamado e qual técnico foram selecionados na simulação
  const [chamadoSelecionado, setChamadoSelecionado] = useState('');
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState('');

  // Função para simular a atribuição 
  const handleAtribuir = (e: React.FormEvent) => {
    e.preventDefault();

    if (!chamadoSelecionado || !tecnicoSelecionado) {
      alert('Por favor, selecione um chamado e um técnico!');
      return;
    }

    // Atualiza o estado visualmente mudando o status para ATRIBUIDO
    setChamados(prevChamados =>
      prevChamados.map(c =>
        c.id === chamadoSelecionado
          ? { ...c, status: 'ATRIBUIDO', tecnico: tecnicoSelecionado }
          : c
      )
    );

    alert(`Sucesso! Técnico ${tecnicoSelecionado} atribuído ao chamado ${chamadoSelecionado}.`);
    
    // Limpa a seleção do formulário
    setChamadoSelecionado('');
    setTecnicoSelecionado('');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#78350f', marginBottom: '1.5rem', borderBottom: '2px solid #f59e0b', paddingBottom: '0.5rem' }}>
         Painel de Atribuição de Chamados
      </h2>

      {/* Grid de Informações */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* COLUNA 1: LISTA DE CHAMADOS */}
        <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h3 style={{ color: '#78350f', marginTop: 0, marginBottom: '1rem' }}> Chamados</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {chamados.map(c => (
              <div key={c.id} style={{ padding: '0.8rem', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: c.status === 'ATRIBUIDO' ? '#f0fdf4' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{c.id} - {c.titulo}</strong>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: c.status === 'ATRIBUIDO' ? '#10b981' : '#f59e0b',
                    color: 'white'
                  }}>
                    {c.status}
                  </span>
                </div>
                {c.status === 'ATRIBUIDO' && (
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                    Técnico: <strong>{c.tecnico}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUNA 2: TÉCNICOS E AÇÃO DE ATRIBUIÇÃO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* LISTA DE TÉCNICOS DISPONÍVEIS */}
          <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ color: '#78350f', marginTop: 0, marginBottom: '0.5rem' }}>Técnicos Disponíveis</h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#4a5568' }}>
              {tecnicosDisponiveis.map((t, idx) => (
                <li key={idx} style={{ marginBottom: '0.2rem' }}>{t} <span style={{ color: '#10b981', fontSize: '0.8rem' }}>(Disponível)</span></li>
              ))}
            </ul>
          </div>

          {/* FORMULÁRIO DE AÇÃO */}
          <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ color: '#78350f', marginTop: 0, marginBottom: '1rem' }}>Atribuir Técnico</h3>
            <form onSubmit={handleAtribuir} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Selecionar Chamado:</label>
                <select 
                  value={chamadoSelecionado} 
                  onChange={e => setChamadoSelecionado(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">-- Escolha o chamado aberto --</option>
                  {chamados.filter(c => c.status === 'ABERTO').map(c => (
                    <option key={c.id} value={c.id}>{c.id} - {c.titulo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Selecionar Técnico:</label>
                <select 
                  value={tecnicoSelecionado} 
                  onChange={e => setTecnicoSelecionado(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">-- Escolha o técnico --</option>
                  {tecnicosDisponiveis.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                style={{ 
                  padding: '0.6rem', 
                  backgroundColor: '#f59e0b', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer' 
                }}
              >
                Confirmar Atribuição
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}