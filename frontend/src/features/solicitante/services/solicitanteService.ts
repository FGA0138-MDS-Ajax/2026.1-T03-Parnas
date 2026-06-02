// solicitanteService.ts — Serviço de API e Mocks do Solicitante
import { Ticket, NovaSolicitacaoInput, SolicitanteDashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Dados simulados ricos para Fallback (quando o backend não responder ou estiver vazio)
const MOCK_TICKETS: Ticket[] = [
  {
    id: 201,
    local: 'Sala I1 (FCTE)',
    tipo_manutencao: 'Elétrica',
    descricao: 'As duas lâmpadas tubulares do lado esquerdo do quadro estão piscando constantemente, gerando desconforto visual para os estudantes durante as aulas noturnas de MDS.',
    status: 'ABERTO',
    solicitante_id: '211043210', // Gabriel Sousa
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 horas atrás
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 202,
    local: 'RU - Banheiro Masculino',
    tipo_manutencao: 'Hidráulica',
    descricao: 'A descarga do segundo vaso sanitário está travada, disparando água sem parar. O fluxo constante de água está inundando o box e gerando um enorme desperdício de água no campus.',
    status: 'EM_ANDAMENTO',
    solicitante_id: '211043210',
    tecnico_id: '190012345', // Alessandro da Silva
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 dias atrás
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 203,
    local: 'Biblioteca Central (FCTE)',
    tipo_manutencao: 'Infraestrutura',
    descricao: 'A fechadura da porta da sala de estudo em grupo nº 3 está solta, travando por dentro e impedindo que os alunos consigam fechar a porta corretamente para manter o silêncio.',
    status: 'CONCLUIDO',
    solicitante_id: '211043210',
    tecnico_id: '200054321', // Maria Eduarda Ribeiro
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 dias atrás
    updated_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 204,
    local: 'Laboratório de Informática 01',
    tipo_manutencao: 'Equipamentos',
    descricao: 'O ar-condicionado de janela da bancada principal está vibrando de forma violenta e fazendo barulho excessivo, impossibilitando a realização de aulas no ambiente.',
    status: 'CANCELADO',
    solicitante_id: '211043210',
    tecnico_id: null,
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(), // 10 dias atrás
    updated_at: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
  },
];

// Carregar dados de armazenamento local (localStorage) para persistir simulações no navegador
const getStorageTickets = (): Ticket[] => {
  if (typeof window === 'undefined') return MOCK_TICKETS;
  const saved = localStorage.getItem('keepunb_solicitante_tickets');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return MOCK_TICKETS;
    }
  }
  localStorage.setItem('keepunb_solicitante_tickets', JSON.stringify(MOCK_TICKETS));
  return MOCK_TICKETS;
};

const saveStorageTickets = (tickets: Ticket[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('keepunb_solicitante_tickets', JSON.stringify(tickets));
  }
};

export const solicitanteService = {
  /**
   * Obtém os chamados do solicitante logado
   */
  async getChamados(): Promise<Ticket[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        // Se a API retornar dados válidos, salvamos e sincronizamos
        if (data && Array.isArray(data)) {
          // Para evitar esvaziar o localStorage de chamados simulados ricos caso a API retorne vazio no início
          const localTickets = getStorageTickets();
          
          // Mescla os dados do backend com os locais para fins de exibição no frontend (preservando IDs diferentes)
          const apiIds = new Set(data.map((t: any) => t.id));
          const onlyLocal = localTickets.filter(t => !apiIds.has(t.id));
          const merged = [...data, ...onlyLocal];
          
          saveStorageTickets(merged);
          return merged;
        }
      }
    } catch (e) {
      console.warn('Erro ao conectar ao backend (/tickets/me), usando fallback offline do KeepUnB.', e);
    }
    return getStorageTickets();
  },

  /**
   * Abre um novo chamado de manutenção
   */
  async criarChamado(input: NovaSolicitacaoInput): Promise<Ticket> {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          local: input.local,
          tipo_manutencao: input.tipo_manutencao,
          descricao: input.descricao,
        }),
      });

      if (response.ok) {
        const novoTicket = await response.json();
        // Adiciona o ticket do backend ao armazenamento local para consistência
        const tickets = getStorageTickets();
        tickets.unshift(novoTicket);
        saveStorageTickets(tickets);
        return novoTicket;
      }
      
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Falha ao criar o chamado no servidor.');
    } catch (e: any) {
      console.warn('Falha na API real ao criar chamado, executando simulação no frontend.', e);
      
      // Simulação Offline
      const tickets = getStorageTickets();
      const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 201;
      
      const novoTicketOffline: Ticket = {
        id: nextId,
        local: input.local,
        tipo_manutencao: input.tipo_manutencao.charAt(0).toUpperCase() + input.tipo_manutencao.slice(1),
        descricao: input.descricao,
        status: 'ABERTO',
        solicitante_id: typeof window !== 'undefined' ? (localStorage.getItem('keepunb_matricula') || '211043210') : '211043210',
        tecnico_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      tickets.unshift(novoTicketOffline);
      saveStorageTickets(tickets);
      return novoTicketOffline;
    }
  },

  /**
   * Cancela uma solicitação aberta
   */
  async cancelarChamado(ticketId: number): Promise<Ticket> {
    // Nota: Se houver rota correspondente no backend no futuro, podemos integrar aqui.
    // Por enquanto, faremos a atualização do status offline no localStorage e simularemos sucesso.
    const tickets = getStorageTickets();
    const idx = tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) throw new Error('Chamado não localizado.');

    if (tickets[idx].status !== 'ABERTO') {
      throw new Error('Só é possível cancelar chamados que estejam em status ABERTO.');
    }

    const updatedTicket: Ticket = {
      ...tickets[idx],
      status: 'CANCELADO',
      updated_at: new Date().toISOString(),
    };

    tickets[idx] = updatedTicket;
    saveStorageTickets(tickets);
    return updatedTicket;
  },

  /**
   * Obtém estatísticas consolidadas para o Solicitante
   */
  async getEstatisticas(): Promise<SolicitanteDashboardStats> {
    const tickets = await this.getChamados();
    return {
      total: tickets.length,
      abertos: tickets.filter(t => t.status === 'ABERTO').length,
      emAndamento: tickets.filter(t => t.status === 'ATRIBUIDO' || t.status === 'EM_ANDAMENTO').length,
      concluidos: tickets.filter(t => t.status === 'CONCLUIDO').length,
    };
  },

  /**
   * Auxiliar: Gera headers injetando token real do localStorage se houver
   */
  getHeaders(): HeadersInit {
    const headers: HeadersInit = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('keepunb_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['Authorization'] = 'Bearer solicitante-mock-token-sprint3';
      }
    }
    return headers;
  }
};
