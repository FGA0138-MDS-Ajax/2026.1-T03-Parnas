'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Simulação de Banco de Dados (MOCK) para os 4 perfis da KeepUNB
  const USUARIOS_MOCK = [
    { email: 'admin@gmail.com', senha: '123', perfil: 'admin', rota: '/admin/usuarios' },
    { email: 'solicitante@gmail.com', senha: '123', perfil: 'solicitante', rota: '/solicitante' },
    { email: 'tecnico@gmail.com', senha: '123', perfil: 'tecnico', rota: '/tecnico/fila' },
    { email: 'gerente@gmail.com', senha: '123', perfil: 'gerente', rota: '/gerente' },
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>KeepUnB - Login</h2>
        
        {erro && <p style={{ color: 'red', fontSize: '0.85rem' }}>{erro}</p>}

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>E-mail:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="seu-email@gmail.com"
          />
        </div>

        <div>
          <label htmlFor="senha" style={{ display: 'block', marginBottom: '0.5rem' }}>Senha:</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
            placeholder="******"
          />
        </div>

        <button type="submit" style={{ padding: '0.7rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}