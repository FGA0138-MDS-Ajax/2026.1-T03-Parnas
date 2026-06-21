// gerenteService.ts - Serviços para funcionalidades do gerente
import { Ticket, DashboardStats } from '../types';

export interface TecnicoPendente {
  id: number;
  nome: string;
  email: string;
  area_manutencao: string;
  role: string;
  ativo: boolean;
  approval_status: string;
}

class GerenteService {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('keepunb_token') : null;
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [ticketsResponse, tecnicosResponse] = await Promise.all([
        fetch(`${this.API_BASE_URL}/tickets`, { headers: this.getAuthHeaders() }),
        fetch(`${this.API_BASE_URL}/technicians/available`, { headers: this.getAuthHeaders() })
      ]);

      const allTickets = ticketsResponse.ok ? await ticketsResponse.json() : [];
      const tecnicos = tecnicosResponse.ok ? await tecnicosResponse.json() : [];

      return {
        abertos: allTickets.filter((t: any) => t.status === 'ABERTO').length,
        atribuidos: allTickets.filter((t: any) => t.status === 'ATRIBUIDO').length,
        emAndamento: allTickets.filter((t: any) => t.status === 'EM_ANDAMENTO').length,
        concluidos: allTickets.filter((t: any) => t.status === 'CONCLUIDO').length,
        totalTecnicos: tecnicos.length,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas do dashboard:', error);
      return { abertos: 0, atribuidos: 0, emAndamento: 0, concluidos: 0, totalTecnicos: 0 };
    }
  }

  async getChamadosAbertos(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tickets/open`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter chamados abertos:', error);
      throw error;
    }
  }

  async getTecnicosPendentes(): Promise<TecnicoPendente[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/technicians/pending`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter técnicos pendentes:', error);
      throw error;
    }
  }

  async aprovarTecnico(id: number): Promise<TecnicoPendente> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/technicians/${id}/approve`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao aprovar técnico:', error);
      throw error;
    }
  }

  async getTecnicosDisponiveis(): Promise<any[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/technicians/available`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter técnicos disponíveis:', error);
      throw error;
    }
  }

  async atribuirChamado(ticketId: number, tecnicoId: string): Promise<any> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ tecnico_id: tecnicoId }),
      });

      if (!response.ok) {
        let errDetails = '';
        try {
          const err = await response.json();
          errDetails = err.detail || '';
        } catch (e) {}
        throw new Error(errDetails || `Erro ao atribuir chamado: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atribuir chamado:', error);
      throw error;
    }
  }

  async rejeitarTecnico(id: number): Promise<TecnicoPendente> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/technicians/${id}/reject`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao rejeitar técnico:', error);
      throw error;
    }
  }
}

export const gerenteService = new GerenteService();