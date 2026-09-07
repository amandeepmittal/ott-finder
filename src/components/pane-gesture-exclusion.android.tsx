import { StyleSheet, type ViewProps } from 'react-native';
import { requireNativeView } from 'expo';

const NativeExclusion = requireNativeView<ViewProps>(
  'AdaptiveNavigation',
  'PaneGestureExclusionView',
);

export default function PaneGestureExclusion() {
  return (
    <NativeExclusion style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false} />
  );
}
