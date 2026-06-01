'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DetalhesChamadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Captura os dados iniciais que vieram da página de fila via Query Params
  const id = searchParams.get('id') || 'CH-001';
  const titulo = searchParams.get('titulo') || 'Ar condicionado vazando';
  const local = searchParams.get('local') || 'Auditório - FCTE';
  const tipoManutencao = searchParams.get('tipo') || 'Equipamentos / TI';

  // ESTADO DO STATUS: Começa com o status que veio da URL (ou ATRIBUIDO por padrão)
  const [statusAtual, setStatusAtual] = useState('ATRIBUIDO');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setStatusAtual(statusParam);
    }
  }, [searchParams]);

  // AÇÃO 1: Mudar para Em Andamento 
  const handleIniciarAtendimento = () => {
    setStatusAtual('EM_ANDAMENTO');
    alert(`Status do chamado ${id} alterado para EM ANDAMENTO!`);
  };

  // AÇÃO 2: Mudar para Concluído
  const handleConcluirAtendimento = () => {
    setStatusAtual('CONCLUIDO');
    alert(`Sucesso! Chamado ${id} finalizado com status CONCLUÍDO.`);
    router.push('/tecnico/fila'); // Redireciona de volta para a fila
  };

  // Função auxiliar para renderizar a cor da tag de status
  const getStatusEstilo = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO':
        return { backgroundColor: '#3b82f6', color: 'white' }; // Azul
      case 'CONCLUIDO':
        return { backgroundColor: '#10b981', color: 'white' }; // Verde 
      default:
        return { backgroundColor: '#f59e0b', color: 'white' }; // Laranja (Atribuído)
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#065f46', marginBottom: '1.5rem', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>
         Tela de Detalhes e Execução do Chamado
      </h2>
      
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 'bold' }}>{id}</span>
        <h3 style={{ margin: '0.5rem 0 1.5rem 0', color: '#1f2937', fontSize: '1.4rem' }}>{titulo}</h3>
        
        {/* Visualizar os dados principais do chamado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#4b5563', margin: 0 }}><strong> Local:</strong> {local}</p>
          <p style={{ color: '#4b5563', margin: 0 }}><strong> Tipo de Manutenção:</strong> {tipoManutencao}</p>
          <p style={{ color: '#4b5563', margin: 0 }}>
            <strong> Status Atual:</strong>{' '}
            <span style={{ 
              padding: '0.3rem 0.6rem', 
              borderRadius: '4px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              ...getStatusEstilo(statusAtual)
            }}>
              {statusAtual}
            </span>
          </p>
        </div>
        
        {/* Descrição do problema */}
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1.5rem', paddingTop: '1.5rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '6px' }}>
          <strong style={{ color: '#374151', display: 'block', marginBottom: '0.5rem' }}>📝 Descrição do Problema Relatado:</strong>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
            O equipamento apresenta falhas intermitentes e precisa de uma revisão técnica detalhada no local informado para substituição de componentes ou reparo estrutural.
          </p>
        </div>

        {/*Botões de ação para alterar o andamento */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          
          {/* Botão Iniciar (Desabilita se já não for mais ATRIBUIDO) */}
          <button 
            onClick={handleIniciarAtendimento}
            disabled={statusAtual !== 'ATRIBUIDO'}
            style={{ 
              padding: '0.7rem 1.5rem', 
              backgroundColor: statusAtual === 'ATRIBUIDO' ? '#3b82f6' : '#9ca3af', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: statusAtual === 'ATRIBUIDO' ? 'pointer' : 'not-allowed', 
              fontWeight: 'bold',
              fontSize: '0.95rem',
              flex: 1
            }}
          >
            Iniciar Atendimento
          </button>

          {/* Botão Concluir */}
          <button 
            onClick={handleConcluirAtendimento}
            style={{ 
              padding: '0.7rem 1.5rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '0.95rem',
              flex: 1
            }}
          >
            Concluir Atendimento
          </button>

        </div>
      </div>
    </div>
  );
}