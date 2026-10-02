import { StyleSheet, View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { AppMenuHeader } from '@/presentation/components/AppMenuHeader';

export default function TabsLayout() {
  return (
    <View style={styles.root}>
      <AppTabs />
      <AppMenuHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
