'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService, type AdminUserResponse } from '../../../features/admin/services/adminService';
import type { UserRole } from '../../../features/shared/types/auth';

export default function UsuariosPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);

  // Form states
  const [createData, setCreateData] = useState({
    nome: '',
    email: '',
    senha: '',
    matricula: '',
  });
  const [editData, setEditData] = useState({
    nome: '',
    email: '',
    role: 'SOLICITANTE' as UserRole,
    ativo: true,
    approval_status: 'PENDENTE',
    area_manutencao: '',
  });

  // Action feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (message: string, isError: boolean = false) => {
    setToastMessage({ text: message, error: isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar a lista de usuários. Tente recarregar a página.');
      showToast('Erro ao carregar usuários.', true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filter users based on query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.nome.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.matricula.toLowerCase().includes(query)
    );
  });

  // KPI Calculations
  const totalUsers = users.length;
  const totalManagers = users.filter(u => u.role === 'GERENTE').length;
  const totalTechs = users.filter(u => u.role === 'TECNICO').length;
  const pendingTechs = users.filter(u => u.role === 'TECNICO' && u.approval_status === 'PENDENTE').length;

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateData({
      ...createData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setEditData({
      ...editData,
      [e.target.name]: value,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    if (!createData.nome || !createData.email || !createData.senha) {
      setFormError('Preencha os campos obrigatórios.');
      setSubmitting(false);
      return;
    }

    if (createData.matricula && !/^\d{9}$/.test(createData.matricula)) {
      setFormError('A matrícula deve conter exatamente 9 dígitos.');
      setSubmitting(false);
      return;
    }

    try {
      await adminService.createManager({
        nome: createData.nome,
        email: createData.email,
        senha: createData.senha,
        matricula: createData.matricula || undefined,
      });
      showToast('Gerente criado com sucesso!');
      setIsCreateOpen(false);
      setCreateData({ nome: '', email: '', senha: '', matricula: '' });
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Erro ao criar gerente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);
    setSubmitting(true);

    try {
      await adminService.updateUser(selectedUser.id, {
        nome: editData.nome || undefined,
        email: editData.email || undefined,
        role: editData.role,
        ativo: editData.ativo,
        approval_status: editData.role === 'TECNICO' ? editData.approval_status : undefined,
        area_manutencao: editData.role === 'TECNICO' ? editData.area_manutencao : undefined,
      });
      showToast('Usuário atualizado com sucesso!');
      setIsEditOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Erro ao atualizar dados do usuário.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setEditData({
      nome: user.nome,
      email: user.email,
      role: user.role,
      ativo: user.ativo,
      approval_status: user.approval_status || 'PENDENTE',
      area_manutencao: user.area_manutencao || '',
    });
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleDeactivate = async (user: AdminUserResponse) => {
    const actionText = user.ativo ? 'desativar' : 'ativar';
    if (!confirm(`Deseja realmente ${actionText} o usuário ${user.nome}?`)) return;

    try {
      if (user.ativo) {
        await adminService.deactivateUser(user.id);
        showToast(`Usuário desativado com sucesso!`);
      } else {
        // Para reativar, usamos a rota geral patch update
        await adminService.updateUser(user.id, { ativo: true });
        showToast(`Usuário ativado com sucesso!`);
      }
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || `Erro ao alterar estado do usuário.`, true);
    }
  };

  const handleDelete = async (user: AdminUserResponse) => {
    if (!confirm(`⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nDeseja realmente excluir permanentemente a conta de ${user.nome} (Matrícula: ${user.matricula})?\n\nQualquer chamado ou histórico vinculado a este usuário será reatribuído automaticamente.`)) return;

    try {
      await adminService.deleteUser(user.id);
      showToast('Usuário excluído com sucesso!');
      await loadUsers();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao excluir usuário.', true);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <span className="status-badge admin">Administrador</span>;
      case 'GERENTE': return <span className="status-badge gerente">Gerente</span>;
      case 'TECNICO': return <span className="status-badge tecnico">Técnico</span>;
      case 'SOLICITANTE': return <span className="status-badge solicitante">Solicitante</span>;
      default: return <span className="status-badge">{role}</span>;
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'APROVADO': return <span className="status-badge aprovado">Aprovado</span>;
      case 'PENDENTE': return <span className="status-badge pendente">Pendente</span>;
      case 'REJEITADO': return <span className="status-badge rejeitado">Rejeitado</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      
      {/* CABEÇALHO */}
      <header className="content-header">
        <div>
          <h1 className="content-title">Gerenciamento de Usuários</h1>
          <p className="content-subtitle">Visualize, crie gerentes, edite dados cadastrais e modifique perfis de acesso do KeepUnB.</p>
        </div>
        <button className="btn-primary-admin" onClick={() => { setFormError(null); setIsCreateOpen(true); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Criar Novo Gerente
        </button>
      </header>

      {/* METRICAS DE USUARIOS */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total de Usuários</span>
          <span className="kpi-value">{loading ? '...' : totalUsers}</span>
          <svg className="kpi-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Gerentes</span>
          <span className="kpi-value">{loading ? '...' : totalManagers}</span>
          <svg className="kpi-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Técnicos Ativos</span>
          <span className="kpi-value">{loading ? '...' : totalTechs}</span>
          <svg className="kpi-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Técnicos Pendentes</span>
          <span className="kpi-value" style={{ color: pendingTechs > 0 ? '#F59E0B' : 'inherit' }}>
            {loading ? '...' : pendingTechs}
          </span>
          <svg className="kpi-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
      </section>

      {/* BARRA DE FILTRO */}
      <section className="filter-bar">
        <div className="search-input-wrap">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar usuários por nome, email ou matrícula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* TABELA DE USUARIOS */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0', gap: '1rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', borderColor: 'var(--navy) transparent var(--navy) transparent', borderStyle: 'solid', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--gray-text)', fontFamily: 'Sora', fontSize: '0.95rem' }}>Carregando dados da plataforma...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '20px', border: '1px solid rgba(13,43,94,0.08)' }}>
          <p style={{ color: '#EF4444', fontSize: '1rem', fontWeight: 600 }}>{error}</p>
          <button className="btn-primary-admin" style={{ marginTop: '1rem' }} onClick={loadUsers}>Tentar Novamente</button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#fff', borderRadius: '20px', border: '1px solid rgba(13,43,94,0.08)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
          <h3 style={{ fontFamily: 'Sora', color: 'var(--navy-dark)', fontSize: '1.1rem', fontWeight: 600 }}>Nenhum usuário correspondente</h3>
          <p style={{ color: 'var(--gray-text)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Verifique os termos buscados e tente novamente.</p>
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Nome / Matrícula</th>
                <th>E-mail</th>
                <th>Perfil de Acesso</th>
                <th>Status da Conta</th>
                <th>Homologação</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar">
                        {user.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="user-cell-name">{user.nome}</span>
                        <span className="user-cell-matricula">{user.matricula || 'Sem Matrícula'}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    {user.ativo ? (
                      <span className="status-badge active">Ativo</span>
                    ) : (
                      <span className="status-badge inactive">Inativo</span>
                    )}
                  </td>
                  <td>
                    {user.role === 'TECNICO' ? (
                      getApprovalBadge(user.approval_status)
                    ) : (
                      <span style={{ color: '#E2E8F0', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      <button className="btn-icon-action edit" onClick={() => openEditModal(user)} title="Editar dados">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button className={`btn-icon-action deactivate ${!user.ativo ? 'active' : ''}`} onClick={() => handleDeactivate(user)} title={user.ativo ? "Desativar conta" : "Ativar conta"}>
                        {user.ativo ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        )}
                      </button>
                      <button className="btn-icon-action delete" onClick={() => handleDelete(user)} title="Excluir permanentemente">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CRIAR GERENTE */}
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Criar Novo Gerente</h3>
              <button className="btn-modal-close" onClick={() => setIsCreateOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-form-group">
                <label className="form-group-label">Nome Completo *</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  placeholder="Ex: Carlos Costa"
                  value={createData.nome}
                  onChange={handleCreateChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="form-group-label">E-mail Operacional *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Ex: gerente@gmail.com"
                  value={createData.email}
                  onChange={handleCreateChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="form-group-label">Senha Provisória *</label>
                <input
                  type="password"
                  name="senha"
                  className="form-input"
                  placeholder="Mínimo de 6 caracteres"
                  value={createData.senha}
                  onChange={handleCreateChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="form-group-label">Matrícula FCTE (Opcional)</label>
                <input
                  type="text"
                  name="matricula"
                  className="form-input"
                  placeholder="Ex: 211045231 (9 dígitos)"
                  value={createData.matricula}
                  onChange={handleCreateChange}
                />
              </div>

              {formError && <span className="form-error-msg">{formError}</span>}

              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-admin" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Gerente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {isEditOpen && selectedUser && (
        <div className="modal-backdrop" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Editar Conta de Usuário</h3>
              <button className="btn-modal-close" onClick={() => setIsEditOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-group">
                <label className="form-group-label">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  value={editData.nome}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="form-group-label">E-mail</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={editData.email}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="form-group-label">Cargo / Perfil</label>
                <select name="role" className="form-select" value={editData.role} onChange={handleEditChange}>
                  <option value="SOLICITANTE">Solicitante</option>
                  <option value="TECNICO">Técnico</option>
                  <option value="GERENTE">Gerente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {editData.role === 'TECNICO' && (
                <>
                  <div className="modal-form-group">
                    <label className="form-group-label">Área de Atuação Técnica</label>
                    <input
                      type="text"
                      name="area_manutencao"
                      className="form-input"
                      placeholder="Ex: Hidráulica, Elétrica, Refrigeração"
                      value={editData.area_manutencao}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="modal-form-group">
                    <label className="form-group-label">Homologação Técnica (Aprovação)</label>
                    <select name="approval_status" className="form-select" value={editData.approval_status} onChange={handleEditChange}>
                      <option value="PENDENTE">Pendente</option>
                      <option value="APROVADO">Aprovado</option>
                      <option value="REJEITADO">Rejeitado</option>
                    </select>
                  </div>
                </>
              )}

              <div className="modal-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  name="ativo"
                  id="ativo-chk"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={editData.ativo}
                  onChange={handleEditChange}
                />
                <label htmlFor="ativo-chk" className="form-group-label" style={{ margin: 0, cursor: 'pointer' }}>Conta Ativa</label>
              </div>

              {formError && <span className="form-error-msg">{formError}</span>}

              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsEditOpen(false)} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-admin" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO TOAST */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.error ? 'error' : ''}`}>
          {toastMessage.error ? '❌' : '✅'} <span>{toastMessage.text}</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
