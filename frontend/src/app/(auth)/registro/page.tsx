// page.tsx - Rota de Registro do KeepUnB
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './registro.css';

interface RegistrationData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  tipoUsuario: 'SOLICITANTE' | 'TECNICO';
  matricula: string;
  areaManutencao: string;
}

// Definindo a interface para a requisição de registro
interface RegisterRequest {
  matricula: string;
  nome: string;
  email: string;
  senha: string;
  role: 'SOLICITANTE' | 'TECNICO';
  area_manutencao?: string;
}

// Definindo a interface para a resposta da API
interface ApiResponse {
  access_token?: string;
  token_type?: string;
  detail?: string;
}

// Função para registrar usuário via API
const registerUser = async (userData: RegisterRequest): Promise<ApiResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Erro desconhecido durante o registro');
  }

  return data;
};

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationData>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: 'SOLICITANTE',
    matricula: '',
    areaManutencao: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (erro) setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    // Validation
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setErro('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    // Validar matrícula para ambos os tipos de usuário, pois é obrigatória no backend
    if (!formData.matricula) {
      setErro('Matrícula é obrigatória para todos os usuários.');
      return;
    }

    if (formData.matricula.length !== 9 || !/^\d{9}$/.test(formData.matricula)) {
      setErro('Matrícula deve ter 9 dígitos numéricos.');
      return;
    }

    if (formData.tipoUsuario === 'TECNICO' && !formData.areaManutencao) {
      setErro('Área de manutenção é obrigatória para técnicos.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErro('Por favor, insira um e-mail válido.');
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio - sempre inclui matricula para ambos os tipos de usuário
      const registerData: RegisterRequest = {
        matricula: formData.matricula,
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        role: formData.tipoUsuario,
        ...(formData.tipoUsuario === 'TECNICO' && { area_manutencao: formData.areaManutencao }),
      };

      // Chamar API de registro
      const response = await registerUser(registerData);

      // Mostrar mensagem de sucesso diferente conforme o tipo de usuário
      if (formData.tipoUsuario === 'SOLICITANTE') {
        setSucesso('Cadastro realizado com sucesso. Você já pode fazer login.');
        
        // Salvar token se for retornado (para solicitante aprovado imediatamente)
        if (response.access_token) {
          localStorage.setItem('keepunb_token', response.access_token);
        }
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Para técnico, a resposta pode ser diferente (sem token imediato)
        setSucesso('Cadastro enviado para aprovação. Aguarde a aprovação de um gerente para acessar o sistema.');
        
        // Limpar o formulário para novo cadastro
        setFormData({
          nome: '',
          email: '',
          senha: '',
          confirmarSenha: '',
          tipoUsuario: 'SOLICITANTE',
          matricula: '',
          areaManutencao: '',
        });
      }
    } catch (error: any) {
      setErro(error.message || 'Ocorreu um erro durante o cadastro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/keep-unb-half.png" alt="KeepUnB Logo" className="login-logo" />
        <h1 className="login-title">Criar Conta</h1>

        {sucesso && (
          <div className="login-error" style={{ 
            backgroundColor: '#D4F0DC', 
            borderColor: '#3DC966', 
            color: '#1B7A3A',
            marginBottom: '1rem'
          }}>
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {erro && <div className="login-error">{erro}</div>}

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              required
              className="login-input"
              placeholder="Nome Completo"
            />
          </div>

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
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
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
              className="login-input login-input-password"
              placeholder="Senha"
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
              id="confirmar-senha"
              name="confirmarSenha"
              type="password"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              className="login-input login-input-password"
              placeholder="Confirmar Senha"
            />
          </div>

          <div className="input-group">
            <select
              id="tipo-usuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              className="login-input"
            >
              <option value="SOLICITANTE">Solicitante</option>
              <option value="TECNICO">Técnico</option>
            </select>
          </div>

          <div className="input-group">
            <div className="input-icon-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <input
              id="matricula"
              name="matricula"
              type="text"
              value={formData.matricula}
              onChange={handleChange}
              required
              className="login-input"
              placeholder="Matrícula (9 dígitos)"
              maxLength={9}
              pattern="[0-9]{9}"
            />
          </div>

          {formData.tipoUsuario === 'TECNICO' && (
            <div className="input-group">
              <div className="input-icon-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <input
                id="area-manutencao"
                name="areaManutencao"
                type="text"
                value={formData.areaManutencao}
                onChange={handleChange}
                required
                className="login-input"
                placeholder="Área de Manutenção"
              />
            </div>
          )}

          <button type="submit" className="btn-login-submit" disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Criar Conta'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/login" style={{
            color: '#6B7A99',
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}