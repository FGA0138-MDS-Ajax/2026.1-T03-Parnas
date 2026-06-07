import React from 'react';
import ErrorDisplay from '@/features/shared/components/ui/ErrorDisplay';

export default function NotFoundPage() {
  return (
    <ErrorDisplay
      statusCode={404}
      title="Página não encontrada"
      message="Desculpe, a página que você está procurando não existe."
      description="O link pode estar incorreto ou a página pode ter sido removida."
      showHomeLink={true}
      showBackLink={true}
    />
  );
}