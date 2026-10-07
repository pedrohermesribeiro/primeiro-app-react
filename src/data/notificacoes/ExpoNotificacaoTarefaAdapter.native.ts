import * as Device from 'expo-device';
import { Platform } from 'react-native';

import { expoNotificacoesDisponivel } from '@/data/notificacoes/expoNotificacoesDisponivel';
import { criarHandlerApresentacaoForeground } from '@/data/notificacoes/notificacaoForegroundApresentacao';
import type {
  AgendarNotificacaoTarefaInput,
  NotificacaoTarefaPort,
} from '@/domain/ports/NotificacaoTarefaPort';

const CANAL_PADRAO = 'tarefas';
const CANAL_ALTA = 'tarefas-alta-prioridade';

type ExpoNotificationsModule = typeof import('expo-notifications');

let notificationsModule: ExpoNotificationsModule | null = null;
let handlerConfigurado = false;
let canaisConfigurados = false;

async function carregarNotifications(): Promise<ExpoNotificationsModule | null> {
  if (!expoNotificacoesDisponivel()) {
    return null;
  }
  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
  }
  await configurarHandlerForeground(notificationsModule);
  return notificationsModule;
}

async function configurarHandlerForeground(Notifications: ExpoNotificationsModule): Promise<void> {
  if (handlerConfigurado) {
    return;
  }
  Notifications.setNotificationHandler(criarHandlerApresentacaoForeground());
  handlerConfigurado = true;
}

async function garantirCanaisAndroid(Notifications: ExpoNotificationsModule): Promise<void> {
  if (canaisConfigurados || Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(CANAL_PADRAO, {
    name: 'Tarefas',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  await Notifications.setNotificationChannelAsync(CANAL_ALTA, {
    name: 'Alta prioridade',
    importance: Notifications.AndroidImportance.HIGH,
  });
  canaisConfigurados = true;
}

function canalParaPrioridade(prioridade: AgendarNotificacaoTarefaInput['prioridade']): string | undefined {
  if (Platform.OS !== 'android') {
    return undefined;
  }
  return prioridade === 'alta' ? CANAL_ALTA : CANAL_PADRAO;
}

export class ExpoNotificacaoTarefaAdapter implements NotificacaoTarefaPort {
  async prepararApresentacaoForeground(): Promise<void> {
    if (!expoNotificacoesDisponivel()) {
      return;
    }
    await carregarNotifications();
  }

  async permissoesConcedidas(): Promise<boolean> {
    if (!expoNotificacoesDisponivel() || !Device.isDevice) {
      return false;
    }
    const Notifications = await carregarNotifications();
    if (!Notifications) {
      return false;
    }
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  async solicitarPermissao(): Promise<boolean> {
    if (!expoNotificacoesDisponivel() || !Device.isDevice) {
      return false;
    }
    const Notifications = await carregarNotifications();
    if (!Notifications) {
      return false;
    }
    await garantirCanaisAndroid(Notifications);
    const atual = await Notifications.getPermissionsAsync();
    if (atual.status === 'granted') {
      return true;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async listarIdsComPrefixo(prefixo: string): Promise<string[]> {
    if (!expoNotificacoesDisponivel()) {
      return [];
    }
    const Notifications = await carregarNotifications();
    if (!Notifications) {
      return [];
    }
    const agendadas = await Notifications.getAllScheduledNotificationsAsync();
    return agendadas
      .map((item) => item.identifier)
      .filter((id): id is string => typeof id === 'string' && id.startsWith(prefixo));
  }

  async cancelarPorIdentificador(id: string): Promise<void> {
    if (!expoNotificacoesDisponivel()) {
      return;
    }
    const Notifications = await carregarNotifications();
    if (!Notifications) {
      return;
    }
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  async agendar(input: AgendarNotificacaoTarefaInput): Promise<void> {
    if (!expoNotificacoesDisponivel() || !Device.isDevice) {
      return;
    }
    const Notifications = await carregarNotifications();
    if (!Notifications) {
      return;
    }
    await garantirCanaisAndroid(Notifications);
    const channelId = canalParaPrioridade(input.prioridade);
    await Notifications.scheduleNotificationAsync({
      identifier: input.id,
      content: {
        title: input.title,
        body: input.body,
        data: input.data,
        sound: true,
        ...(channelId ? { channelId } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: input.triggerDate,
      },
    });
  }
}
