// gerenteService.ts - Chamadas reais da API para o perfil Gerente.
import { apiRequest } from '../../shared/services/apiClient';
import { DashboardStats, Technician, Ticket } from '../types';

export const gerenteService = {
  async getChamadosAbertos(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets/open');
  },

  async getChamadosEmAndamento(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets/in-progress');
  },

  async getTodosChamados(): Promise<Ticket[]> {
    return await apiRequest<Ticket[]>('/tickets');
  },

  async getTecnicosDisponiveis(): Promise<Technician[]> {
    return await apiRequest<Technician[]>('/technicians/available');
  },

  async atribuirChamado(ticketId: number, tecnicoId: string): Promise<Ticket> {
    return await apiRequest<Ticket>(`/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ tecnico_id: tecnicoId }),
    });
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const [tickets, technicians] = await Promise.all([
      this.getTodosChamados(),
      this.getTecnicosDisponiveis(),
    ]);

    return {
      abertos: tickets.filter((ticket) => ticket.status === 'ABERTO').length,
      atribuidos: tickets.filter((ticket) => ticket.status === 'ATRIBUIDO').length,
      emAndamento: tickets.filter((ticket) => ticket.status === 'EM_ANDAMENTO').length,
      concluidos: tickets.filter((ticket) => ticket.status === 'CONCLUIDO').length,
      totalTecnicos: technicians.length,
    };
  },
};
