import { StyleSheet, View } from 'react-native';
import { Host } from '@expo/ui';

import { useAppTabNavigation } from '@/hooks/use-app-tab-navigation';
import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';
import AdaptiveNavigationComposeView from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

const RAIL_WIDTH = 96;

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  const { selectedTab, selectTab } = useAppTabNavigation();
  const showRail = true;

  return (
    <View style={styles.container}>
      <View
        style={[styles.rail, { opacity: showRail ? 1 : 0 }]}
        pointerEvents={showRail ? 'auto' : 'none'}
        importantForAccessibility={showRail ? 'auto' : 'no-hide-descendants'}
      >
        <Host style={styles.host}>
          <AdaptiveNavigationComposeView selectedTab={selectedTab} onTabPress={selectTab} />
        </Host>
      </View>
      <View style={[styles.content, { marginLeft: showRail ? RAIL_WIDTH : 0 }]}>
        {children(false)}
      </View>
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
  host: {
    flex: 1,
  },
});
