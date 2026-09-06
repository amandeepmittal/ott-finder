import type { AdaptiveNavigationProps } from '@/types/adaptive-navigation.types';

export default function AdaptiveNavigation({ children }: AdaptiveNavigationProps) {
  return <>{children(false)}</>;
}
