import { Stack } from 'expo-router';

import AdaptiveTabContent from '@/components/adaptive-tab-content';

export default function SettingsLayout() {
  return (
    <AdaptiveTabContent>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Settings' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
