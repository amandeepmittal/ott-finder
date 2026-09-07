import { createContext } from 'react';

import type { PaneWindowFeatures } from '../../modules/adaptive-navigation/src/AdaptiveNavigationComposeView';

export const EMPTY_WINDOW_FEATURES: PaneWindowFeatures = {
  verticalHinges: [],
  hasHorizontalHinge: false,
};

export const PaneWindowContext = createContext(EMPTY_WINDOW_FEATURES);
