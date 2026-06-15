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
      const response = await fetch(`${this.API_BASE_URL}/manager/dashboard-stats`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter estatísticas do dashboard:', error);
      throw error;
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