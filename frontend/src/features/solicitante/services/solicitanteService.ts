// solicitanteService.ts - Chamadas reais da API para o perfil Solicitante.
import { apiRequest } from '../../shared/services/apiClient';
import { NovaSolicitacaoInput, SolicitanteDashboardStats, Ticket } from '../types';

export const solicitanteService = {
  async getChamados(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets/me');
  },

  async getOutrosChamados(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets/open/others');
  },

  async criarChamado(input: NovaSolicitacaoInput): Promise<Ticket> {
    const formData = new FormData();
    formData.append('local', input.local);
    formData.append('tipo_manutencao', input.tipo_manutencao);
    formData.append('descricao', input.descricao);
    if (input.photo) {
      formData.append('photo', input.photo);
    }

    return await apiRequest<Ticket>('/tickets', {
      method: 'POST',
      body: formData,
    });
  },

  async getEstatisticas(): Promise<SolicitanteDashboardStats> {
    const tickets = await this.getChamados();

    return {
      total: tickets.length,
      abertos: tickets.filter((ticket) => ticket.status === 'ABERTO').length,
      emAndamento: tickets.filter(
        (ticket) => ticket.status === 'ATRIBUIDO' || ticket.status === 'EM_ANDAMENTO',
      ).length,
      concluidos: tickets.filter((ticket) => ticket.status === 'CONCLUIDO').length,
    };
  },
};
