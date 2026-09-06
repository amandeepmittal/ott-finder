import { requireNativeView } from 'expo';

export type NavigationMode = 'rail' | 'bar';

export type AppTabName = '(shelf)' | 'search' | 'settings';

export type AdaptiveNavigationComposeViewProps = {
  selectedTab: AppTabName;
  backgroundColor: string;
  contentColor: string;
  indicatorColor: string;
  onNavigationModeChange: (mode: NavigationMode) => void;
  onTabPress: (name: AppTabName) => void;
};

type NativeProps = Omit<
  AdaptiveNavigationComposeViewProps,
  'onTabPress' | 'onNavigationModeChange'
> & {
  onNavigationModeChange: (event: { nativeEvent: { mode: NavigationMode } }) => void;
  onTabPress: (event: { nativeEvent: { name: AppTabName } }) => void;
};

const NativeRail = requireNativeView<NativeProps>(
  'AdaptiveNavigation',
  'AdaptiveNavigationComposeView',
);

export default function AdaptiveNavigationComposeView({
  onTabPress,
  onNavigationModeChange,
  ...props
}: AdaptiveNavigationComposeViewProps) {
  return (
    <NativeRail
      {...props}
      onTabPress={({ nativeEvent }) => onTabPress(nativeEvent.name)}
      onNavigationModeChange={({ nativeEvent }) => onNavigationModeChange(nativeEvent.mode)}
    />
  );
}
