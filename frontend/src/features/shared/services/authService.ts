import { apiRequest } from './apiClient';
import type { AuthUser, LoginCredentials, TokenResponse, UserRole } from '../types/auth';

export const getDefaultRouteForRole = (role: UserRole) => {
  const routes: Record<UserRole, string> = {
    SOLICITANTE: '/solicitante/dashboard',
    GERENTE: '/gerente/painel',
    TECNICO: '/tecnico/fila',
    ADMIN: '/admin/usuarios',
  };

  return routes[role];
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('keepunb_token');
  sessionStorage.removeItem('keepunb_role');
  sessionStorage.removeItem('keepunb_email');
  sessionStorage.removeItem('keepunb_matricula');
  sessionStorage.removeItem('keepunb_nome');
  sessionStorage.removeItem('keepunb_admin_pin_verified');
};

export const saveAuthUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('keepunb_role', user.role);
  sessionStorage.setItem('keepunb_email', user.email);
  sessionStorage.setItem('keepunb_matricula', user.matricula);
  sessionStorage.setItem('keepunb_nome', user.nome);
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    clearAuthSession();

    const token = await apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    sessionStorage.setItem('keepunb_token', token.access_token);

    try {
      const user = await this.getCurrentUser();
      saveAuthUser(user);
      return user;
    } catch (error) {
      clearAuthSession();
      throw error;
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    return await apiRequest<AuthUser>('/users/me');
  },

  logout() {
    clearAuthSession();
  },

  async forgotPassword(email: string): Promise<void> {
    await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyCode(email: string, code: string): Promise<{ reset_token: string }> {
    return await apiRequest<{ reset_token: string }>('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  async resetPassword(token: string, nova_senha: string): Promise<void> {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, nova_senha }),
    });
  },
};
