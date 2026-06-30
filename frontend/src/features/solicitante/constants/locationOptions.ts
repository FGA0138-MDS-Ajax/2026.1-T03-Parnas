export type LocationNode = {
  name: string;
  floors?: {
    name: string;
    rooms: string[];
  }[];
  rooms?: string[];
};

export const CAMPUS_NAME = 'Campus FCTE/UnB';

export const LOCATION_OPTIONS: LocationNode[] = [
  {
    name: 'Prédio UED',
    floors: [
      {
        name: 'Geral',
        rooms: ['Elevador exclusivo PNE'],
      },
      {
        name: '1º Piso',
        rooms: [
          'Laboratório de Física II',
          'Laboratório de Física I',
          'Depósito',
          'Lanchonete',
          'Sala dos Técnicos',
          'Laboratório de Eletrônica NEI I',
          'Laboratório de Eletrônica NEI II',
          'Laboratório de Software e Simulação',
          'Laboratório',
          'Depósito 2 (próximo ao Laboratório de Termofluidos)',
          'Quadro de Energia 1',
          'Laboratório de Termofluidos',
          'Guarita da Portaria 1',
          'Gestão de Pessoas',
          'Núcleo de Atenção à Saúde',
          'Compras',
          'Administração',
          'Vestiário',
          'Banheiro Masculino',
          'Banheiro Feminino',
          'Laboratório MOCAP',
          'Copa dos Servidores',
          'Laboratório de Análise Instrumental',
          'Laboratório de Química',
          'Quadro de Energia 2',
          'Guarita da Portaria 2',
          'Laboratório de Caracterização de Materiais',
          'Laboratório de Eletricidade',
        ],
      },
      {
        name: '2º Piso',
        rooms: [
          'Sala de Professores 01-02',
          'Sala de Professores 03-06',
          'Quadro de Energia 1',
          'Sala de Professores 07-08',
          'Sala de Professores 09-18',
          'Secretaria de Pós-Graduação',
          'Direção',
          'Sala de Reuniões',
          'Sala de Professores 19-20',
          'Sala de Professores 21-24',
          'Banheiro Feminino',
          'Banheiro Masculino',
          'Centro de Manutenção de Equipamentos',
          'Clube de Pesquisa de Ciências Exatas',
          'Quadro de Energia 2',
          'Depósito',
          'Sala de Professores 25-26',
          'Sala de Professores 27-35',
        ],
      },
    ],
  },
  {
    name: 'Prédio UAC',
    floors: [
      {
        name: 'Geral',
        rooms: ['Elevador exclusivo PNE'],
      },
      {
        name: '1º Piso',
        rooms: [
          'Área de Convívio',
          'Guarita da Portaria',
          'Área de Damas',
          'CPD',
          'Lanchonete',
          'Segurança',
          'Arquivo',
          'Secretaria',
          'Banheiro Masculino',
          'Rack/Energia',
          'Banheiro Feminino',
          'Biblioteca',
          'Sala de Computadores BCE',
          'Salas I-1 a I-10',
          'Banheiro Masculino 2',
          'Banheiro Feminino 2',
          'Auditório',
        ],
      },
      {
        name: '2º Piso',
        rooms: [
          'Salas S-1 a S-10',
          'Banheiro Masculino',
          'Banheiro Masculino 2',
          'Banheiro Feminino',
          'Banheiro Feminino 2',
          'Rack/Energia',
          'Rack/Energia 2',
          'Multiuso',
          'Assistência Estudantil',
          'COEDUCA/DASU',
          'CPD',
          'Laboratório de Software',
          'Área de Convívio',
          'Acesso ao Auditório',
        ],
      },
    ],
  },
  {
    name: 'Local CASAS (Centro do Campus)',
  },
  {
    name: 'Local RU',
    rooms: [
      'Garagens 1 a 3',
      'Banheiro Masculino',
      'Banheiro Exclusivo PNE',
      'Banheiro Feminino',
      'Refeitório',
      'Banheiro Masculino (Funcionários)',
      'Banheiro Feminino (Funcionários)',
      'Cozinha',
      'Restaurante',
      'Garagens 4 a 6',
    ],
  },
  {
    name: 'Prédio LDTEA',
    floors: [
      {
        name: '1º Andar',
        rooms: ['Banheiro Masculino', 'Banheiro Feminino', 'Banheiro PCD', 'Salas 101-111'],
      },
      {
        name: '2º Andar',
        rooms: [
          'Banheiro Masculino',
          'Banheiro Feminino',
          'Banheiro PCD',
          'Depósito',
          'Salas 202-208',
          'CPD',
          'Copa',
          'Depósito de Limpeza',
        ],
      },
      {
        name: '3º Andar',
        rooms: [
          'Banheiro Masculino',
          'Banheiro Feminino',
          'Banheiro PCD',
          'Depósito',
          'Salas 301-313',
          'CPD',
          'Depósito de Limpeza',
        ],
      },
    ],
  },
  {
    name: 'Local Containers',
    rooms: ['Containers 1 a 24', 'Container 1422', 'Container 2240', 'Conteiner DeltaV'],
  },
];
