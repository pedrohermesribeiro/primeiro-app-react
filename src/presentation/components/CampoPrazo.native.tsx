import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  dateToIsoLocal,
  formatarPrazoExibicao,
  isoToDateLocal,
} from '@/presentation/utils/prazoIso';

type Props = {
  value: string;
  onChange: (iso: string) => void;
};

export function CampoPrazo({ value, onChange }: Props) {
  const theme = useTheme();
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const inputStyle = useMemo(
    () => [styles.input, { color: theme.text, borderColor: theme.backgroundSelected }],
    [theme.backgroundSelected, theme.text],
  );

  const dataPicker = useMemo(() => isoToDateLocal(value) ?? new Date(), [value]);

  const handlePickerChange = useCallback(
    (event: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS === 'android') {
        setMostrarPicker(false);
      }
      if (event.type === 'dismissed') {
        setMostrarPicker(false);
        return;
      }
      if (selected) {
        onChange(dateToIsoLocal(selected));
        if (Platform.OS === 'ios') {
          setMostrarPicker(false);
        }
      }
    },
    [onChange],
  );

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => setMostrarPicker(true)}
        style={({ pressed }) => [
          inputStyle,
          styles.pressableInput,
          pressed && styles.pressed,
        ]}>
        <ThemedText type="default" themeColor={value ? 'text' : 'textSecondary'}>
          {value ? formatarPrazoExibicao(value) : 'Prazo opcional'}
        </ThemedText>
      </Pressable>
      {value ? (
        <Pressable onPress={() => onChange('')} hitSlop={8}>
          <ThemedText type="small" themeColor="textSecondary">
            Limpar prazo
          </ThemedText>
        </Pressable>
      ) : null}
      {mostrarPicker ? (
        <DateTimePicker
          value={dataPicker}
          mode="date"
          display="default"
          onChange={handlePickerChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
    width: '100%',
  },
  input: {
    width: '100%',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  pressableInput: {
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
