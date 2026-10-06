import Constants, { ExecutionEnvironment } from 'expo-constants';

/** Expo Go (storeClient) não carrega `expo-notifications` — use development build. */
export function expoNotificacoesDisponivel(): boolean {
  return Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
}
