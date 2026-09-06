import { Platform, useColorScheme } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import AdaptiveNavigation from './adaptive-navigation';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <AdaptiveNavigation>
      {(hideBottomBar) => {
        return (
          <NativeTabs
            backgroundColor={colors.background}
            indicatorColor={colors.backgroundElement}
            labelStyle={{ selected: { color: colors.text } }}
            hidden={hideBottomBar}
          >
            <NativeTabs.Trigger
              name="(shelf)"
              disableAutomaticContentInsets={Platform.OS === 'android'}
            >
              <NativeTabs.Trigger.Icon
                sf={{ default: 'bookmark', selected: 'bookmark.fill' }}
                md={{ default: 'bookmark_border', selected: 'bookmark' }}
              />
              <NativeTabs.Trigger.Label>Shelf</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
              name="search"
              disableAutomaticContentInsets={Platform.OS === 'android'}
            >
              <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
              <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
              name="settings"
              disableAutomaticContentInsets={Platform.OS === 'android'}
            >
              <NativeTabs.Trigger.Icon
                sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
                md="settings"
              />
              <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
          </NativeTabs>
        );
      }}
    </AdaptiveNavigation>
  );
}
