export type TrechoStatus = 'Normal' | 'Atenção' | 'Crítico';

export type Prioridade = 'Baixa' | 'Média' | 'Alta';

export type OcorrenciaStatus = 'Aberta' | 'Em atendimento' | 'Resolvida';

export type OcorrenciaTipo =
  | 'Crescimento excessivo'
  | 'Roçada pendente'
  | 'Árvore inclinada'
  | 'Obstrução de visibilidade'
  | 'Drenagem comprometida'
  | 'Queda de galhos';

export type Trecho = {
  id: string;
  km: number;
  rodovia: string;
  status: TrechoStatus;
  nivelVegetacao: string;
  ultimaIntervencao: string;
  prioridade: Prioridade;
  nome: string;
  kmInicial: number;
  kmFinal: number;
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
  fotoUri?: string;
  latitude?: number;
  longitude?: number;
};

export type Ocorrencia = {
  id: string;
  trechoId: string;
  tipo: OcorrenciaTipo;
  descricao: string;
  data: string;
  status: OcorrenciaStatus;
};

export type AppState = {
  version: number;
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  inspecoes: Inspecao[];
  notifications: NotificationItem[];
  settings: AppSettings;
};

export type NotificationType = 'info' | 'warning' | 'critical';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  targetTrechoId?: string;
  targetInspecaoId?: string;
};

export type AppSettings = {
  operationalAlertsEnabled: boolean;
  confirmInspectionDiscard: boolean;
  showUnreadBadge: boolean;
};
