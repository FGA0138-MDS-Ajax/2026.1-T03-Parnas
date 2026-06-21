// NovaSolicitacaoForm.tsx — Formulário premium para abertura de chamados
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitanteService } from '../services/solicitanteService';
import './solicitante.css';

export default function NovaSolicitacaoForm() {
  const router = useRouter();
  const [local, setLocal] = useState('');
  const [tipoManutencao, setTipoManutencao] = useState('Elétrica');
  const [descricao, setDescricao] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [PhotoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const tiposValidos = ['image/jpeg', 'image/png'];
        if (!tiposValidos.includes(file.type)) {
          setErrorMsg('Formato de imagem inválido. Use JPG ou PNG.');
          e.target.value = '';
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setErrorMsg('A imagem deve ter no máximo 10MB.');
          e.target.value = '';
          return;
        }
      setErrorMsg('');
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!descricao.trim()) {
      setErrorMsg('A descrição detalhada do problema é obrigatória.');
      return;
    }

    setIsLoading(true);

    try {
      // Simula uma pequena latência de rede de 800ms para feedback visual premium
      await new Promise(resolve => setTimeout(resolve, 800));

      const ticket = await solicitanteService.criarChamado({
        local: local.trim(),
        tipo_manutencao: tipoManutencao,
        descricao: descricao.trim(),
        photo,
      });

      setCreatedTicketId(ticket.id);
      setShowSuccessModal(true);

      // Limpa os campos
      setLocal('');
      setDescricao('');
      setPhoto(null);
      setPhotoPreview(null);
    } catch (e: any) {
      setErrorMsg(e.message || 'Falha ao registrar chamado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-solicitacao">
      <div className="glass-card">
        <h3 style={{ fontFamily: 'Sora', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--navy-dark)' }}>
          Formulário do Chamado
        </h3>
        
        {errorMsg && (
          <div style={{ padding: '1rem', background: 'rgba(255, 74, 74, 0.1)', border: '1px solid rgba(255, 74, 74, 0.3)', borderRadius: '10px', color: '#ff6b6b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo de Local */}
          <div className="form-group">
            <label htmlFor="local" className="form-label">
              Local Exato do Problema
            </label>
            <input
              id="local"
              type="text"
              className="form-input"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              required
              placeholder="Ex: Bloco A - Sala A1-12, RU, Biblioteca (2º andar)"
            />
          </div>

          {/* Campo de Tipo de Manutenção */}
          <div className="form-group">
            <label htmlFor="tipoManutencao" className="form-label">
              Categoria / Tipo de Manutenção
            </label>
            <select
              id="tipoManutencao"
              className="form-select"
              value={tipoManutencao}
              onChange={(e) => setTipoManutencao(e.target.value)}
            >
              <option value="Elétrica">Elétrica (Iluminação, fiação, tomadas desarmando)</option>
              <option value="Hidráulica">Hidráulica (Vazamentos, pias entupidas, vasos sanitários)</option>
              <option value="Infraestrutura">Infraestrutura (Portas emperradas, vidros quebrados, pintura)</option>
              <option value="Refrigeração">Refrigeração (Ar condicionado barulhento ou sem resfriar)</option>
              <option value="Equipamentos">Equipamentos / TI (Projetores, computadores de laboratório)</option>
              <option value="Outros">Outros problemas gerais</option>
            </select>
          </div>

          {/* Campo de Descrição */}
          <div className="form-group">
            <label htmlFor="descricao" className="form-label">
              Descrição Detalhada do Problema
            </label>
            <textarea
              id="descricao"
              className="form-textarea"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              placeholder="Por favor, forneça o máximo de detalhes possível sobre a falha (ex: ruídos, perigos, peças quebradas) para facilitar o trabalho de triagem e execução da equipe técnica."
              rows={6}
            />
          </div>

          {/* Foto */}
          <div className="form-group">
            <label htmlFor="photo" className="form-label">
              Foto da Ocorrência (opcional)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handlePhotoChange}
              className="form-input"
            />
            {PhotoPreview && (
              <div style={{ marginTop: '0.75rem' }}>
                <img
                  src={PhotoPreview}
                  alt="Pré-visualização"
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '10px', border: '1px solid rgba(13,43,94,0.15)' }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-text)', marginTop: '0.25rem' }}>{photo?.name}</p>
              </div>
            )}
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push('/solicitante/dashboard')}
              disabled={isLoading}
            >
              Voltar ao Início
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner" /> Enviando chamado...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Abrir Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(61, 201, 102, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: 'var(--green-light)',
              border: '2px solid var(--green-light)',
              boxShadow: '0 0 15px rgba(61, 201, 102, 0.25)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h3 style={{ fontFamily: 'Sora', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Solicitação Aberta com Sucesso!
            </h3>
            
            <p style={{ color: 'var(--gray-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Seu chamado foi registrado na plataforma com o ID **#{createdTicketId}** e já está disponível na fila de manutenção. Ele foi classificado com o status inicial <span className="badge-status aberto" style={{ display: 'inline-flex', marginLeft: '4px', transform: 'scale(0.95)' }}>ABERTO</span>.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                }}
              >
                Abrir Outro Chamado
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/solicitante/dashboard');
                }}
              >
                Ver Minhas Solicitações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
