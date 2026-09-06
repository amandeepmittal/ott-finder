import { useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Host } from '@expo/ui';

import { Colors } from '@/constants/theme';
import { AdaptiveNavigationContext } from '@/contexts/adaptive-navigation-context';
import { useAppTabNavigation } from '@/hooks/use-app-tab-navigation';
import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';
import AdaptiveNavigationComposeView, {
  type NavigationMode,
} from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

const RAIL_WIDTH = 96;

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const { selectedTab, selectTab } = useAppTabNavigation();
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('bar');
  const showRail = navigationMode === 'rail';

  return (
    <AdaptiveNavigationContext.Provider value={showRail}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.rail, { opacity: showRail ? 1 : 0 }]}
          pointerEvents={showRail ? 'auto' : 'none'}
          importantForAccessibility={showRail ? 'auto' : 'no-hide-descendants'}
        >
          <Host style={styles.host}>
            <AdaptiveNavigationComposeView
              selectedTab={selectedTab}
              onTabPress={selectTab}
              backgroundColor={colors.background}
              contentColor={colors.text}
              indicatorColor={colors.backgroundElement}
              onNavigationModeChange={(mode) => {
                setNavigationMode(mode);
              }}
            />
          </Host>
        </View>
        <View style={[styles.content, { marginLeft: showRail ? RAIL_WIDTH : 0 }]}>
          {children(showRail)}
        </View>
      </View>
    </AdaptiveNavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: RAIL_WIDTH,
  },
  content: {
    flex: 1,
  },
  host: {
    flex: 1,
  },
});
