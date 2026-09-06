import { useCallback } from 'react';
import { useNavigationContainerRef, useSegments } from 'expo-router';
import type { NavigationState, PartialState } from 'expo-router/react-navigation';

import type { AppTabName } from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

const APP_TAB_NAMES = ['(shelf)', 'search', 'settings'] as const;
type NavigationTree = NavigationState | PartialState<NavigationState>;

function findAppTabs(state: NavigationTree | undefined): NavigationState | undefined {
  if (!state) return undefined;

  if (
    state.stale === false &&
    state.type === 'tab' &&
    APP_TAB_NAMES.every((name) => state.routeNames.includes(name))
  ) {
    return state;
  }

  for (const route of state.routes) {
    const tabs = findAppTabs(route.state);
    if (tabs) return tabs;
  }

  return undefined;
}

export function useAppTabNavigation() {
  const navigationRef = useNavigationContainerRef();
  const [firstSegment] = useSegments();
  const selectedTab: AppTabName =
    firstSegment === 'search' || firstSegment === 'settings' ? firstSegment : '(shelf)';

  const selectTab = useCallback(
    (name: AppTabName) => {
      if (!navigationRef.isReady()) return;

      const tabs = findAppTabs(navigationRef.getRootState());
      if (!tabs || tabs.routes[tabs.index]?.name === name) return;

      navigationRef.dispatch({
        type: 'JUMP_TO',
        target: tabs.key,
        payload: { name },
      });
    },
    [navigationRef],
  );

  return { selectedTab, selectTab };
}
