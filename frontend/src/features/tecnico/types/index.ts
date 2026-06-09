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
  status: TicketStatus;
  solicitante_id: string;
  tecnico_id: string | null;
  created_at: string;
  updated_at: string;
}

export type TechnicianUpdateStatus = 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
