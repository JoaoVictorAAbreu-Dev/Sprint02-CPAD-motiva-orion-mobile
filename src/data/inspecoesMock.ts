import { Inspecao } from '../types/domain';

export const inspecoesMock: Inspecao[] = [
  {
    id: 'insp-0001',
    trechoId: 'br101-0006',
    data: '2026-06-01T10:15:00.000Z',
    responsavel: 'Equipe Norte 03',
    observacao: 'Vegetação avançando sobre acostamento e reduzindo a leitura de sinalização.',
    risco: 'Alto',
    acaoRecomendada: 'Roçada mecanizada e retirada de massa vegetal.',
    fotoUri: 'demo://foto/br101-0006'
  },
  {
    id: 'insp-0002',
    trechoId: 'sp280-0013',
    data: '2026-06-01T09:05:00.000Z',
    responsavel: 'Equipe Oeste 02',
    observacao: 'Maciço arbustivo com visibilidade comprometida em acesso operacional.',
    risco: 'Alto',
    acaoRecomendada: 'Intervenção imediata com poda e limpeza da faixa de domínio.',
    fotoUri: 'demo://foto/sp280-0013'
  },
  {
    id: 'insp-0003',
    trechoId: 'br101-0010',
    data: '2026-05-29T07:30:00.000Z',
    responsavel: 'Equipe Norte 01',
    observacao: 'Condição controlada após roçada preventiva em faixa lateral.',
    risco: 'Baixo',
    acaoRecomendada: 'Manter monitoramento no próximo ciclo.',
    fotoUri: 'demo://foto/br101-0010'
  }
];
