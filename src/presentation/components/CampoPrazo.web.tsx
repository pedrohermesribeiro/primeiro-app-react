import { createElement, type CSSProperties } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FormTypography, Spacing } from '@/constants/theme';
import {
  lembretesPadrao,
  lembretesPermitidosParaPrazo,
  type TipoLembretePrazo,
} from '@/domain/lembrete/LembretesTarefa';
import { useTheme } from '@/hooks/use-theme';
import { SeletorHoraMinuto } from '@/presentation/components/SeletorHoraMinuto.web';
import { SeletorLembretes } from '@/presentation/components/SeletorLembretes';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';
import {
  aplicarDataAoValor,
  aplicarHoraAoValor,
  obterDataIsoDoValor,
  formatarHoraExibicao,
} from '@/presentation/utils/prazoIso';

type Props = {
  value: string;
  onChange: (iso: string) => void;
  lembretes?: TipoLembretePrazo[];
  onLembretesChange?: (lembretes: TipoLembretePrazo[]) => void;
  exibirLembretes?: boolean;
};

export function CampoPrazo({
  value,
  onChange,
  lembretes = lembretesPadrao(),
  onLembretesChange,
  exibirLembretes = true,
}: Props) {
  const theme = useTheme();
  const fonteGrande = useFonteGrandeFormulario();
  const dataIso = obterDataIsoDoValor(value);
  const horaValor = formatarHoraExibicao(value);
  const lembretesHabilitados = lembretesPermitidosParaPrazo(value);

  const alterarPrazo = (iso: string) => {
    onChange(iso);
    if (!iso.trim()) {
      onLembretesChange?.([]);
    }
  };

  const inputStyle: CSSProperties = {
    flex: 2,
    minWidth: 0,
    boxSizing: 'border-box',
    fontSize: FormTypography.input.fontSize,
    padding: Spacing.two,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.backgroundSelected,
    borderRadius: Spacing.one,
    color: theme.text,
    backgroundColor: theme.background,
    fontFamily: 'inherit',
  };

  const linha = (
    <View style={[styles.row, fonteGrande && styles.rowWrap]}>
      {createElement('input', {
        type: 'date',
        value: dataIso || '',
        'aria-label': 'Data do prazo',
        onChange: (event: Event) => {
          const target = event.target as HTMLInputElement;
          alterarPrazo(aplicarDataAoValor(value, target.value));
        },
        style: inputStyle,
      })}
      <View style={styles.boxHora}>
        <SeletorHoraMinuto
          hora={horaValor}
          disabled={!dataIso}
          onChange={(hora) => alterarPrazo(aplicarHoraAoValor(value, hora))}
        />
      </View>
      {exibirLembretes && onLembretesChange ? (
        <SeletorLembretes
          lembretes={lembretes}
          onChange={onLembretesChange}
          disabled={!lembretesHabilitados}
        />
      ) : null}
    </View>
  );

  const conteudo = (
    <View style={styles.wrapper}>
      {linha}
      {value ? (
        <Pressable onPress={() => alterarPrazo('')} hitSlop={8}>
          <ThemedText type="small" themeColor="textSecondary">
            Limpar prazo
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );

  if (fonteGrande) {
    return (
      <View style={styles.containerAcessivel}>
        <ThemedText type="smallBold">Prazo</ThemedText>
        {conteudo}
      </View>
    );
  }

  return conteudo;
}

const styles = StyleSheet.create({
  containerAcessivel: {
    gap: Spacing.two,
    width: '100%',
  },
  wrapper: {
    gap: Spacing.one,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
    alignItems: 'stretch',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  boxHora: {
    flexShrink: 0,
    minWidth: 80,
  },
});
