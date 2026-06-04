// tecnicoService.ts - Chamadas reais da API para o perfil Tecnico.
import { apiRequest } from '../../shared/services/apiClient';
import { TechnicianUpdateStatus, Ticket } from '../types';

export const tecnicoService = {
  async getChamadosAtribuidos(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets/assigned-to-me');
  },

  async getChamadoAtribuido(ticketId: number): Promise<Ticket | null> {
    const tickets = await this.getChamadosAtribuidos();
    return tickets.find((ticket) => ticket.id === ticketId) || null;
  },

  async atualizarStatus(ticketId: number, status: TechnicianUpdateStatus): Promise<Ticket> {
    return await apiRequest<Ticket>(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
