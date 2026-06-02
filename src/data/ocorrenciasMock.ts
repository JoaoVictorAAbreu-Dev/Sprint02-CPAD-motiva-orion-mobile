import { Ocorrencia } from '../types/domain';

export const ocorrenciasMock: Ocorrencia[] = [
  {
    id: 'occ-0001',
    trechoId: 'br101-0003',
    tipo: 'Roçada pendente',
    descricao: 'Faixa lateral com rebrote após chuva intensa e necessidade de nova roçada mecanizada.',
    data: '2026-05-31T08:20:00.000Z',
    status: 'Aberta'
  },
  {
    id: 'occ-0002',
    trechoId: 'br101-0006',
    tipo: 'Crescimento excessivo',
    descricao: 'Vegetação densa avançando sobre acostamento e comprometendo a leitura de placas.',
    data: '2026-06-01T10:15:00.000Z',
    status: 'Em atendimento'
  },
  {
    id: 'occ-0003',
    trechoId: 'br101-0009',
    tipo: 'Árvore inclinada',
    descricao: 'Indício de inclinação de árvore de médio porte com risco de queda em período de vento.',
    data: '2026-06-01T13:40:00.000Z',
    status: 'Aberta'
  },
  {
    id: 'occ-0004',
    trechoId: 'sp280-0013',
    tipo: 'Obstrução de visibilidade',
    descricao: 'Maciço arbustivo reduzindo visibilidade em acesso operacional e faixa de retorno.',
    data: '2026-06-01T09:05:00.000Z',
    status: 'Em atendimento'
  },
  {
    id: 'occ-0005',
    trechoId: 'sp280-0016',
    tipo: 'Queda de galhos',
    descricao: 'Galhos acumulados após ventania, com potencial de impacto na faixa de rolamento.',
    data: '2026-05-30T16:10:00.000Z',
    status: 'Resolvida'
  },
  {
    id: 'occ-0006',
    trechoId: 'sp280-0020',
    tipo: 'Drenagem comprometida',
    descricao: 'Vegetação obstruindo sarjeta e dificultando o escoamento superficial em curva fechada.',
    data: '2026-06-01T11:55:00.000Z',
    status: 'Aberta'
  },
  {
    id: 'occ-0007',
    trechoId: 'br101-0010',
    tipo: 'Roçada pendente',
    descricao: 'Programação de roçada preventiva ainda não executada no trecho de maior exposição solar.',
    data: '2026-05-29T07:30:00.000Z',
    status: 'Resolvida'
  },
  {
    id: 'occ-0008',
    trechoId: 'sp280-0015',
    tipo: 'Crescimento excessivo',
    descricao: 'Vegetação em talude lateral voltou a crescer acima do padrão operacional após 12 dias.',
    data: '2026-05-30T14:25:00.000Z',
    status: 'Em atendimento'
  }
];
