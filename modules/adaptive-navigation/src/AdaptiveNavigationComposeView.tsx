import { requireNativeView } from 'expo';
import { type PrimitiveBaseProps } from '@expo/ui/jetpack-compose';
import { createViewModifierEventListener } from '@expo/ui/jetpack-compose/modifiers';
import * as React from 'react';

export interface AdaptiveNavigationComposeViewProps extends PrimitiveBaseProps {
  title: string;
  children?: React.ReactNode;
}

const NativeAdaptiveNavigationComposeView = requireNativeView<AdaptiveNavigationComposeViewProps>(
  'AdaptiveNavigation',
  'AdaptiveNavigationComposeView'
);

export default function AdaptiveNavigationComposeView({
  modifiers,
  ...rest
}: AdaptiveNavigationComposeViewProps) {
  return (
    <NativeAdaptiveNavigationComposeView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...rest}
    />
  );
}
