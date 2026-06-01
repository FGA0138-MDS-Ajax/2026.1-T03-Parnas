// page.tsx — Rota para Abertura de Novo Chamado do Solicitante
'use client';

import React from 'react';
import NovaSolicitacaoForm from '../../../features/solicitante/components/NovaSolicitacaoForm';

export default function NovaSolicitacaoPage() {
  return (
    <>
      <header style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
        <h1 className="page-title">Abrir Novo Chamado</h1>
        <p className="page-subtitle" style={{ maxWidth: '600px', margin: '0.3rem auto 1rem' }}>
          Ajude a manter a infraestrutura da FCTE conservada. Registre uma ocorrência de manutenção preenchendo as informações abaixo.
        </p>
      </header>

      <section>
        <NovaSolicitacaoForm />
      </section>
    </>
  );
}