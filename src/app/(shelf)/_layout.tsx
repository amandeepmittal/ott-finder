import { Stack, useRouter } from 'expo-router';

import AdaptivePaneLayout from '@/components/adaptive-pane-layout';
import AdaptiveTabContent from '@/components/adaptive-tab-content';
import TitleList from '@/components/title-list';
import { StackHeaderOptions } from '@/constants/theme';
import { useShelf } from '@/contexts/shelf-context';
import { titles } from '@/data/catalog';

export const unstable_settings = { initialRouteName: 'index' };

export default function ShelfLayout() {
  const router = useRouter();
  const { savedIds, ready, error } = useShelf();
  const items = titles.filter((title) => savedIds.includes(title.id));

  return (
    <AdaptiveTabContent>
      <Stack
        screenOptions={StackHeaderOptions}
        layout={({ state, children }) => {
          const route = state.routes[state.index];
          const value = route.params && 'id' in route.params ? route.params.id : undefined;
          const selectedId = route.name === '[id]' && typeof value === 'string' ? value : undefined;

          return (
            <AdaptivePaneLayout
              hasDetail={route.name === '[id]'}
              list={
                <TitleList
                  heading="Shelf"
                  items={ready ? items : []}
                  topInset
                  selectedId={selectedId}
                  emptyMessage={error ?? (!ready ? 'Loading Shelf…' : 'Your Shelf is empty.')}
                  onSelect={(id) => {
                    if (id === selectedId) return;
                    const destination = { pathname: '/(shelf)/[id]' as const, params: { id } };
                    if (route.name === '[id]') router.setParams({ id });
                    else router.push(destination);
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
