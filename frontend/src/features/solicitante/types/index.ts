// index.ts — Tipos TypeScript para a feature do Solicitante

export type TicketStatus = 
  | 'ABERTO' 
  | 'ATRIBUIDO' 
  | 'EM_ANDAMENTO' 
  | 'CONCLUIDO' 
  | 'CANCELADO' 
  | 'NAO_INICIADO';

export interface Ticket {
  id: number;
  local: string;
  tipo_manutencao: string;
  descricao: string;
  photo_path: string | null;
  status: TicketStatus;
  solicitante_id: string;
  tecnico_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NovaSolicitacaoInput {
  local: string;
  tipo_manutencao: string;
  descricao: string;
  photo?: File | null;
}

export interface SolicitanteDashboardStats {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
}
