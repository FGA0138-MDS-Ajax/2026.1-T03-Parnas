// NovaSolicitacaoForm.tsx — Formulário premium para abertura de chamados
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { solicitanteService } from '../services/solicitanteService';
import { CAMPUS_NAME, LOCATION_OPTIONS } from '../constants/locationOptions';
import './solicitante.css';

export default function NovaSolicitacaoForm() {
  const router = useRouter();
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [tipoManutencao, setTipoManutencao] = useState('Elétrica');
  const [descricao, setDescricao] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const buildingOption = LOCATION_OPTIONS.find((option) => option.name === selectedBuilding);
  const floorOption = buildingOption?.floors?.find((floor) => floor.name === selectedFloor);
  const roomOptions = floorOption?.rooms ?? buildingOption?.rooms ?? [];
  const requiresFloor = !!buildingOption?.floors?.length;
  const requiresRoom = roomOptions.length > 0;
  const selectedLocation = [CAMPUS_NAME, selectedBuilding, selectedFloor, selectedRoom]
    .filter(Boolean)
    .join(' > ');
  const isLocationComplete =
    !!selectedBuilding &&
    (!requiresFloor || !!selectedFloor) &&
    (!requiresRoom || !!selectedRoom);

  const handleBuildingChange = (building: string) => {
    setSelectedBuilding(building);
    setSelectedFloor('');
    setSelectedRoom('');
  };

  const handleFloorChange = (floor: string) => {
    setSelectedFloor(floor);
    setSelectedRoom('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (photos.length + files.length > 3) {
      setErrorMsg('Você pode adicionar no máximo 3 fotos por chamado.');
      e.target.value = '';
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];
    const tiposValidos = ['image/jpeg', 'image/png'];

    for (const file of files) {
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
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    }

    setErrorMsg('');
    setPhotos(prev => [...prev, ...validFiles]);
    setPhotoPreviews(prev => [...prev, ...validPreviews]);
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLocationComplete) {
      setErrorMsg('Selecione o local completo do chamado.');
      return;
    }

    if (!descricao.trim()) {
      setErrorMsg('A descrição detalhada do problema é obrigatória.');
      return;
    }

    setIsLoading(true);

    try {
      const ticket = await solicitanteService.criarChamado({
        local: selectedLocation,
        tipo_manutencao: tipoManutencao,
        descricao: descricao.trim(),
        photos,
      });

      setCreatedTicketId(ticket.id);
      setShowSuccessModal(true);

      // Limpa os campos
      setSelectedBuilding('');
      setSelectedFloor('');
      setSelectedRoom('');
      setDescricao('');
      setPhotos([]);
      setPhotoPreviews([]);
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
            <div className="location-grid">
              <select id="local" className="form-select" disabled>
                <option value={CAMPUS_NAME}>{CAMPUS_NAME}</option>
              </select>

              <select
                className="form-select"
                value={selectedBuilding}
                onChange={(e) => handleBuildingChange(e.target.value)}
                required
              >
                <option value="">Selecione o prédio/local</option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>

              {requiresFloor && (
                <select
                  className="form-select"
                  value={selectedFloor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  required
                >
                  <option value="">Selecione o piso</option>
                  {buildingOption?.floors?.map((floor) => (
                    <option key={floor.name} value={floor.name}>
                      {floor.name}
                    </option>
                  ))}
                </select>
              )}

              {requiresRoom && (
                <select
                  className="form-select"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  required
                  disabled={requiresFloor && !selectedFloor}
                >
                  <option value="">Selecione a sala/ambiente</option>
                  {roomOptions.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedLocation && (
              <p className="location-preview">
                Local selecionado: <strong>{selectedLocation}</strong>
              </p>
            )}
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
              Fotos da Ocorrência (opcional, máx. 3)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png, image/jpeg"
              multiple
              onChange={handlePhotoChange}
              className="form-input"
              disabled={photos.length >= 3}
            />
            {photoPreviews.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {photoPreviews.map((preview, index) => (
                  <div key={preview} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`Pré-visualização ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(13,43,94,0.15)' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4a4a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                      title="Remover foto"
                    >
                      X
                    </button>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-text)', marginTop: '0.25rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photos[index]?.name}
                    </p>
                  </div>
                ))}
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
