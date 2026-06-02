import { Trecho } from '../types/domain';

export const trechosMock: Trecho[] = [
  {
    id: 'br-101-001',
    nome: 'Trecho Norte 01',
    rodovia: 'BR-101',
    kmInicial: 12.4,
    kmFinal: 27.8,
    status: 'Livre',
    vegetacaoPredominante: 'Capim alto',
    ultimaInspecao: '2026-05-29'
  },
  {
    id: 'br-101-002',
    nome: 'Trecho Norte 02',
    rodovia: 'BR-101',
    kmInicial: 28.1,
    kmFinal: 41.3,
    status: 'Pendência',
    vegetacaoPredominante: 'Mato arbustivo',
    ultimaInspecao: '2026-05-31'
  },
  {
    id: 'sp-280-003',
    nome: 'Trecho Oeste 03',
    rodovia: 'SP-280',
    kmInicial: 4.0,
    kmFinal: 16.5,
    status: 'Em inspeção',
    vegetacaoPredominante: 'Gramíneas',
    ultimaInspecao: '2026-06-01'
  }
];
