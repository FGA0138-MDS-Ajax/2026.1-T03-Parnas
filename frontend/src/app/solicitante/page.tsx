import { redirect } from 'next/navigation';

export default function SolicitanteRootPage() {
  // Assim que o usuário cair em /solicitante, o Next.js joga ele direto para a dashboard
  redirect('/solicitante/dashboard');
}