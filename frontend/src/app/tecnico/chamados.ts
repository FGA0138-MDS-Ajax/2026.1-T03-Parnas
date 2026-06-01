export type StatusChamado = 'ATRIBUIDO' | 'EM_ANDAMENTO' | 'CONCLUIDO';

export type ChamadoTecnico = {
  id: string;
  titulo: string;
  local: string;
  status: StatusChamado;
  prioridade: 'Média' | 'Urgente';
  tipo: string;
  estimativa: string;
  descricao: string;
};

export const chamadosAtribuidos: ChamadoTecnico[] = [
  {
    id: 'CH-001',
    titulo: 'Ar condicionado vazando no Auditório',
    local: 'Auditório - FCTE',
    status: 'ATRIBUIDO',
    prioridade: 'Média',
    tipo: 'Climatização',
    estimativa: '45 min',
    descricao:
      'O equipamento apresenta vazamento contínuo próximo ao palco e precisa de revisão técnica no dreno, bandeja e tubulação antes do próximo evento no auditório.',
  },
  {
    id: 'CH-005',
    titulo: 'Manutenção do Forno do RU',
    local: 'RU - FCTE',
    status: 'ATRIBUIDO',
    prioridade: 'Urgente',
    tipo: 'Infraestrutura / Predial',
    estimativa: '25 min',
    descricao:
      'O forno principal do restaurante universitário não mantém temperatura estável e está impactando o preparo das refeições. Verificar resistência, painel e alimentação elétrica.',
  },
];

export const buscarChamadoPorId = (id: string) =>
  chamadosAtribuidos.find((chamado) => chamado.id === decodeURIComponent(id));
