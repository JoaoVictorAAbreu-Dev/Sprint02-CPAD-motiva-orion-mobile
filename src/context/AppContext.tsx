import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ocorrenciasMock } from '../data/ocorrenciasMock';
import { trechosMock } from '../data/trechosMock';
import { AppState, Inspecao, Ocorrencia, Trecho } from '../types/domain';
import { readStorage, storageKeys, writeStorage } from '../services/storage';

type AppContextValue = {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  inspecoes: Inspecao[];
  loading: boolean;
  registrarInspecao: (input: Omit<Inspecao, 'id' | 'data'>) => Promise<void>;
  getTrechoById: (id: string) => Trecho | undefined;
  getOcorrenciasByTrechoId: (trechoId: string) => Ocorrencia[];
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos] = useState<Trecho[]>(trechosMock);
  const [ocorrencias] = useState<Ocorrencia[]>(ocorrenciasMock);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [loading, setLoading] = useState(true);
  const inspecoesRef = useRef<Inspecao[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await readStorage<AppState>(storageKeys.appState);
        if (mounted && stored) {
          inspecoesRef.current = stored.inspecoes;
          setInspecoes(stored.inspecoes);
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

  const registrarInspecao = async (input: Omit<Inspecao, 'id' | 'data'>) => {
    const novaInspecao: Inspecao = {
      ...input,
      id: `${input.trechoId}-${Date.now()}`,
      data: new Date().toISOString()
    };

    const nextInspecoes = [novaInspecao, ...inspecoesRef.current];
    inspecoesRef.current = nextInspecoes;
    setInspecoes(nextInspecoes);
    await writeStorage(storageKeys.appState, { inspecoes: nextInspecoes });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      trechos,
      ocorrencias,
      inspecoes,
      loading,
      registrarInspecao,
      getTrechoById: (id) => trechos.find((trecho) => trecho.id === id),
      getOcorrenciasByTrechoId: (trechoId) => ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === trechoId)
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
