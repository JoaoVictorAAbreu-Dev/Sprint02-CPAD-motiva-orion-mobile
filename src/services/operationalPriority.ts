import { Inspecao, Ocorrencia, Trecho } from '../types/domain';

export type OperationalRecommendation = {
  trecho: Trecho;
  score: number;
  headline: string;
  reason: string;
  nextAction: string;
};

const statusWeight: Record<Trecho['status'], number> = {
  Normal: 10,
  Atenção: 40,
  Crítico: 75
};

const priorityWeight: Record<Trecho['prioridade'], number> = {
  Baixa: 0,
  Média: 12,
  Alta: 24
};

function daysSince(dateValue: string): number {
  const diff = Date.now() - new Date(dateValue).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getLastInspection(trecho: Trecho, inspecoes: Inspecao[]): Inspecao | undefined {
  return inspecoes.find((inspecao) => inspecao.trechoId === trecho.id);
}

export function getOperationalRecommendations(
  trechos: Trecho[],
  ocorrencias: Ocorrencia[],
  inspecoes: Inspecao[]
): OperationalRecommendation[] {
  return trechos
    .map((trecho) => {
      const trechoOcorrencias = ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === trecho.id);
      const abertas = trechoOcorrencias.filter((ocorrencia) => ocorrencia.status !== 'Resolvida').length;
      const lastInspection = getLastInspection(trecho, inspecoes);
      const daysWithoutInspection = lastInspection ? daysSince(lastInspection.data) : 60;

      const score =
        statusWeight[trecho.status] +
        priorityWeight[trecho.prioridade] +
        Math.min(daysWithoutInspection, 45) * 1.2 +
        abertas * 14 +
        Math.max(0, trecho.nivelVegetacao === 'Alto' ? 16 : trecho.nivelVegetacao === 'Médio' ? 8 : 0);

      const headline =
        trecho.status === 'Crítico'
          ? 'Intervenção imediata'
          : trecho.status === 'Atenção'
            ? 'Programar inspeção prioritária'
            : 'Monitoramento preventivo';

      const reasonParts = [
        trecho.status !== 'Normal' ? `status ${trecho.status.toLowerCase()}` : null,
        openOccurrencesText(abertas),
        daysWithoutInspection > 15 ? `${daysWithoutInspection} dias sem intervenção` : null
      ].filter(Boolean);

      return {
        trecho,
        score: Math.round(score),
        headline,
        reason: reasonParts.length ? reasonParts.join(' • ') : 'Trecho dentro da condição esperada',
        nextAction:
          trecho.status === 'Crítico'
            ? 'Enviar equipe e registrar evidência imediatamente'
            : trecho.status === 'Atenção'
              ? 'Programar roçada e nova inspeção'
              : 'Manter rotina de acompanhamento'
      };
    })
    .sort((a, b) => b.score - a.score);
}

function openOccurrencesText(openCount: number): string | null {
  if (openCount <= 0) return null;
  return openCount === 1 ? '1 ocorrência em aberto' : `${openCount} ocorrências em aberto`;
}
