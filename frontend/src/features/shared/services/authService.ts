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
  const keys = [
    'keepunb_token',
    'keepunb_role',
    'keepunb_email',
    'keepunb_matricula',
    'keepunb_nome',
    'keepunb_admin_pin_verified',
  ];
  keys.forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

export const saveAuthUser = (user: AuthUser, rememberMe?: boolean) => {
  if (typeof window === 'undefined') return;
  const isRemembered = rememberMe !== undefined ? rememberMe : !!localStorage.getItem('keepunb_token');
  const storage = isRemembered ? localStorage : sessionStorage;
  
  storage.setItem('keepunb_role', user.role);
  storage.setItem('keepunb_email', user.email);
  storage.setItem('keepunb_matricula', user.matricula);
  storage.setItem('keepunb_nome', user.nome);
};

export const authService = {
  async login(credentials: LoginCredentials, rememberMe?: boolean): Promise<AuthUser> {
    clearAuthSession();

    const token = await apiRequest<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        ...credentials,
        lembrar_me: rememberMe,
      }),
    });

    if (rememberMe) {
      localStorage.setItem('keepunb_token', token.access_token);
    }
    sessionStorage.setItem('keepunb_token', token.access_token);

    try {
      const user = await this.getCurrentUser();
      saveAuthUser(user, rememberMe);
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
