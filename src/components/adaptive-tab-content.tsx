import { useContext, type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'expo-router';
import { SafeAreaView } from 'react-native-screens/experimental';

import { AdaptiveNavigationContext } from '@/contexts/adaptive-navigation-context';

export default function AdaptiveTabContent({ children }: PropsWithChildren) {
  const showRail = useContext(AdaptiveNavigationContext);
  const { colors } = useTheme();

  if (Platform.OS !== 'android') {
    return <>{children}</>;
  }

  return (
    <View style={[styles.content, { backgroundColor: colors.background }]}>
      <SafeAreaView
        style={styles.content}
        edges={{ bottom: true }}
        insetType={showRail ? 'system' : 'all'}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
