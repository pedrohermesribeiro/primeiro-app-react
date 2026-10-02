import { Alert } from 'react-native';

export function confirmarExclusaoTarefa(onConfirm: () => void): void {
  Alert.alert('Excluir tarefa?', 'Esta ação não pode ser desfeita.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onConfirm },
  ]);
}
