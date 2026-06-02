import { redirect } from 'next/navigation';

import { chamadosAtribuidos } from '../chamados';

export default function ChamadoAtualPage() {
  const chamadoAtual = chamadosAtribuidos[0];

  if (!chamadoAtual) {
    redirect('/tecnico/fila');
  }

  redirect(`/tecnico/chamado/${encodeURIComponent(chamadoAtual.id)}`);
}