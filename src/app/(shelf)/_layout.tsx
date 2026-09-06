import { Stack } from 'expo-router';

import AdaptiveTabContent from '@/components/adaptive-tab-content';

export default function ShelfLayout() {
  return (
    <AdaptiveTabContent>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Shelf' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
