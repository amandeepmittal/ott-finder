import { useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from 'expo-router';

import { PaneWindowContext } from '@/contexts/pane-window-context';
import { getPaneGeometry, type Frame } from '@/utils/pane-geometry';

type Props = { list: ReactNode; children: ReactNode; hasDetail: boolean };

export default function AdaptivePaneLayout({ list, children, hasDetail }: Props) {
  const { colors } = useTheme();
  const window = useWindowDimensions();
  const features = useContext(PaneWindowContext);
  const container = useRef<View>(null);
  const [frame, setFrame] = useState<Frame>({ x: 0, y: 0, width: 1, height: 1 });

  const measure = useCallback(() => {
    container.current?.measureInWindow((x, y, width, height) => {
      if (width <= 0 || height <= 0) return;
      setFrame((previous) =>
        previous.x === x &&
        previous.y === y &&
        previous.width === width &&
        previous.height === height
          ? previous
          : { x, y, width, height },
      );
    });
  }, []);

  useEffect(() => {
    const request = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(request);
  }, [measure, features, window.width, window.height]);

  const panes = getPaneGeometry(frame, features.verticalHinges, features.hasHorizontalHinge);
  const showList = panes.twoPane || !hasDetail;
  const showDetail = panes.twoPane || hasDetail;

  return (
    <View
      ref={container}
      collapsable={false}
      onLayout={measure}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[styles.pane, panes.list, { opacity: showList ? 1 : 0 }]}
        pointerEvents={showList ? 'auto' : 'none'}
        accessibilityElementsHidden={!showList}
        importantForAccessibility={showList ? 'auto' : 'no-hide-descendants'}
      >
        {list}
      </View>
      <View
        style={[styles.pane, panes.detail, { opacity: showDetail ? 1 : 0 }]}
        pointerEvents={showDetail ? 'auto' : 'none'}
        accessibilityElementsHidden={!showDetail}
        importantForAccessibility={showDetail ? 'auto' : 'no-hide-descendants'}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pane: { position: 'absolute', top: 0, bottom: 0 },
});
