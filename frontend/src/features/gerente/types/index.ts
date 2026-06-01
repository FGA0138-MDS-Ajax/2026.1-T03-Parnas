// index.ts — Tipos TypeScript para a feature do Gerente

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

export interface Technician {
  matricula: string;
  nome: string;
  email: string;
  ativo: boolean;
  role: 'TECNICO' | 'SOLICITANTE' | 'GERENTE' | 'ADMIN';
}

export interface DashboardStats {
  abertos: number;
  atribuidos: number;
  emAndamento: number;
  concluidos: number;
  totalTecnicos: number;
}
