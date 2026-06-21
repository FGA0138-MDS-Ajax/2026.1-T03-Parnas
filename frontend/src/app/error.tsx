'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import ErrorDisplay from '@/features/shared/components/ui/ErrorDisplay';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // Determine the status code from the error if available
  let statusCode = 500;
  let title = "Algo deu errado";
  let message = "Ocorreu um erro inesperado.";
  
  if (error.message.includes('401')) {
    statusCode = 401;
    title = "Acesso não autorizado";
    message = "Sua sessão pode ter expirado. Por favor, faça login novamente.";
  } else if (error.message.includes('403')) {
    statusCode = 403;
    title = "Acesso proibido";
    message = "Você não tem permissão para acessar este recurso.";
  } else if (error.message.includes('404')) {
    statusCode = 404;
    title = "Recurso não encontrado";
    message = "O item que você está procurando não foi encontrado.";
  }

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-status-code">{statusCode}</div>
        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>
        
        {statusCode === 500 && (
          <div className="text-center mt-4">
            <button
              onClick={reset}
              className="error-button"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {statusCode === 401 && (
          <div className="text-center mt-4">
            <Link 
              href="/login"
              className="error-button"
            >
              Fazer login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
