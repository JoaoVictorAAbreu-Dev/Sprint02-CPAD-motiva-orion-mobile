export type RootStackParamList = {
  MainTabs: undefined;
  DetalheTrecho: { trechoId: string };
  Inspecao: { trechoId?: string } | undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Trechos: undefined;
};
