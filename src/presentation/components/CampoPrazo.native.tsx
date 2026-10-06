import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  lembretesPadrao,
  lembretesPermitidosParaPrazo,
  type TipoLembretePrazo,
} from '@/domain/lembrete/LembretesTarefa';
import { SeletorLembretes } from '@/presentation/components/SeletorLembretes';
import { useFonteGrandeFormulario } from '@/presentation/hooks/useFonteGrandeFormulario';
import {
  aplicarDataAoValor,
  aplicarHoraAoValor,
  dateToIsoLocal,
  formatarDataExibicao,
  formatarHoraExibicao,
  isoToDateLocal,
  obterDataIsoDoValor,
} from '@/presentation/utils/prazoIso';

type Props = {
  value: string;
  onChange: (iso: string) => void;
  lembretes?: TipoLembretePrazo[];
  onLembretesChange?: (lembretes: TipoLembretePrazo[]) => void;
  exibirLembretes?: boolean;
};

function dateParaPickerHora(value: string): Date {
  const dataIso = obterDataIsoDoValor(value);
  if (!dataIso) {
    return new Date();
  }
  const hora = formatarHoraExibicao(value);
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  const match = /^(\d{2}):(\d{2})$/.exec(hora);
  const horas = match ? Number(match[1]) : 8;
  const minutos = match ? Number(match[2]) : 0;
  return new Date(ano, mes - 1, dia, horas, minutos, 0, 0);
}

export function CampoPrazo({
  value,
  onChange,
  lembretes = lembretesPadrao(),
  onLembretesChange,
  exibirLembretes = true,
}: Props) {
  const theme = useTheme();
  const fonteGrande = useFonteGrandeFormulario();
  const [pickerDataAberto, setPickerDataAberto] = useState(false);
  const [pickerHoraAberto, setPickerHoraAberto] = useState(false);

  const boxStyle = useMemo(
    () => [styles.box, { borderColor: theme.backgroundSelected }],
    [theme.backgroundSelected],
  );

  const dataIso = obterDataIsoDoValor(value);
  const lembretesHabilitados = lembretesPermitidosParaPrazo(value);
  const dataPicker = useMemo(() => isoToDateLocal(value) ?? new Date(), [value]);
  const horaPicker = useMemo(() => dateParaPickerHora(value), [value]);

  const alterarPrazo = useCallback(
    (iso: string) => {
      onChange(iso);
      if (!iso.trim()) {
        onLembretesChange?.([]);
      }
    },
    [onChange, onLembretesChange],
  );

  const handleDataChange = useCallback(
    (event: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS === 'android') {
        setPickerDataAberto(false);
      }
      if (event.type === 'dismissed') {
        setPickerDataAberto(false);
        return;
      }
      if (selected) {
        const novaData = dateToIsoLocal(selected);
        alterarPrazo(aplicarDataAoValor(value, novaData));
        if (Platform.OS === 'ios') {
          setPickerDataAberto(false);
        }
      }
    },
    [alterarPrazo, value],
  );

  const handleHoraChange = useCallback(
    (event: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS === 'android') {
        setPickerHoraAberto(false);
      }
      if (event.type === 'dismissed') {
        setPickerHoraAberto(false);
        return;
      }
      if (selected) {
        const hora = `${String(selected.getHours()).padStart(2, '0')}:${String(selected.getMinutes()).padStart(2, '0')}`;
        alterarPrazo(aplicarHoraAoValor(value, hora));
        if (Platform.OS === 'ios') {
          setPickerHoraAberto(false);
        }
      }
    },
    [alterarPrazo, value],
  );

  const conteudo = (
    <View style={styles.wrapper}>
      <View style={[styles.row, fonteGrande && styles.rowWrap]}>
        <Pressable
          onPress={() => setPickerDataAberto(true)}
          accessibilityLabel="Escolher data do prazo"
          style={({ pressed }) => [boxStyle, styles.boxData, pressed && styles.pressed]}>
          <ThemedText type="small">📅</ThemedText>
          <ThemedText
            type="small"
            themeColor={dataIso ? 'text' : 'textSecondary'}
            numberOfLines={fonteGrande ? undefined : 1}
            style={fonteGrande ? styles.textoData : undefined}>
            {dataIso ? formatarDataExibicao(value) : 'Data'}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => dataIso && setPickerHoraAberto(true)}
          disabled={!dataIso}
          accessibilityLabel="Ajustar horário"
          accessibilityHint="Abre o seletor de hora do prazo"
          style={({ pressed }) => [
            boxStyle,
            styles.boxHora,
            !dataIso && styles.disabled,
            pressed && styles.pressed,
          ]}>
          <ThemedText type="small">🕐</ThemedText>
          <ThemedText type="small" themeColor={dataIso ? 'text' : 'textSecondary'}>
            {dataIso ? formatarHoraExibicao(value) : '--:--'}
          </ThemedText>
        </Pressable>
        {exibirLembretes && onLembretesChange ? (
          <SeletorLembretes
            lembretes={lembretes}
            onChange={onLembretesChange}
            disabled={!lembretesHabilitados}
          />
        ) : null}
      </View>

      {value ? (
        <Pressable onPress={() => alterarPrazo('')} hitSlop={8}>
          <ThemedText type="small" themeColor="textSecondary">
            Limpar prazo
          </ThemedText>
        </Pressable>
      ) : null}

      {pickerDataAberto ? (
        <DateTimePicker
          value={dataPicker}
          mode="date"
          display="default"
          onChange={handleDataChange}
        />
      ) : null}

      {pickerHoraAberto ? (
        <DateTimePicker
          value={horaPicker}
          mode="time"
          display="default"
          is24Hour
          onChange={handleHoraChange}
        />
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
    alignItems: 'stretch',
    gap: Spacing.two,
    width: '100%',
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  textoData: {
    flexShrink: 1,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  boxData: {
    flex: 2,
    minWidth: 0,
  },
  boxHora: {
    flexShrink: 0,
    minWidth: 80,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
