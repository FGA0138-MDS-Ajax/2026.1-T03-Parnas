'use client';

import React from 'react';
import Link from 'next/link';
import ErrorDisplay from '@/features/shared/components/ui/ErrorDisplay';

export default function ForbiddenPage() {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-status-code">403</div>
        <h1 className="error-title">Acesso proibido</h1>
        <p className="error-message">Você não tem permissão para acessar este recurso.</p>
        <p className="error-description">Entre em contato com o administrador do sistema se acredita que isso é um erro.</p>
        <div className="text-center mt-6">
          <Link 
            href="/"
            className="error-button"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
}
