import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ocorrenciasMock } from '../data/ocorrenciasMock';
import { inspecoesMock } from '../data/inspecoesMock';
import { trechosMock } from '../data/trechosMock';
import { readStorage, storageKeys, storageVersion, writeStorage } from '../services/storage';
import { AppState, Inspecao, Ocorrencia, Trecho } from '../types/domain';

type AppContextValue = {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  inspecoes: Inspecao[];
  loading: boolean;
  registrarInspecao: (input: Omit<Inspecao, 'id' | 'data'>) => Promise<void>;
  getTrechoById: (id: string) => Trecho | undefined;
  getOcorrenciasByTrechoId: (trechoId: string) => Ocorrencia[];
  getInspecoesByTrechoId: (trechoId: string) => Inspecao[];
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialState: AppState = {
  version: storageVersion,
  trechos: trechosMock,
  ocorrencias: ocorrenciasMock,
  inspecoes: inspecoesMock
};

function mergeState(stored: AppState | null): AppState {
  if (!stored || stored.version !== storageVersion) {
    return initialState;
  }

  return {
    version: storageVersion,
    trechos: stored.trechos?.length ? stored.trechos : trechosMock,
    ocorrencias: stored.ocorrencias?.length ? stored.ocorrencias : ocorrenciasMock,
    inspecoes: stored.inspecoes?.length ? stored.inspecoes : inspecoesMock
  };
}

function deriveTrechoAfterInspection(trecho: Trecho, inspecao: Inspecao): Trecho {
  const statusByRisk: Record<Inspecao['risco'], Trecho['status']> = {
    Baixo: 'Normal',
    Médio: 'Atenção',
    Alto: 'Crítico'
  };

  const nivelByRisk: Record<Inspecao['risco'], Trecho['nivelVegetacao']> = {
    Baixo: 'Baixo',
    Médio: 'Médio',
    Alto: 'Alto'
  };

  return {
    ...trecho,
    status: statusByRisk[inspecao.risco],
    nivelVegetacao: nivelByRisk[inspecao.risco],
    prioridade: inspecao.risco === 'Alto' ? 'Alta' : inspecao.risco === 'Médio' ? 'Média' : 'Baixa',
    ultimaInspecao: inspecao.data,
    ultimaIntervencao: inspecao.data.slice(0, 10)
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos, setTrechos] = useState<Trecho[]>(trechosMock);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(ocorrenciasMock);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>(inspecoesMock);
  const [loading, setLoading] = useState(true);
  const snapshotRef = useRef<AppState>(initialState);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await readStorage<AppState>(storageKeys.appState);
        const nextState = mergeState(stored);
        if (mounted) {
          snapshotRef.current = nextState;
          setTrechos(nextState.trechos);
          setOcorrencias(nextState.ocorrencias);
          setInspecoes(nextState.inspecoes);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const persistState = async (nextState: AppState) => {
    snapshotRef.current = nextState;
    setTrechos(nextState.trechos);
    setOcorrencias(nextState.ocorrencias);
    setInspecoes(nextState.inspecoes);
    await writeStorage(storageKeys.appState, nextState);
  };

  const registrarInspecao = async (input: Omit<Inspecao, 'id' | 'data'>) => {
    const novaInspecao: Inspecao = {
      ...input,
      id: `${input.trechoId}-${Date.now()}`,
      data: new Date().toISOString()
    };

    const updatedInspecoes = [novaInspecao, ...snapshotRef.current.inspecoes];
    const updatedTrechos = snapshotRef.current.trechos.map((trecho) =>
      trecho.id === input.trechoId ? deriveTrechoAfterInspection(trecho, novaInspecao) : trecho
    );

    await persistState({
      version: storageVersion,
      trechos: updatedTrechos,
      ocorrencias: snapshotRef.current.ocorrencias,
      inspecoes: updatedInspecoes
    });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      trechos,
      ocorrencias,
      inspecoes,
      loading,
      registrarInspecao,
      getTrechoById: (id) => trechos.find((trecho) => trecho.id === id),
      getOcorrenciasByTrechoId: (trechoId) => ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === trechoId),
      getInspecoesByTrechoId: (trechoId) => inspecoes.filter((inspecao) => inspecao.trechoId === trechoId)
    }),
    [inspecoes, loading, ocorrencias, trechos]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
