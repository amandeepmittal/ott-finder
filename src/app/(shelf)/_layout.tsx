import { Stack } from 'expo-router';

import AdaptiveTabContent from '@/components/adaptive-tab-content';

export default function ShelfLayout() {
  return (
    <AdaptiveTabContent>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Shelf' }} />
        <Stack.Screen name="[id]" options={{ title: 'Details' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
