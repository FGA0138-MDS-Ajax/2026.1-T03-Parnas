import React from 'react';
import Link from 'next/link';

interface ErrorDisplayProps {
  statusCode?: number;
  title?: string;
  message: string;
  description?: string;
  showHomeLink?: boolean;
  showBackLink?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  statusCode,
  title,
  message,
  description,
  showHomeLink = true,
  showBackLink = true
}) => {
  return (
    <div className="error-container">
      <div className="error-card">
        {statusCode && (
          <div className="error-status-code">{statusCode}</div>
        )}
        
        <h1 className="error-title">
          {title || (statusCode ? `Erro ${statusCode}` : 'Ocorreu um erro')}
        </h1>
        
        <p className="error-message">
          {message}
        </p>
        
        {description && (
          <p className="error-description">
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {showBackLink && (
            <button 
              onClick={() => window.history.back()}
              className="error-button secondary"
            >
              Voltar
            </button>
          )}
          
          {showHomeLink && (
            <Link href="/">
              <span className="error-button">
                Página Inicial
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;