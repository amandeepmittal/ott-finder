import { requireNativeView } from 'expo';

export type AppTabName = '(shelf)' | 'search' | 'settings';

export type AdaptiveNavigationComposeViewProps = {
  selectedTab: AppTabName;
  onTabPress: (name: AppTabName) => void;
};

type NativeProps = Omit<AdaptiveNavigationComposeViewProps, 'onTabPress'> & {
  onTabPress: (event: { nativeEvent: { name: AppTabName } }) => void;
};

const NativeRail = requireNativeView<NativeProps>(
  'AdaptiveNavigation',
  'AdaptiveNavigationComposeView',
);

export default function AdaptiveNavigationComposeView({
  onTabPress,
  ...props
}: AdaptiveNavigationComposeViewProps) {
  return <NativeRail {...props} onTabPress={({ nativeEvent }) => onTabPress(nativeEvent.name)} />;
}
