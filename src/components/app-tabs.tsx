import { Platform } from 'react-native';
import { useTheme } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors } from '@/constants/theme';
import AdaptiveNavigation from './adaptive-navigation';

export default function AppTabs() {
  const { dark } = useTheme();
  const colors = Colors[dark ? 'dark' : 'light'];

  return (
    <AdaptiveNavigation>
      {(hideBottomBar) => {
        return (
          <NativeTabs
            backBehavior="initialRoute"
            backgroundColor={colors.background}
            indicatorColor={colors.backgroundElement}
            tintColor={colors.text}
            iconColor={{ default: colors.textSecondary, selected: colors.text }}
            labelStyle={{
              default: { color: colors.textSecondary },
              selected: { color: colors.text },
            }}
            hidden={hideBottomBar}
          >
            <NativeTabs.Trigger
              name="(shelf)"
              disablePopToTop
              disableScrollToTop
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
              disablePopToTop
              disableScrollToTop
              disableAutomaticContentInsets={Platform.OS === 'android'}
            >
              <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
              <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger
              name="settings"
              disablePopToTop
              disableScrollToTop
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
