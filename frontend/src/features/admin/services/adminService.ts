import { apiRequest } from '../../shared/services/apiClient';
import type { AuthUser, UserRole } from '../../shared/types/auth';

export interface AdminUserResponse {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  role: UserRole;
  ativo: boolean;
  approval_status: string;
  area_manutencao?: string;
  created_at: string;
}

export interface ManagerCreateData {
  nome: string;
  email: string;
  senha: string;
  matricula?: string;
}

export interface UserUpdateAdminData {
  nome?: string;
  email?: string;
  role?: UserRole;
  ativo?: boolean;
  approval_status?: string;
  area_manutencao?: string;
}

export const adminService = {
  async listUsers(): Promise<AdminUserResponse[]> {
    return await apiRequest<AdminUserResponse[]>('/admin/users');
  },

  async createManager(managerData: ManagerCreateData): Promise<AdminUserResponse> {
    return await apiRequest<AdminUserResponse>('/admin/managers', {
      method: 'POST',
      body: JSON.stringify(managerData),
    });
  },

  async updateUser(userId: number, userData: UserUpdateAdminData): Promise<AdminUserResponse> {
    return await apiRequest<AdminUserResponse>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  async deactivateUser(userId: number): Promise<AdminUserResponse> {
    return await apiRequest<AdminUserResponse>(`/admin/users/${userId}/deactivate`, {
      method: 'PATCH',
    });
  },

  async deleteUser(userId: number): Promise<void> {
    return await apiRequest<void>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  async verifyPin(pin: string): Promise<{ access_token: string; token_type: string }> {
    return await apiRequest<{ access_token: string; token_type: string }>('/admin/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  },
};
