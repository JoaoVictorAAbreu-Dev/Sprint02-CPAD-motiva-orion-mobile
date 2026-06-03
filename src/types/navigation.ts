export type RootStackParamList = {
  MainTabs: undefined;
  DetalheTrecho: { trechoId: string };
  Inspecao: { trechoId?: string } | undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Trechos: undefined;
};
