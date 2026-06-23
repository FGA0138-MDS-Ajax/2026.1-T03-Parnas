'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '../../../features/admin/services/adminService';
import { ApiError } from '../../../features/shared/services/apiClient';
import '../../(auth)/login/login.css';

export default function AdminPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas dígitos numéricos e comprimento de até 6 caracteres
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setErro('O PIN deve ter entre 4 e 6 dígitos.');
      return;
    }

    setErro('');
    setIsLoading(true);

    try {
      const response = await adminService.verifyPin(pin);
      
      // Salva o novo token com claim 'pin_verified' no sessionStorage
      sessionStorage.setItem('keepunb_token', response.access_token);
      sessionStorage.setItem('keepunb_admin_pin_verified', 'true');

      // Redireciona para o painel principal do admin
      router.push('/admin/usuarios');
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro('PIN incorreto ou erro de comunicação com a API.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/keep-unb-half.png" alt="KeepUnB Logo" className="login-logo" />
        <h1 className="login-title">Acesso Administrativo</h1>
        <p style={{
          color: '#6B7A99',
          fontSize: '0.9rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          Digite seu PIN de segurança para liberar o painel de controle.
        </p>

        <form onSubmit={handleVerifyPin} className="login-form">
          {erro && <div className="login-error">{erro}</div>}

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={handlePinChange}
              required
              className="login-input"
              placeholder="PIN do Administrador"
              maxLength={6}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-login-submit" disabled={isLoading || pin.length < 4}>
            {isLoading ? 'Verificando...' : 'Liberar Painel'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
