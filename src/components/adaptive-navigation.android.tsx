import { StyleSheet, Text, View } from 'react-native';

import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  return (
    <View style={styles.container}>
      <View style={styles.rail}>
        <Text>Rail goes here</Text>
      </View>
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
