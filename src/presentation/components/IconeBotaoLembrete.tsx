import { SymbolView } from 'expo-symbols';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ICONE_ATIVO = {
  ios: 'bell.fill',
  android: 'notifications_active',
  web: 'notifications_active',
} as const;

const ICONE_INATIVO = {
  ios: 'bell.slash',
  android: 'notifications_off',
  web: 'notifications_off',
} as const;

type Props = {
  ativo: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function IconeBotaoLembrete({ ativo, disabled, onPress }: Props) {
  const theme = useTheme();
  const rotacao = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (ativo && !disabled) {
      rotacao.setValue(0);
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(rotacao, {
            toValue: 1,
            duration: 120,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotacao, {
            toValue: -1,
            duration: 240,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotacao, {
            toValue: 0,
            duration: 120,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(900),
        ]),
      );
      loopRef.current.start();
      return () => {
        loopRef.current?.stop();
        loopRef.current = null;
        rotacao.setValue(0);
      };
    }
    loopRef.current?.stop();
    loopRef.current = null;
    rotacao.setValue(0);
    return undefined;
  }, [ativo, disabled, rotacao]);

  const rotate = rotacao.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const icone = ativo && !disabled ? ICONE_ATIVO : ICONE_INATIVO;
  const tint = disabled ? theme.textSecondary : theme.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Lembrete"
      accessibilityHint="Escolher quando avisar sobre o prazo"
      accessibilityState={{ selected: ativo && !disabled, disabled: !!disabled }}
      style={({ pressed }) => [
        styles.botao,
        { borderColor: theme.backgroundSelected },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <Animated.View style={ativo && !disabled ? { transform: [{ rotate }] } : undefined}>
        <SymbolView tintColor={tint} size={22} name={icone} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderWidth: 1,
    borderRadius: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
