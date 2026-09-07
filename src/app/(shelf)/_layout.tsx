import { Stack, useRouter } from 'expo-router';

import AdaptivePaneLayout from '@/components/adaptive-pane-layout';
import AdaptiveTabContent from '@/components/adaptive-tab-content';
import TitleList from '@/components/title-list';
import { titles } from '@/data/catalog';

export const unstable_settings = { initialRouteName: 'index' };

export default function ShelfLayout() {
  const router = useRouter();

  return (
    <AdaptiveTabContent>
      <Stack
        layout={({ state, children }) => {
          const route = state.routes[state.index];

          return (
            <AdaptivePaneLayout
              hasDetail={route.name === '[id]'}
              list={
                <TitleList
                  heading="Shelf"
                  items={titles}
                  topInset

                  onSelect={(id) => {
                    router.push({ pathname: '/(shelf)/[id]', params: { id } });
                  }}
                />
              }
            >
              {children}
            </AdaptivePaneLayout>
          );
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Shelf', headerShown: false }} />
        <Stack.Screen name="[id]" options={{ title: 'Details' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
