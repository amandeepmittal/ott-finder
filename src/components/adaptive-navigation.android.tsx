import { StyleSheet, View } from 'react-native';
import { Host } from '@expo/ui';

import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';
import AdaptiveNavigationComposeView from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  return (
    <View style={styles.container}>
      <Host style={styles.rail}>
        <AdaptiveNavigationComposeView title="Native rail" />
      </Host>
      <View style={styles.content}>{children(false)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  rail: {
    width: 96,
    backgroundColor: '#E0E1E6',
    paddingTop: 64,
  },
  content: {
    flex: 1,
  },
});
