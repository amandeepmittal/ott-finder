import { useColorScheme } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import { ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { NavigationThemes } from '@/constants/theme';
import { ShelfProvider } from '@/contexts/shelf-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NavigationThemes[dark ? 'dark' : 'light']}>
        <ShelfProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
          <StatusBar style={dark ? 'light' : 'dark'} />
          <NavigationBar style={dark ? 'light' : 'dark'} />
        </ShelfProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
