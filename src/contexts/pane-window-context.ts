import { createContext } from 'react';

import type { PaneWindowFeatures } from '@/utils/pane-geometry';

export const EMPTY_WINDOW_FEATURES: PaneWindowFeatures = {
  verticalHinges: [],
  horizontalHinges: [],
};

export const PaneWindowContext = createContext(EMPTY_WINDOW_FEATURES);
