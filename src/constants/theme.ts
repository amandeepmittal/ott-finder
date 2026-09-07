/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform, type TextStyle } from 'react-native';
import { DarkTheme, DefaultTheme } from 'expo-router';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundList: '#ffffff',
    backgroundDetail: '#F0F0F3',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundList: '#18191C',
    backgroundDetail: '#0F1013',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export const NavigationThemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.text,
      background: Colors.light.background,
      card: Colors.light.background,
      text: Colors.light.text,
      border: Colors.light.backgroundSelected,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.text,
      background: Colors.dark.background,
      card: Colors.dark.background,
      text: Colors.dark.text,
      border: Colors.dark.backgroundSelected,
    },
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = { small: 8, medium: 12, large: 16, extraLarge: 28, full: 999 } as const;

export const Typography = {
  heading: { fontSize: 24, lineHeight: 32, fontWeight: '400' },
  section: { fontSize: 22, lineHeight: 28, fontWeight: '400' },
  title: { fontSize: 16, lineHeight: 24, fontWeight: '500', letterSpacing: 0.15 },
  body: { fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  caption: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500', letterSpacing: 0.1 },
  tagline: { fontSize: 16, lineHeight: 24, fontStyle: 'italic', letterSpacing: 0.5 },
} as const satisfies Record<string, TextStyle>;

export const StackHeaderOptions = {
  headerTitleStyle: {
    fontSize: Typography.section.fontSize,
    fontWeight: Typography.section.fontWeight,
  },
  headerShadowVisible: false,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
export const MaxReadingWidth = 640;
