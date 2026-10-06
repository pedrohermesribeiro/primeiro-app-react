import { useEffect, useState } from 'react';
import { AppState, PixelRatio, Platform } from 'react-native';

function lerFonteGrandeAndroid(): boolean {
  return Platform.OS === 'android' && PixelRatio.getFontScale() > 1;
}

/** Layout acessível do formulário só quando o Android usa escala de fonte acima do padrão. */
export function useFonteGrandeFormulario(): boolean {
  const [fonteGrande, setFonteGrande] = useState(lerFonteGrandeAndroid);

  useEffect(() => {
    const atualizar = () => setFonteGrande(lerFonteGrandeAndroid());
    const sub = AppState.addEventListener('change', atualizar);
    return () => sub.remove();
  }, []);

  return fonteGrande;
}
