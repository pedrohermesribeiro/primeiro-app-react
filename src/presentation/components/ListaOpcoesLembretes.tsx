import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  ORDEM_LEMBRETES,
  alternarLembrete,
  rotuloLembrete,
  type TipoLembretePrazo,
} from '@/domain/lembrete/LembretesTarefa';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  lembretes: TipoLembretePrazo[];
  onChange: (lembretes: TipoLembretePrazo[]) => void;
};

export function ListaOpcoesLembretes({ lembretes, onChange }: Props) {
  const theme = useTheme();
  const naoAtivo = lembretes.length === 0;

  return (
    <View style={styles.chips}>
      <Pressable
        onPress={() => onChange(alternarLembrete(lembretes, 'nao'))}
        style={styles.chipPress}>
        <ThemedView
          type={naoAtivo ? 'backgroundSelected' : 'backgroundElement'}
          style={[styles.chip, naoAtivo && { borderColor: theme.text, borderWidth: 1 }]}>
          <ThemedText type="small" themeColor={naoAtivo ? 'text' : 'textSecondary'}>
            Não
          </ThemedText>
        </ThemedView>
      </Pressable>
      {ORDEM_LEMBRETES.map((tipo) => {
        const ativo = lembretes.includes(tipo);
        return (
          <Pressable
            key={tipo}
            onPress={() => onChange(alternarLembrete(lembretes, tipo))}
            style={styles.chipPress}>
            <ThemedView
              type={ativo ? 'backgroundSelected' : 'backgroundElement'}
              style={[styles.chip, ativo && { borderColor: theme.text, borderWidth: 1 }]}>
              <ThemedText type="small" themeColor={ativo ? 'text' : 'textSecondary'}>
                {rotuloLembrete(tipo)}
              </ThemedText>
            </ThemedView>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    width: '100%',
  },
  chipPress: {
    flexGrow: 1,
    minWidth: '45%',
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.one,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
});
