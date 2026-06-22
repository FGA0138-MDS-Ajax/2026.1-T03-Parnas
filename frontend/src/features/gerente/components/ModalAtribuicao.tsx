// ModalAtribuicao.tsx — Modal Interativo de Atribuição de Técnicos
'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Technician, TechnicianSuggestion } from '../types';
import { gerenteService } from '../services/gerenteService';

interface ModalAtribuicaoProps {
  ticket: Ticket;
  onClose: () => void;
  onSuccess: (tecnicoNome: string) => void;
  onError: (erroMsg: string) => void;
}

export default function ModalAtribuicao({
  ticket,
  onClose,
  onSuccess,
  onError,
}: ModalAtribuicaoProps) {
  const [tecnicos, setTecnicos] = useState<Technician[]>([]);
  const [sugestao, setSugestao] = useState<TechnicianSuggestion | null>(null);
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>('');
  const [loadingTecnicos, setLoadingTecnicos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const tecnicosManuais = sugestao
    ? tecnicos.filter((tecnico) => tecnico.matricula !== sugestao.tecnico_id)
    : tecnicos;

  useEffect(() => {
    const fetchDadosAtribuicao = async () => {
      setLoadingTecnicos(true);
      try {
        const [tecnicosDisponiveis, tecnicoSugerido] = await Promise.all([
          gerenteService.getTecnicosDisponiveis(),
          gerenteService.sugerirTecnico(ticket.id).catch(() => null),
        ]);

        setTecnicos(tecnicosDisponiveis);
        setSugestao(tecnicoSugerido);

        if (tecnicoSugerido) {
          setSelectedTecnicoId(tecnicoSugerido.tecnico_id);
        } else if (tecnicosDisponiveis.length > 0) {
          setSelectedTecnicoId(tecnicosDisponiveis[0].matricula);
        } else {
          setSelectedTecnicoId('');
        }
      } catch (e: any) {
        console.error(e);
        onError('Erro ao recuperar dados de atribuição.');
      } finally {
        setLoadingTecnicos(false);
      }
    };
    fetchDadosAtribuicao();
  }, [onError, ticket.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTecnicoId) return;

    setSubmitting(true);
    try {
      const tecnico = tecnicos.find(t => t.matricula === selectedTecnicoId);
      const tecnicoNome = tecnico?.nome || sugestao?.nome || selectedTecnicoId;

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
        <div className="modal-header">
          <h3 className="modal-title">Delegar Chamado Técnico</h3>
          <button className="btn-modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-ticket-summary">
          <div className="summary-label">Chamado Selecionado</div>
          <div className="summary-value-title">#{ticket.id} — {ticket.local}</div>
          <div className="summary-label" style={{ marginTop: '0.5rem' }}>Área do Chamado</div>
          <div className="summary-value-title">{ticket.tipo_manutencao}</div>
          <div className="summary-label" style={{ marginTop: '0.5rem' }}>Problema Relatado</div>
          <p className="summary-value-desc">{ticket.descricao}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="form-group-label">Técnico sugerido pelo sistema:</label>

            {loadingTecnicos ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gray-text)', fontSize: '0.88rem' }}>
                Carregando técnicos...
              </div>
            ) : (
              <>
                {sugestao ? (
                  <div
                    className={`technician-option-card suggested ${selectedTecnicoId === sugestao.tecnico_id ? 'selected' : ''}`}
                    onClick={() => setSelectedTecnicoId(sugestao.tecnico_id)}
                  >
                    <input
                      type="radio"
                      name="tecnico_selected"
                      value={sugestao.tecnico_id}
                      checked={selectedTecnicoId === sugestao.tecnico_id}
                      onChange={() => setSelectedTecnicoId(sugestao.tecnico_id)}
                      className="option-radio"
                    />

                    <div className="option-avatar">
                      {sugestao.nome.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="option-details">
                      <div className="option-name">
                        {sugestao.nome}
                        <span className="suggestion-pill">Sugerido</span>
                      </div>
                      <div className="option-matricula">
                        Matrícula: {sugestao.tecnico_id} • {sugestao.area_manutencao} • {sugestao.quantidade_chamados_ativos} chamados ativos
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="suggestion-empty">
                    Nenhuma sugestão disponível para a área {ticket.tipo_manutencao}.
                  </div>
                )}

                <label className="form-group-label manual-selection-label">Ou escolha outro técnico manualmente:</label>

                {tecnicosManuais.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: '#EF4444', fontSize: '0.88rem' }}>
                    Nenhum outro técnico ativo e aprovado disponível.
                  </div>
                ) : (
                  <div className="technicians-list-select">
                    {tecnicosManuais.map((tec) => (
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
                            Matrícula: {tec.matricula} • {tec.email} • {tec.area_manutencao || 'Área não informada'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-modal-confirm"
              disabled={submitting || !selectedTecnicoId}
            >
              {submitting ? 'Salvando...' : 'Confirmar Atribuição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
