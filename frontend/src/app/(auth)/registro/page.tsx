// page.tsx - Rota de Registro do KeepUnB
'use client';

import React from 'react';
import Link from 'next/link';

export default function RegistroPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '350px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', color: '#333' }}>
        <h2 style={{ color: '#0D2B5E', marginBottom: '0.5rem' }}>KeepUnB - Criar Conta</h2>
        <p style={{ fontSize: '0.85rem', color: '#6B7A99', marginBottom: '1rem' }}>
          Funcionalidade de cadastro em desenvolvimento. Para acessar, use um usuario ja cadastrado no banco de dados.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Acesso restrito:</span>
          <p style={{ fontSize: '0.8rem', color: '#1A3F7A' }}>
            O login valida email, senha, perfil e status ativo diretamente pela API.
          </p>
        </div>

        <Link href="/login" style={{
          marginTop: '1.5rem',
          padding: '0.7rem',
          backgroundColor: '#0D2B5E',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          textAlign: 'center',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '0.9rem',
        }}>
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}
