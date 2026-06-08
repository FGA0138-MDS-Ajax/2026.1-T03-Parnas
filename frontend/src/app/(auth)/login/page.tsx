'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './login.css';
import { ApiError } from '../../../features/shared/services/apiClient';
import { authService, getDefaultRouteForRole } from '../../../features/shared/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      const user = await authService.login({ email, senha });
      router.push(getDefaultRouteForRole(user.role));
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message);
      } else {
        setErro('Nao foi possivel entrar. Verifique se a API esta disponivel.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Image src="/keep-unb-half.png" alt="KeepUnB Logo" width={200} height={100} className="login-logo" />
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleLogin} className="login-form">
          {erro && <div className="login-error">{erro}</div>}

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>