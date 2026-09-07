import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Host } from '@expo/ui';
import { useTheme } from 'expo-router';
import { SafeAreaView } from 'react-native-screens/experimental';

import { Colors } from '@/constants/theme';
import { AdaptiveNavigationContext } from '@/contexts/adaptive-navigation-context';
import { EMPTY_WINDOW_FEATURES, PaneWindowContext } from '@/contexts/pane-window-context';
import { useAppTabNavigation } from '@/hooks/use-app-tab-navigation';
import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';
import AdaptiveNavigationComposeView, {
  type NavigationMode,
} from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

const RAIL_WIDTH = 96;

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  const { dark } = useTheme();
  const colors = Colors[dark ? 'dark' : 'light'];
  const { selectedTab, selectTab } = useAppTabNavigation();
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('bar');
  const [windowFeatures, setWindowFeatures] = useState(EMPTY_WINDOW_FEATURES);
  const showRail = navigationMode === 'rail';

  return (
    <PaneWindowContext.Provider value={windowFeatures}>
      <AdaptiveNavigationContext.Provider value={showRail}>
        <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
          <SafeAreaView edges={{ left: true, right: true }} insetType="system">
            <View style={styles.container}>
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
                    onWindowFeaturesChange={setWindowFeatures}
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
          </SafeAreaView>
        </View>
      </AdaptiveNavigationContext.Provider>
    </PaneWindowContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
