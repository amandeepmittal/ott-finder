import { requireNativeView } from 'expo';

export type NavigationMode = 'rail' | 'bar';

export type WindowHinge = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type PaneWindowFeatures = {
  verticalHinges: WindowHinge[];
  hasHorizontalHinge: boolean;
};

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
  onWindowFeaturesChange: (event: { nativeEvent: PaneWindowFeatures }) => void;
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
      onWindowFeaturesChange={({ nativeEvent }) => onWindowFeaturesChange(nativeEvent)}
    />
  );
}
