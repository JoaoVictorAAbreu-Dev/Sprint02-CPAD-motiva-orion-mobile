import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ocorrenciasMock } from '../data/ocorrenciasMock';
import { inspecoesMock } from '../data/inspecoesMock';
import { trechosMock } from '../data/trechosMock';
import { readStorage, storageKeys, storageVersion, writeStorage } from '../services/storage';
import {
  AppSettings,
  AppState,
  Inspecao,
  NotificationItem,
  Ocorrencia,
  Trecho
} from '../types/domain';

type AppContextValue = {
  trechos: Trecho[];
  ocorrencias: Ocorrencia[];
  inspecoes: Inspecao[];
  notifications: NotificationItem[];
  settings: AppSettings;
  loading: boolean;
  reloadAppState: () => Promise<void>;
  registrarInspecao: (input: Omit<Inspecao, 'id' | 'data'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  updateSettings: (input: Partial<AppSettings>) => Promise<void>;
  getTrechoById: (id: string) => Trecho | undefined;
  getOcorrenciasByTrechoId: (trechoId: string) => Ocorrencia[];
  getInspecoesByTrechoId: (trechoId: string) => Inspecao[];
  getUnreadNotificationCount: () => number;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const initialState: AppState = {
  version: storageVersion,
  trechos: trechosMock,
  ocorrencias: ocorrenciasMock,
  inspecoes: inspecoesMock,
  notifications: [],
  settings: {
    operationalAlertsEnabled: true,
    confirmInspectionDiscard: true,
    showUnreadBadge: true
  }
};

function mergeState(stored: AppState | null): AppState {
  return {
    version: storageVersion,
    trechos: stored?.trechos?.length ? stored.trechos : trechosMock,
    ocorrencias: stored?.ocorrencias?.length ? stored.ocorrencias : ocorrenciasMock,
    inspecoes: stored?.inspecoes?.length ? stored.inspecoes : inspecoesMock,
    notifications: stored?.notifications !== undefined ? stored.notifications : createInitialNotifications(),
    settings: stored?.settings ?? initialState.settings
  };
}

function createInitialNotifications(): NotificationItem[] {
  const now = new Date().toISOString();
  const criticalTrechos = trechosMock.filter((trecho) => trecho.status !== 'Normal').slice(0, 4);

  return criticalTrechos.map((trecho, index) => ({
    id: `seed-${trecho.id}-${index}`,
    title: trecho.status === 'Crítico' ? 'Trecho crítico priorizado' : 'Trecho em atenção',
    message: `${trecho.rodovia} km ${trecho.km.toFixed(1)} requer acompanhamento operacional.`,
    type: trecho.status === 'Crítico' ? 'critical' : 'warning',
    createdAt: now,
    read: false,
    targetTrechoId: trecho.id
  }));
}

function createInspectionNotification(trecho: Trecho, inspecao: Inspecao): NotificationItem | null {
  if (inspecao.risco === 'Baixo') {
    return {
      id: `notif-${inspecao.id}`,
      title: 'Inspeção registrada',
      message: `${trecho.nome} foi inspecionado por ${inspecao.responsavel}.`,
      type: 'info',
      createdAt: inspecao.data,
      read: false,
      targetTrechoId: trecho.id,
      targetInspecaoId: inspecao.id
    };
  }

  return {
    id: `notif-${inspecao.id}`,
    title: inspecao.risco === 'Alto' ? 'Alerta crítico de vegetação' : 'Trecho em atenção',
    message: `${trecho.rodovia} km ${trecho.km.toFixed(1)} demanda resposta operacional.`,
    type: inspecao.risco === 'Alto' ? 'critical' : 'warning',
    createdAt: inspecao.data,
    read: false,
    targetTrechoId: trecho.id,
    targetInspecaoId: inspecao.id
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
  const [notifications, setNotifications] = useState<NotificationItem[]>(createInitialNotifications());
  const [settings, setSettings] = useState<AppSettings>(initialState.settings);
  const [loading, setLoading] = useState(true);
  const snapshotRef = useRef<AppState>(initialState);

  const applyState = useCallback((nextState: AppState) => {
    snapshotRef.current = nextState;
    setTrechos(nextState.trechos);
    setOcorrencias(nextState.ocorrencias);
    setInspecoes(nextState.inspecoes);
    setNotifications(nextState.notifications);
    setSettings(nextState.settings);
  }, []);

  const reloadAppState = useCallback(async () => {
    const stored = await readStorage<AppState>(storageKeys.appState);
    applyState(mergeState(stored));
  }, [applyState]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await readStorage<AppState>(storageKeys.appState);
        if (mounted) {
          applyState(mergeState(stored));
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
  }, [applyState]);

  const persistState = async (nextState: AppState) => {
    applyState(nextState);
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
    const trechoAtualizado = updatedTrechos.find((trecho) => trecho.id === input.trechoId);
    const generatedNotification =
      snapshotRef.current.settings.operationalAlertsEnabled && trechoAtualizado
        ? createInspectionNotification(trechoAtualizado, novaInspecao)
        : null;
    const updatedNotifications = generatedNotification
      ? [generatedNotification, ...snapshotRef.current.notifications]
      : snapshotRef.current.notifications;

    await persistState({
      version: storageVersion,
      trechos: updatedTrechos,
      ocorrencias: snapshotRef.current.ocorrencias,
      inspecoes: updatedInspecoes,
      notifications: updatedNotifications,
      settings: snapshotRef.current.settings
    });
  };

  const markNotificationAsRead = async (id: string) => {
    const updatedNotifications = snapshotRef.current.notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    await persistState({
      ...snapshotRef.current,
      notifications: updatedNotifications
    });
  };

  const markAllNotificationsAsRead = async () => {
    const updatedNotifications = snapshotRef.current.notifications.map((notification) => ({
      ...notification,
      read: true
    }));

    await persistState({
      ...snapshotRef.current,
      notifications: updatedNotifications
    });
  };

  const updateSettings = async (input: Partial<AppSettings>) => {
    const nextSettings = {
      ...snapshotRef.current.settings,
      ...input
    };

    await persistState({
      ...snapshotRef.current,
      settings: nextSettings
    });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      trechos,
      ocorrencias,
      inspecoes,
      notifications,
      settings,
      loading,
      reloadAppState,
      registrarInspecao,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateSettings,
      getTrechoById: (id) => trechos.find((trecho) => trecho.id === id),
      getOcorrenciasByTrechoId: (trechoId) => ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === trechoId),
      getInspecoesByTrechoId: (trechoId) => inspecoes.filter((inspecao) => inspecao.trechoId === trechoId),
      getUnreadNotificationCount: () => notifications.filter((notification) => !notification.read).length
    }),
    [inspecoes, loading, notifications, ocorrencias, reloadAppState, settings, trechos]
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
