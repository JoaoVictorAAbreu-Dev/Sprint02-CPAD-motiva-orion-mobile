import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { trechosMock } from '../data/trechos';
import { AppState, Inspecao, Trecho } from '../types/domain';
import { readStorage, storageKeys, writeStorage } from '../services/storage';

type AppContextValue = {
  trechos: Trecho[];
  inspecoes: Inspecao[];
  loading: boolean;
  registrarInspecao: (input: Omit<Inspecao, 'id' | 'data'>) => Promise<void>;
  getTrechoById: (id: string) => Trecho | undefined;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trechos] = useState<Trecho[]>(trechosMock);
  const [inspecoes, setInspecoes] = useState<Inspecao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await readStorage<AppState>(storageKeys.appState);
        if (mounted && stored) {
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

  useEffect(() => {
    if (!loading) {
      void writeStorage(storageKeys.appState, { inspecoes });
    }
  }, [inspecoes, loading]);

  const registrarInspecao = async (input: Omit<Inspecao, 'id' | 'data'>) => {
    const novaInspecao: Inspecao = {
      ...input,
      id: `${input.trechoId}-${Date.now()}`,
      data: new Date().toISOString()
    };

    setInspecoes((current) => [novaInspecao, ...current]);
  };

  const value = useMemo<AppContextValue>(
    () => ({
      trechos,
      inspecoes,
      loading,
      registrarInspecao,
      getTrechoById: (id) => trechos.find((trecho) => trecho.id === id)
    }),
    [inspecoes, loading, trechos]
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
