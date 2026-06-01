'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function DetalhesChamadoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Captura os dados que vieram na URL 
  const id = searchParams.get('id') || 'CH-001';
  const titulo = searchParams.get('titulo') || 'Ar condicionado vazando';
  const local = searchParams.get('local') || 'Auditório - FCTE';
  const status = searchParams.get('status') || 'ATRIBUIDO';

  const handleConcluir = () => {
    alert(`Chamado ${id} concluído com sucesso!`);
    router.push('/tecnico/fila'); // Volta para a fila pós-conclusão
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#10b981', marginBottom: '1.5rem' }}>🔧 Detalhes do Chamado em Execução</h2>
      
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 'bold' }}>{id}</span>
        <h3 style={{ margin: '0.5rem 0 1rem 0', color: '#1f2937', fontSize: '1.4rem' }}>{titulo}</h3>
        
        <p style={{ color: '#4b5563', margin: '0.5rem 0' }}><strong> Local:</strong> {local}</p>
        <p style={{ color: '#4b5563', margin: '0.5rem 0' }}><strong> Status Atual:</strong> <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{status}</span></p>
        <p style={{ color: '#4b5563', margin: '0.5rem 0' }}><strong>Solicitante:</strong> Equipe de Manutenção KeepUnB</p>
        
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            <strong>Descrição do Problema:</strong><br />
            Esta é uma simulação dos detalhes do problema relatado para o {titulo.toLowerCase()}. Realize os reparos necessários no local indicado.
          </p>
        </div>

        <button 
          onClick={handleConcluir}
          style={{ 
            marginTop: '1.5rem', 
            padding: '0.7rem 1.5rem', 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Concluir Manutenção
        </button>
      </div>
    </div>
  );
}