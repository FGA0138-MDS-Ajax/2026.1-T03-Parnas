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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-gray-50">
      {statusCode && (
        <div className="text-8xl font-bold text-blue-600 mb-4">{statusCode}</div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {title || (statusCode ? `Erro ${statusCode}` : 'Ocorreu um erro')}
      </h1>
      
      <p className="text-lg text-gray-700 mb-4">{message}</p>
      
      {description && (
        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">{description}</p>
      )}
      
      <div className="flex gap-4 mt-6">
        {showBackLink && (
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Voltar
          </button>
        )}
        
        {showHomeLink && (
          <Link href="/">
            <span className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              Página Inicial
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;