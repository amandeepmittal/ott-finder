import { Stack, useRouter } from 'expo-router';

import AdaptivePaneLayout from '@/components/adaptive-pane-layout';
import AdaptiveTabContent from '@/components/adaptive-tab-content';
import CatalogSearch from '@/components/catalog-search';
import { StackHeaderOptions } from '@/constants/theme';

export const unstable_settings = { initialRouteName: 'index' };

export default function SearchLayout() {
  const router = useRouter();

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
                <CatalogSearch
                  selectedId={selectedId}
                  onSelect={(id) => {
                    if (id === selectedId) return;
                    const destination = { pathname: '/search/[id]' as const, params: { id } };
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
        <Stack.Screen name="index" options={{ title: 'Search', headerShown: false }} />
        <Stack.Screen name="[id]" options={{ title: 'Details' }} />
      </Stack>
    </AdaptiveTabContent>
  );
}
