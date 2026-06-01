'use client';

import { useState } from 'react';

export default function NovaSolicitacaoPage() {
  // Estados ajustados exatamente para os requisitos da Tarefa 3
  const [local, setLocal] = useState('');
  const [tipoManutencao, setTipoManutencao] = useState('eletrica');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Impedir envio sem descrição (double check além do required)
    if (!descricao.trim()) {
      alert('Erro: A descrição do problema é obrigatória');
      return;
    }

    // Simulação de criação mostrando os dados exigidos
    alert(
      `Chamado aberto com sucesso. (Simulação)\n\n` +
      ` Local: ${local}\n` +
      ` Tipo de Manutenção: ${tipoManutencao}\n` +
      ` Descrição: ${descricao}`
    );
    
    // Limpa o formulário após o envio
    setLocal('');
    setTipoManutencao('eletrica');
    setDescricao('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#003366', marginBottom: '1.5rem', borderBottom: '2px solid #003366', paddingBottom: '0.5rem' }}>
          ➕ Abrir Novo Chamado
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Campo de Local */}
          <div>
            <label htmlFor="local" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Local do Problema:
            </label>
            <input
              id="local"
              type="text"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              placeholder="Ex: Sala A1 - Sala S1, RU, Biblioteca"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {/* Campo de Tipo de Manutenção */}
          <div>
            <label htmlFor="tipoManutencao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Tipo de Manutenção:
            </label>
            <select
              id="tipoManutencao"
              value={tipoManutencao}
              onChange={(e) => setTipoManutencao(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
            >
              <option value="eletrica">Elétrica (Lâmpadas, tomadas, fiação)</option>
              <option value="hidraulica">Hidráulica (Vazamentos, pias, banheiros)</option>
              <option value="infraestrutura">Infraestrutura / Estrutural (Portas, janelas, pintura)</option>
              <option value="equipamentos">Equipamentos / TI (Ar condicionado, projetor)</option>
            </select>
          </div>

          {/* Campo de Descrição com validação */}
          <div>
            <label htmlFor="descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Descrição do Problema:
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required // Impede o envio nativamente no navegador
              placeholder="Descreva detalhadamente o problema encontrado."
              rows={5}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.8rem',
              backgroundColor: '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#002244')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#003366')}
          >
            Enviar Solicitação
          </button>

        </form>
      </div>
    </div>
  );
}