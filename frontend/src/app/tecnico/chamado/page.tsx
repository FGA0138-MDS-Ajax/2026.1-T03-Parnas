'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { tecnicoService } from '../../../features/tecnico/services/tecnicoService';

export default function ChamadoAtualPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToCurrentTicket = async () => {
      try {
        const chamados = await tecnicoService.getChamadosAtribuidos();
        const chamadoAtual = chamados[0];

        if (chamadoAtual) {
          router.replace(`/tecnico/chamado/${chamadoAtual.id}`);
          return;
        }
      } catch (e) {
        console.error('Erro ao buscar chamado atual do tecnico:', e);
      }

      router.replace('/tecnico/fila');
    };

    void redirectToCurrentTicket();
  }, [router]);

  return <p className="glass-card">Carregando chamado atual...</p>;
}
