import { Stack } from 'expo-router';

import AdaptiveTabContent from '@/components/adaptive-tab-content';

export default function SearchLayout() {
  return (
    <AdaptiveTabContent>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Search' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
