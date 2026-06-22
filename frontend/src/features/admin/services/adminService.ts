import { apiRequest } from '../../shared/services/apiClient';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const adminService = {
  async verifyPin(pin: string): Promise<TokenResponse> {
    return await apiRequest<TokenResponse>('/admin/verify-pin', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    });
  },
};
