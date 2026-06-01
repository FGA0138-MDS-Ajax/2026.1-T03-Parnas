// page.tsx — Nova Solicitação. TODO: Implementar.
'use client';

import { useState } from 'react';

export default function NovaSolicitacaoPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('infraestrutura');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação do envio da nova solicitação
    alert(`Solicitação criada com sucesso!\nTítulo: ${titulo}\nCategoria: ${categoria}`);
    
    // Limpa o formulário após o envio
    setTitulo('');
    setDescricao('');
    setCategoria('infraestrutura');
  };
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#003366', marginBottom: '1.5rem', borderBottom: '2px solid #003366', paddingBottom: '0.5rem' }}>
          ➕ Abrir Nova Solicitação
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div>
            <label htmlFor="titulo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Título do Chamado:
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label htmlFor="categoria" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Categoria:
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
            >
              <option value="infraestrutura">Infraestrutura / Prédio</option>
              <option value="ti">Suporte de TI / Equipamentos</option>
              <option value="limpeza">Serviços de Limpeza</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          <div>
            <label htmlFor="descricao" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
              Descrição Detalhada:
            </label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              placeholder="Descreva aqui os detalhes do problema para ajudar o técnico..."
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