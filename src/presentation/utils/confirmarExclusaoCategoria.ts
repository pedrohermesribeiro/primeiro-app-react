import { Alert } from 'react-native';

export function confirmarExclusaoCategoria(nomeCategoria: string, onConfirm: () => void): void {
  Alert.alert(
    'Excluir categoria?',
    `A categoria "${nomeCategoria}" será removida. Tarefas vinculadas passarão para Outros (ou outra categoria, se Outros for excluída).`,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onConfirm },
    ],
  );
}
