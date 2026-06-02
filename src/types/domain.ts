export type TrechoStatus = 'Livre' | 'Em inspeção' | 'Pendência';

export type Trecho = {
  id: string;
  nome: string;
  rodovia: string;
  kmInicial: number;
  kmFinal: number;
  status: TrechoStatus;
  vegetacaoPredominante: string;
  ultimaInspecao: string;
};

export type Inspecao = {
  id: string;
  trechoId: string;
  data: string;
  responsavel: string;
  observacao: string;
  risco: 'Baixo' | 'Médio' | 'Alto';
  acaoRecomendada: string;
};

export type AppState = {
  inspecoes: Inspecao[];
};
