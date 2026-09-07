import { Stack } from 'expo-router';

import AdaptiveTabContent from '@/components/adaptive-tab-content';
import { StackHeaderOptions } from '@/constants/theme';

export default function SettingsLayout() {
  return (
    <AdaptiveTabContent>
      <Stack screenOptions={StackHeaderOptions}>
        <Stack.Screen name="index" options={{ title: 'Settings' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
