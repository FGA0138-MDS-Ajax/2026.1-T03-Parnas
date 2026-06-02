'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);

  // Simulação de Banco de Dados (MOCK) para os 4 perfis da KeepUNB
  const USUARIOS_MOCK = [
    { email: 'admin@gmail.com', senha: '123', perfil: 'admin', rota: '/admin/usuarios' },
    { email: 'solicitante@gmail.com', senha: '123', perfil: 'solicitante', rota: '/solicitante' },
    { email: 'tecnico@gmail.com', senha: '123', perfil: 'tecnico', rota: '/tecnico/fila' },
    { email: 'gerente@gmail.com', senha: '123', perfil: 'gerente', rota: '/gerente/painel' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validação simples do Mock
    const usuarioValido = USUARIOS_MOCK.find(
      (user) => user.email === email && user.senha === senha
    );

    if (usuarioValido) {
      alert(`Login simulado com sucesso como: ${usuarioValido.perfil}`);
      // Direciona para a home correta conforme o perfil
      router.push(usuarioValido.rota);
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/keep-unb-half.png" alt="KeepUnB Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleLogin} className="login-form">
          {erro && <div className="login-error">{erro}</div>}

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="E-mail"
            />
          </div>

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="login-input login-input-password"
              placeholder="Senha"
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
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

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={lembrarMe}
                onChange={(e) => setLembrarMe(e.target.checked)}
              />
              Lembrar-me
            </label>
            <a href="#forgot" className="forgot-password">Esqueci minha senha</a>
          </div>

          <button type="submit" className="btn-login-submit">
            Entrar
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