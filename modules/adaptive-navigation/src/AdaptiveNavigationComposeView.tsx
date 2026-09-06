import { requireNativeView } from 'expo';

export type AppTabName = '(shelf)' | 'search' | 'settings';

export type AdaptiveNavigationComposeViewProps = {
  selectedTab: AppTabName;
};

export default requireNativeView<AdaptiveNavigationComposeViewProps>(
  'AdaptiveNavigation',
  'AdaptiveNavigationComposeView',
);
