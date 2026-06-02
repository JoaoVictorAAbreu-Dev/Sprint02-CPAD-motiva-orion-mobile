import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = '@motiva-orion-mobile';

export const storageKeys = {
  appState: `${prefix}:app-state`
};

export async function readStorage<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function writeStorage<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
