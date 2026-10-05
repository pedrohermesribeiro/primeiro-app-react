import type { SymbolViewProps } from 'expo-symbols';

export type AppMenuItemId = 'filtros' | 'categorias' | 'tema' | 'exportar' | 'sobre';

export type AppMenuItemDef = {
  id: AppMenuItemId;
  label: string;
  icon: SymbolViewProps['name'];
};

export const APP_MENU_ITEMS: AppMenuItemDef[] = [
  {
    id: 'filtros',
    label: 'Filtros',
    icon: { ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' },
  },
  {
    id: 'categorias',
    label: 'Gerenciar categorias',
    icon: { ios: 'folder', android: 'folder', web: 'folder' },
  },
  {
    id: 'tema',
    label: 'Tema',
    icon: { ios: 'paintpalette', android: 'palette', web: 'palette' },
  },
  {
    id: 'exportar',
    label: 'Exportar dados',
    icon: { ios: 'square.and.arrow.down', android: 'download', web: 'download' },
  },
  {
    id: 'sobre',
    label: 'Sobre',
    icon: { ios: 'info.circle', android: 'info', web: 'info' },
  },
];
