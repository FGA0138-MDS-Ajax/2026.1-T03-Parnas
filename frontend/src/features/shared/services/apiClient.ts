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
  return sessionStorage.getItem('keepunb_token');
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

  const data = await response.json().catch(() => null);

  // Handle different status codes specifically
  if (response.status === 401) {
    // Clear auth session and redirect to login
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('keepunb_token');
      sessionStorage.removeItem('keepunb_role');
      sessionStorage.removeItem('keepunb_email');
      sessionStorage.removeItem('keepunb_matricula');
      sessionStorage.removeItem('keepunb_nome');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message = data?.detail || 'Acesso não autorizado. Faça login novamente.';
    throw new ApiError(message, 401);
  }

  if (!response.ok) {
    const message = data?.detail || 'Erro ao comunicar com a API.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}
