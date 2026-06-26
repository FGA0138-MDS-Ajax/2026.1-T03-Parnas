'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './esqueci-senha.css';
import { ApiError } from '../../../features/shared/services/apiClient';
import { authService } from '../../../features/shared/services/authService';

type Step = 'EMAIL' | 'CODE' | 'NEW_PASSWORD' | 'SUCCESS';

export default function EsqueciSenhaPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<Step>('EMAIL');
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [resetToken, setResetToken] = useState('');
  
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSucesso('Se o e-mail estiver cadastrado, você receberá um código em breve.');
      setStep('CODE');
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro('Não foi possível solicitar a recuperação no momento.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      const response = await authService.verifyCode(email, code);
      setResetToken(response.reset_token);
      setSucesso('');
      setStep('NEW_PASSWORD');
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro('Código inválido ou erro no servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }
    
    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(resetToken, novaSenha);
      setSucesso('Senha redefinida com sucesso!');
      setStep('SUCCESS');
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro('Não foi possível redefinir a senha.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="esqueci-container">
      <div className="esqueci-card">
        <img src="/keep-unb-half.png" alt="KeepUnB Logo" className="esqueci-logo" />
        
        {step === 'EMAIL' && (
          <>
            <h1 className="esqueci-title">Recuperar Senha</h1>
            <p className="esqueci-subtitle">
              Informe seu e-mail cadastrado e enviaremos um código de 6 dígitos para redefinição.
            </p>
            
            <form onSubmit={handleRequestCode} className="esqueci-form">
              {erro && <div className="esqueci-error">{erro}</div>}
              {sucesso && <div className="esqueci-success">{sucesso}</div>}

              <div className="input-group">
                <div className="input-icon-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="esqueci-input"
                  placeholder="Seu e-mail"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
          </>
        )}

        {step === 'CODE' && (
          <>
            <h1 className="esqueci-title">Verificar Código</h1>
            <p className="esqueci-subtitle">
              Digite o código de 6 dígitos que enviamos para <strong>{email}</strong>
            </p>
            
            <form onSubmit={handleVerifyCode} className="esqueci-form">
              {erro && <div className="esqueci-error">{erro}</div>}
              {sucesso && <div className="esqueci-success">{sucesso}</div>}

              <div className="input-group">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="esqueci-input esqueci-input-code"
                  placeholder="000000"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={isLoading || code.length !== 6}>
                {isLoading ? 'Verificando...' : 'Verificar Código'}
              </button>
            </form>
          </>
        )}

        {step === 'NEW_PASSWORD' && (
          <>
            <h1 className="esqueci-title">Nova Senha</h1>
            <p className="esqueci-subtitle">
              Crie uma nova senha segura.
            </p>
            
            <form onSubmit={handleResetPassword} className="esqueci-form">
              {erro && <div className="esqueci-error">{erro}</div>}

              <div className="input-group">
                <div className="input-icon-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className="esqueci-input esqueci-input-password"
                  placeholder="Nova senha"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="input-group">
                <div className="input-icon-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="esqueci-input esqueci-input-password"
                  placeholder="Confirmar nova senha"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Redefinir Senha'}
              </button>
            </form>
          </>
        )}

        {step === 'SUCCESS' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#1B7A3A' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="esqueci-title">Pronto!</h1>
            <p className="esqueci-subtitle" style={{ marginBottom: '2rem' }}>
              Sua senha foi redefinida com sucesso. Você já pode fazer login.
            </p>
            <Link href="/login" className="btn-submit" style={{ textDecoration: 'none' }}>
              Fazer Login
            </Link>
          </div>
        )}

        {step !== 'SUCCESS' && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/login" className="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar ao Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
