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
  localStorage.removeItem('keepunb_token');
  localStorage.removeItem('keepunb_role');
  localStorage.removeItem('keepunb_email');
  localStorage.removeItem('keepunb_matricula');
  localStorage.removeItem('keepunb_nome');
};

export const saveAuthUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('keepunb_role', user.role);
  localStorage.setItem('keepunb_email', user.email);
  localStorage.setItem('keepunb_matricula', user.matricula);
  localStorage.setItem('keepunb_nome', user.nome);
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    clearAuthSession();

    const token = await apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    localStorage.setItem('keepunb_token', token.access_token);

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
};
