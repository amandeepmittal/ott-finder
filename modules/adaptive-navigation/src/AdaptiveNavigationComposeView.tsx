import { requireNativeView } from 'expo';

import { isValidHinge, type PaneWindowFeatures } from '../../../src/utils/pane-geometry';

export type NavigationMode = 'rail' | 'bar';

export type AppTabName = '(shelf)' | 'search' | 'settings';

export type AdaptiveNavigationComposeViewProps = {
  selectedTab: AppTabName;
  backgroundColor: string;
  contentColor: string;
  indicatorColor: string;
  onNavigationModeChange: (mode: NavigationMode) => void;
  onWindowFeaturesChange: (features: PaneWindowFeatures) => void;
  onTabPress: (name: AppTabName) => void;
};

type NativeProps = Omit<
  AdaptiveNavigationComposeViewProps,
  'onTabPress' | 'onNavigationModeChange' | 'onWindowFeaturesChange'
> & {
  onNavigationModeChange: (event: { nativeEvent: { mode: NavigationMode } }) => void;
  onWindowFeaturesChange: (event: {
    nativeEvent: { verticalHinges: unknown; horizontalHinges: unknown };
  }) => void;
  onTabPress: (event: { nativeEvent: { name: AppTabName } }) => void;
};

const NativeRail = requireNativeView<NativeProps>(
  'AdaptiveNavigation',
  'AdaptiveNavigationComposeView',
);

export default function AdaptiveNavigationComposeView({
  onTabPress,
  onNavigationModeChange,
  onWindowFeaturesChange,
  ...props
}: AdaptiveNavigationComposeViewProps) {
  return (
    <NativeRail
      {...props}
      onTabPress={({ nativeEvent }) => onTabPress(nativeEvent.name)}
      onNavigationModeChange={({ nativeEvent }) => onNavigationModeChange(nativeEvent.mode)}
      onWindowFeaturesChange={({ nativeEvent }) =>
        onWindowFeaturesChange({
          verticalHinges: Array.isArray(nativeEvent.verticalHinges)
            ? nativeEvent.verticalHinges.filter(isValidHinge)
            : [],
          horizontalHinges: Array.isArray(nativeEvent.horizontalHinges)
            ? nativeEvent.horizontalHinges.filter(isValidHinge)
            : [],
        })
      }
    />
  );
}
