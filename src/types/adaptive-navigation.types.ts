import { ReactNode } from 'react';

export type AdaptiveNavigationProps = {
  children: (hideBottomBar: boolean) => ReactNode;
};
