export type UserRole = 'SOLICITANTE' | 'GERENTE' | 'TECNICO' | 'ADMIN';

export interface AuthUser {
  matricula: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}
