'use client';

import React from 'react';
import Link from 'next/link';
import ErrorDisplay from '@/features/shared/components/ui/ErrorDisplay';

export default function UnauthorizedPage() {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-status-code">401</div>
        <h1 className="error-title">Acesso não autorizado</h1>
        <p className="error-message">Sua sessão expirou ou você não tem permissão para acessar esta página.</p>
        <p className="error-description">Por favor, faça login novamente para continuar.</p>
        <div className="text-center mt-6">
          <Link 
            href="/login"
            className="error-button"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}