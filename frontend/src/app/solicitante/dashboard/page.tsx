// page.tsx — Rota do Dashboard do Solicitante KeepUnB
'use client';

import React from 'react';
import DashboardContent from '../../../features/solicitante/components/DashboardContent';

export default function SolicitanteDashboardPage() {
  return (
    <>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Painel Geral do Solicitante</h1>
        <p className="page-subtitle">Acompanhe seus chamados de manutenção de infraestrutura abertos no KeepUnB.</p>
      </header>
      
      <section>
        <DashboardContent />
      </section>
    </>
  );
}
