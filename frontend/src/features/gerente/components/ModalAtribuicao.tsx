// ModalAtribuicao.tsx — Modal Interativo de Atribuição de Técnicos
'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Technician } from '../types';
import { gerenteService } from '../services/gerenteService';

interface ModalAtribuicaoProps {
  ticket: Ticket;
  onClose: () => void;
  onSuccess: (tecnicoNome: string) => void;
  onError: (erroMsg: string) => void;
}

const normalizarArea = (value: string | null | undefined) => value?.trim().toLowerCase() || '';

export default function ModalAtribuicao({
  ticket,
  onClose,
  onSuccess,
  onError,
}: ModalAtribuicaoProps) {
  const [tecnicos, setTecnicos] = useState<Technician[]>([]);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('');
  const [loadingTecnicos, setLoadingTecnicos] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTecnicos = async () => {
      setLoadingTecnicos(true);
      try {
        const data = await gerenteService.getTecnicosDisponiveis();
        const tecnicosCompativeis = data.filter(
          (tecnico) => normalizarArea(tecnico.area_manutencao) === normalizarArea(ticket.tipo_manutencao)
        );
        setTecnicos(tecnicosCompativeis);
        if (tecnicosCompativeis.length > 0) {
          // Pré-seleciona o primeiro técnico compatível com a área do chamado
          setSelectedTecnicoId(tecnicosCompativeis[0].matricula);
        } else {
          setSelectedTecnicoId('');
        }
      } catch (e: any) {
        console.error(e);
        onError('Erro ao recuperar lista de técnicos disponíveis.');
      } finally {
        setLoadingTecnicos(false);
      }
    };
    fetchTecnicos();
  }, [onError, ticket.tipo_manutencao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTecnicoId) return;

    setSubmitting(true);
    try {
      const tecnico = tecnicos.find(t => t.matricula === selectedTecnicoId);
      const tecnicoNome = tecnico ? tecnico.nome : selectedTecnicoId;

      await gerenteService.atribuirChamado(ticket.id, selectedTecnicoId);
      onSuccess(tecnicoNome);
    } catch (e: any) {
      console.error(e);
      onError(e.message || 'Falha ao delegar chamado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <h3 className="modal-title">Delegar Chamado Técnico</h3>
          <button className="btn-modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* RESUMO DO CHAMADO */}
        <div className="modal-ticket-summary">
          <div className="summary-label">Chamado Selecionado</div>
          <div className="summary-value-title">#{ticket.id} — {ticket.local}</div>
          <div className="summary-label" style={{ marginTop: '0.5rem' }}>Área do Chamado</div>
          <div className="summary-value-title">{ticket.tipo_manutencao}</div>
          <div className="summary-label" style={{ marginTop: '0.5rem' }}>Problema Relatado</div>
          <p className="summary-value-desc">{ticket.descricao}</p>
        </div>

        {/* FORMULÁRIO DE SELEÇÃO */}
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="form-group-label">Escolha um Técnico da Área {ticket.tipo_manutencao}:</label>
            
            {loadingTecnicos ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gray-text)', fontSize: '0.88rem' }}>
                Carregando técnicos...
              </div>
            ) : tecnicos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#EF4444', fontSize: '0.88rem' }}>
                Nenhum técnico ativo e aprovado para a área {ticket.tipo_manutencao}.
              </div>
            ) : (
              <div className="technicians-list-select">
                {tecnicos.map((tec) => (
                  <div
                    key={tec.matricula}
                    className={`technician-option-card ${selectedTecnicoId === tec.matricula ? 'selected' : ''}`}
                    onClick={() => setSelectedTecnicoId(tec.matricula)}
                  >
                    <input
                      type="radio"
                      name="tecnico_selected"
                      value={tec.matricula}
                      checked={selectedTecnicoId === tec.matricula}
                      onChange={() => setSelectedTecnicoId(tec.matricula)}
                      className="option-radio"
                    />
                    
                    <div className="option-avatar">
                      {tec.nome.substring(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="option-details">
                      <div className="option-name">{tec.nome}</div>
                      <div className="option-matricula">
                        Matrícula: {tec.matricula} • {tec.email} • {tec.area_manutencao}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AÇÕES DO MODAL */}
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal-confirm"
              disabled={submitting || !selectedTecnicoId || tecnicos.length === 0}
            >
              {submitting ? 'Salvando...' : 'Confirmar Atribuição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
