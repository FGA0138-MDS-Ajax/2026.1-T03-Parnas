// gerenteService.ts — Serviço de API e Mocks do Gerente
import { Ticket, Technician, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Dados simulados ricos para Fallback (quando o backend não responder ou estiver vazio)
const MOCK_TECHNICIANS: Technician[] = [
  { matricula: '190012345', nome: 'Alessandro da Silva', email: 'alessandro.silva@unb.br', ativo: true, role: 'TECNICO' },
  { matricula: '200054321', nome: 'Maria Eduarda Ribeiro', email: 'maria.eduarda@unb.br', ativo: true, role: 'TECNICO' },
  { matricula: '211023456', nome: 'Carlos Eduardo Costa', email: 'carlos.costa@unb.br', ativo: true, role: 'TECNICO' },
  { matricula: '221098765', nome: 'Fernanda Souza Santos', email: 'fernanda.souza@unb.br', ativo: true, role: 'TECNICO' },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 101,
    local: 'Bloco A - Banheiro Masculino (Térreo)',
    tipo_manutencao: 'Hidráulica',
    descricao: 'Há um vazamento constante de água na tubulação da pia esquerda. O registro geral foi fechado parcialmente para evitar desperdício, mas precisa de reparo urgente no encanamento.',
    status: 'ABERTO',
    solicitante_id: '180098765',
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 horas atrás
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 102,
    local: 'Sala A1-12 (Bloco de Salas)',
    tipo_manutencao: 'Refrigeração',
    descricao: 'O ar-condicionado de 18000 BTUs da sala parou de resfriar completamente e está emitindo um ruído metálico alto quando ligado. A sala é usada para aulas de pós-graduação diariamente.',
    status: 'ABERTO',
    solicitante_id: '200034212',
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 horas atrás
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 103,
    local: 'Laboratório de Química 04 (Bloco C)',
    tipo_manutencao: 'Elétrica',
    descricao: 'Instalação de lâmpadas LED e reparo no reator da bancada central. Duas tomadas de 220V estão desarmando o disjuntor constantemente quando ligamos as estufas.',
    status: 'ABERTO',
    solicitante_id: '170043210',
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 horas atrás
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 104,
    local: 'Bloco B - Sala de Reuniões da Direção',
    tipo_manutencao: 'Marcenaria / Serralheria',
    descricao: 'A porta principal de madeira está empenada, raspando no piso e dificultando o fechamento completo. Além disso, o trinco da fechadura quebrou.',
    status: 'ABERTO',
    solicitante_id: '160012344',
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 horas atrás
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  // Chamados já atribuídos para a Carga de Trabalho
  {
    id: 105,
    local: 'Auditorio Central da FCTE',
    tipo_manutencao: 'Elétrica',
    descricao: 'Substituição das lâmpadas queimadas nos refletores do palco principal antes do evento acadêmico.',
    status: 'EM_ANDAMENTO',
    solicitante_id: '190098761',
    tecnico_id: '190012345', // Alessandro
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 106,
    local: 'Bloco C - Laboratório de Informática 2',
    tipo_manutencao: 'Infraestrutura',
    descricao: 'Fixação de canaletas plásticas para organização dos cabos de rede sob as bancadas dos alunos.',
    status: 'ATRIBUIDO',
    solicitante_id: '200054321',
    tecnico_id: '190012345', // Alessandro
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 107,
    local: 'Biblioteca (Área de Estudos)',
    tipo_manutencao: 'Refrigeração',
    descricao: 'Limpeza de filtros e higienização periódica do sistema de ar condicionado central.',
    status: 'EM_ANDAMENTO',
    solicitante_id: '211023456',
    tecnico_id: '200054321', // Maria Eduarda
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 108,
    local: 'Estacionamento do Bloco de Salas',
    tipo_manutencao: 'Iluminação Externa',
    descricao: 'Troca de fotocélula e lâmpada de vapor de sódio queimada no poste nº 4 do estacionamento.',
    status: 'CONCLUIDO',
    solicitante_id: '211023456',
    tecnico_id: '211023456', // Carlos Eduardo
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

// Carregar dados de armazenamento local (localStorage) para persistir simulações no navegador
const getStorageTickets = (): Ticket[] => {
  if (typeof window === 'undefined') return MOCK_TICKETS;
  const saved = localStorage.getItem('keepunb_manager_tickets');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return MOCK_TICKETS;
    }
  }
  localStorage.setItem('keepunb_manager_tickets', JSON.stringify(MOCK_TICKETS));
  return MOCK_TICKETS;
};

const saveStorageTickets = (tickets: Ticket[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('keepunb_manager_tickets', JSON.stringify(tickets));
  }
};

export const gerenteService = {
  /**
   * Obtém a lista de chamados abertos
   */
  async getChamadosAbertos(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/open`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Erro ao conectar ao backend (/tickets/open), usando fallback offline do KeepUnB.', e);
    }
    // Fallback: filtra os locais salvos no localStorage com status ABERTO
    return getStorageTickets().filter(t => t.status === 'ABERTO');
  },

  /**
   * Obtém a lista de todos os chamados (para painel de carga e relatórios)
   */
  async getTodosChamados(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Erro ao conectar ao backend (/tickets), usando fallback offline do KeepUnB.', e);
    }
    return getStorageTickets();
  },

  /**
   * Obtém a lista de técnicos ativos/disponíveis
   */
  async getTecnicosDisponiveis(): Promise<Technician[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/technicians/available`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Erro ao conectar ao backend (/technicians/available), usando fallback offline do KeepUnB.', e);
    }
    return MOCK_TECHNICIANS;
  },

  /**
   * Atribui um técnico a um chamado
   */
  async atribuirChamado(ticketId: number, tecnicoId: string): Promise<Ticket> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tecnico_id: tecnicoId }),
      });
      if (response.ok) {
        return await response.json();
      }
      
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Falha ao atribuir chamado no servidor.');
    } catch (e: any) {
      console.warn(`Falha na API real ao atribuir, executando simulação no frontend.`, e);
      
      // Simulação Offline
      const tickets = getStorageTickets();
      const idx = tickets.findIndex(t => t.id === ticketId);
      if (idx === -1) throw new Error('Chamado não localizado.');
      
      const tecnico = MOCK_TECHNICIANS.find(tec => tec.matricula === tecnicoId);
      if (!tecnico) throw new Error('Técnico não encontrado ou inativo.');

      const updatedTicket: Ticket = {
        ...tickets[idx],
        tecnico_id: tecnicoId,
        status: 'ATRIBUIDO',
        updated_at: new Date().toISOString(),
      };

      tickets[idx] = updatedTicket;
      saveStorageTickets(tickets);
      return updatedTicket;
    }
  },

  /**
   * Obtém estatísticas consolidadas para o Dashboard do Gerente
   */
  async getDashboardStats(): Promise<DashboardStats> {
    let tickets: Ticket[] = [];
    let technicians: Technician[] = [];

    try {
      const [tRes, tecRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tickets`, { headers: this.getHeaders() }),
        fetch(`${API_BASE_URL}/technicians/available`, { headers: this.getHeaders() })
      ]);
      if (tRes.ok) tickets = await tRes.json();
      if (tecRes.ok) technicians = await tecRes.json();
    } catch (e) {
      // Ignora erro e cai no fallback do localStorage
    }

    if (tickets.length === 0) tickets = getStorageTickets();
    if (technicians.length === 0) technicians = MOCK_TECHNICIANS;

    return {
      abertos: tickets.filter(t => t.status === 'ABERTO').length,
      atribuidos: tickets.filter(t => t.status === 'ATRIBUIDO').length,
      emAndamento: tickets.filter(t => t.status === 'EM_ANDAMENTO').length,
      concluidos: tickets.filter(t => t.status === 'CONCLUIDO').length,
      totalTecnicos: technicians.length,
    };
  },

  /**
   * Gera headers de requisição injetando token mock/real do localStorage se houver
   */
  getHeaders(): HeadersInit {
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('keepunb_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Se estiver simulado pelo login provisório, injetamos um token fictício
        headers['Authorization'] = 'Bearer gerente-mock-token-sprint3';
      }
    }
    return headers;
  }
};
