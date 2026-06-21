export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const SERVERBASEURL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('keepunb_token');
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getStoredToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Handle different status codes specifically
  if (response.status === 401) {
    // Clear auth session and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('keepunb_token');
      localStorage.removeItem('keepunb_role');
      localStorage.removeItem('keepunb_email');
      localStorage.removeItem('keepunb_matricula');
      localStorage.removeItem('keepunb_nome');
      window.location.href = '/login';
    }
    throw new ApiError('Acesso não autorizado. Faça login novamente.', 401);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || 'Erro ao comunicar com a API.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}