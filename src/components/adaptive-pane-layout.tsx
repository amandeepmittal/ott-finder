import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type ViewProps,
} from 'react-native';
import { ThemeProvider, useTheme } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  interpolateColor,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN, scheduleOnUI } from 'react-native-worklets';

import PaneGestureExclusion from '@/components/pane-gesture-exclusion';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { PaneWindowContext } from '@/contexts/pane-window-context';
import {
  consumePaneDrag,
  getPaneAnchor,
  getPaneContentMinimums,
  getPaneGeometry,
  getPaneSplit,
  PANE_ANCHORS,
  type Frame,
} from '@/utils/pane-geometry';

type Props = { list: ReactNode; children: ReactNode; hasDetail: boolean };
type Adjustment = 'next' | 'increment' | 'decrement';

export default function AdaptivePaneLayout({ list, children, hasDetail }: Props) {
  const theme = useTheme();
  const { colors, dark } = theme;
  const palette = Colors[dark ? 'dark' : 'light'];
  const window = useWindowDimensions();
  const features = useContext(PaneWindowContext);
  const container = useRef<View>(null);
  const listPane = useRef<View>(null);
  const detailPane = useRef<View>(null);
  const [frame, setFrame] = useState<Frame>({ x: 0, y: 0, width: 0, height: 0 });
  const [preferredFraction, setPreferredFraction] = useState<number>();

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

  const panes = getPaneGeometry(frame, features, preferredFraction);
  const showList = panes.available && (panes.twoPane || !hasDetail);
  const showDetail = panes.available && (panes.twoPane || hasDetail);
  const listTheme = panes.twoPane
    ? {
        ...theme,
        colors: { ...colors, background: palette.backgroundList, card: palette.backgroundList },
      }
    : theme;
  const detailTheme = panes.twoPane
    ? {
        ...theme,
        colors: { ...colors, background: palette.backgroundDetail, card: palette.backgroundDetail },
      }
    : theme;
  const resizable = !!panes.resizeRange;
  const minimums = getPaneContentMinimums(frame.width);
  const initialCenter = (panes.list.width + panes.detail.left) / 2;
  const geometryKey = JSON.stringify([frame, resizable, features]);
  const activeGeometry = useSharedValue(geometryKey);
  const dragGeometry = useSharedValue('');
  const motionGeneration = useSharedValue(0);
  const dragGeneration = useSharedValue(0);
  const liveOffset = useSharedValue(initialCenter);
  const previousPointer = useSharedValue(0);
  const dragging = useSharedValue(false);
  const pressed = useSharedValue(0);
  const split = useDerivedValue(() => getPaneSplit(frame.width, liveOffset.get()));
  const interactiveMask = useDerivedValue(() => {
    const listUsable = !resizable || split.get().listWidth >= minimums.list - 0.5;
    const detailUsable = !resizable || split.get().detailWidth >= minimums.detail - 0.5;
    return (showList && listUsable ? 1 : 0) | (showDetail && detailUsable ? 2 : 0);
  });
  const initialMask =
    (showList && (!resizable || panes.list.width >= minimums.list - 0.5) ? 1 : 0) |
    (showDetail && (!resizable || panes.detail.width >= minimums.detail - 0.5) ? 2 : 0);
  const [interaction, setInteraction] = useState({ key: geometryKey, mask: initialMask });
  const visibleMask = interaction.key === geometryKey ? interaction.mask : initialMask;

  useLayoutEffect(() => {
    scheduleOnUI(() => {
      'worklet';
      motionGeneration.set(motionGeneration.get() + 1);
      cancelAnimation(liveOffset);
      activeGeometry.set(geometryKey);
      liveOffset.set(initialCenter);
      dragging.set(false);
      pressed.set(0);
    });
  }, [geometryKey, initialCenter, motionGeneration, liveOffset, activeGeometry, dragging, pressed]);

  useEffect(
    () => () => {
      motionGeneration.set(motionGeneration.get() + 1);
      cancelAnimation(liveOffset);
      cancelAnimation(pressed);
    },
    [motionGeneration, liveOffset, pressed],
  );

  const updateInteraction = useCallback(
    (mask: number, key: string) => {
      if (activeGeometry.get() !== key) return;
      setInteraction((previous) =>
        previous.key === key && previous.mask === mask ? previous : { key, mask },
      );
    },
    [activeGeometry],
  );
  useAnimatedReaction(
    () => ({ mask: interactiveMask.get(), key: geometryKey }),
    (current, previous) => {
      if (current.mask !== previous?.mask || current.key !== previous.key) {
        scheduleOnRN(updateInteraction, current.mask, current.key);
      }
    },
  );

  const commitOffset = (offset: number, key: string, generation: number) => {
    if (activeGeometry.get() !== key || motionGeneration.get() !== generation || !resizable) {
      return;
    }
    setPreferredFraction(offset / frame.width);
  };

  const springTo = (target: number, velocity: number, generation: number, key: string) => {
    'worklet';
    liveOffset.set(
      withSpring(
        target,
        {
          duration: 400,
          dampingRatio: 0.8,
          velocity,
          overshootClamping: true,
          reduceMotion: ReduceMotion.System,
        },
        (finished) => {
          if (finished && activeGeometry.get() === key && motionGeneration.get() === generation) {
            scheduleOnRN(commitOffset, target, key, generation);
          }
        },
      ),
    );
  };

  const settle = (velocity: number) => {
    'worklet';
    const generation = motionGeneration.get();
    if (activeGeometry.get() !== geometryKey || !resizable) return;
    if (Math.abs(velocity) <= 200) {
      springTo(getPaneAnchor(liveOffset.get(), frame.width), velocity, generation, geometryKey);
      return;
    }
    liveOffset.set(
      withDecay(
        {
          velocity,
          deceleration: 0.99,
          clamp: [0, frame.width],
          reduceMotion: ReduceMotion.System,
        },
        (finished) => {
          if (
            finished &&
            activeGeometry.get() === geometryKey &&
            motionGeneration.get() === generation
          ) {
            springTo(getPaneAnchor(liveOffset.get(), frame.width), 0, generation, geometryKey);
          }
        },
      ),
    );
  };

  const adjust = (direction: Adjustment) => {
    'worklet';
    if (!resizable || activeGeometry.get() !== geometryKey) return;
    motionGeneration.set(motionGeneration.get() + 1);
    cancelAnimation(liveOffset);
    const anchors = PANE_ANCHORS.map((fraction) => fraction * frame.width);
    const next =
      direction === 'decrement'
        ? (anchors.findLast((offset) => offset < liveOffset.get() - 1) ?? anchors[0])
        : (anchors.find((offset) => offset > liveOffset.get() + 1) ??
          (direction === 'next' ? anchors[0] : anchors[anchors.length - 1]));
    springTo(next, 0, motionGeneration.get(), geometryKey);
  };

  const pan = Gesture.Pan()
    .enabled(resizable)
    .maxPointers(1)
    .activeOffsetX([-4, 4])
    .failOffsetY([-16, 16])
    .onBegin((event) => {
      motionGeneration.set(motionGeneration.get() + 1);
      cancelAnimation(liveOffset);
      dragGeneration.set(motionGeneration.get());
      dragGeometry.set(geometryKey);
      previousPointer.set(event.absoluteX);
      dragging.set(false);
      pressed.set(withTiming(1, { duration: 120, reduceMotion: ReduceMotion.System }));
    })
    .onStart(() => {
      dragging.set(true);
    })
    .onUpdate((event) => {
      const delta = event.absoluteX - previousPointer.get();
      previousPointer.set(event.absoluteX);
      if (
        dragGeometry.get() !== activeGeometry.get() ||
        dragGeneration.get() !== motionGeneration.get()
      )
        return;
      liveOffset.set(consumePaneDrag(liveOffset.get(), delta, frame.width));
    })
    .onEnd((event, success) => {
      if (
        success &&
        dragGeometry.get() === activeGeometry.get() &&
        dragGeneration.get() === motionGeneration.get()
      )
        settle(event.velocityX);
    })
    .onFinalize((_event, success) => {
      pressed.set(withTiming(0, { duration: 120, reduceMotion: ReduceMotion.System }));
      if (
        !success &&
        dragging.get() &&
        dragGeometry.get() === activeGeometry.get() &&
        dragGeneration.get() === motionGeneration.get()
      )
        settle(0);
      dragging.set(false);
    });
  const tap = Gesture.Tap()
    .maxDistance(6)
    .onEnd((_event, success) => {
      if (success) adjust('next');
    });

  const listStyle = useAnimatedStyle(() => ({
    ...panes.list,
    width: resizable ? split.get().listWidth : panes.list.width,
    opacity: showList ? 1 : 0,
  }));
  const detailStyle = useAnimatedStyle(() => ({
    ...panes.detail,
    left: resizable ? split.get().detailLeft : panes.detail.left,
    width: resizable ? split.get().detailWidth : panes.detail.width,
    opacity: showDetail ? 1 : 0,
  }));
  const listContentStyle = useAnimatedStyle(() => ({
    width: resizable ? Math.max(minimums.list, split.get().listWidth) : panes.list.width,
    height: panes.list.height,
  }));
  const detailContentStyle = useAnimatedStyle(() => ({
    width: resizable ? Math.max(minimums.detail, split.get().detailWidth) : panes.detail.width,
    height: panes.detail.height,
  }));
  const listProps = useAnimatedProps<ViewProps>(() => ({
    pointerEvents: interactiveMask.get() & 1 ? 'auto' : 'none',
    accessibilityElementsHidden: !(interactiveMask.get() & 1),
    importantForAccessibility: interactiveMask.get() & 1 ? 'auto' : 'no-hide-descendants',
  }));
  const detailProps = useAnimatedProps<ViewProps>(() => ({
    pointerEvents: interactiveMask.get() & 2 ? 'auto' : 'none',
    accessibilityElementsHidden: !(interactiveMask.get() & 2),
    importantForAccessibility: interactiveMask.get() & 2 ? 'auto' : 'no-hide-descendants',
  }));
  const handleStyle = useAnimatedStyle(() => ({
    left: Math.max(0, Math.min(frame.width - 48, liveOffset.get() - 24)),
    top: Math.max(0, Math.min(frame.height - 64, frame.height / 2 - 32)),
  }));
  const gripStyle = useAnimatedStyle(() => {
    const progress = pressed.get();
    const width = 4 + 8 * progress;
    const handleLeft = Math.max(0, Math.min(frame.width - 48, liveOffset.get() - 24));
    const center = Math.max(8, Math.min(frame.width - 8, liveOffset.get()));
    return {
      left: center - handleLeft - width / 2,
      top: (64 - (48 + 4 * progress)) / 2,
      width,
      height: 48 + 4 * progress,
      borderRadius: width / 2,
      backgroundColor: interpolateColor(progress, [0, 1], [palette.textSecondary, palette.text]),
    };
  });

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const input = TextInput.State.currentlyFocusedInput();
    if (
      input &&
      ((!(visibleMask & 1) && listPane.current?.contains(input)) ||
        (!(visibleMask & 2) && detailPane.current?.contains(input)))
    )
      input.blur();
  }, [visibleMask]);

  const percentage = frame.width ? Math.round((initialCenter / frame.width) * 100) : 0;
  return (
    <View
      ref={container}
      collapsable={false}
      onLayout={measure}
      style={[styles.container, { backgroundColor: listTheme.colors.background }]}
    >
      <Animated.View
        ref={listPane}
        style={[styles.pane, listStyle]}
        animatedProps={listProps}
        pointerEvents={visibleMask & 1 ? 'auto' : 'none'}
        accessibilityElementsHidden={!(visibleMask & 1)}
        importantForAccessibility={visibleMask & 1 ? 'auto' : 'no-hide-descendants'}
      >
        <Animated.View style={listContentStyle}>
          <ThemeProvider value={listTheme}>{list}</ThemeProvider>
        </Animated.View>
      </Animated.View>
      <Animated.View
        ref={detailPane}
        style={[styles.pane, detailStyle]}
        animatedProps={detailProps}
        pointerEvents={visibleMask & 2 ? 'auto' : 'none'}
        accessibilityElementsHidden={!(visibleMask & 2)}
        importantForAccessibility={visibleMask & 2 ? 'auto' : 'no-hide-descendants'}
      >
        <Animated.View style={detailContentStyle}>
          <View
            style={[
              styles.detailSurface,
              panes.twoPane && styles.roundedDetail,
              { backgroundColor: detailTheme.colors.background },
            ]}
          >
            <ThemeProvider value={detailTheme}>{children}</ThemeProvider>
          </View>
        </Animated.View>
      </Animated.View>
      {resizable && (
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <Animated.View
            collapsable={false}
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel="Adjust pane widths"
            accessibilityHint="Drag left or right, or double tap to change the split."
            accessibilityValue={{
              min: 0,
              max: 100,
              now: percentage,
              text:
                percentage === 0
                  ? 'Details expanded, list collapsed'
                  : percentage === 100
                    ? 'List expanded, details collapsed'
                    : `Divider at ${percentage} percent`,
            }}
            accessibilityActions={[
              { name: 'activate', label: 'Change split' },
              { name: 'increment', label: 'Widen list' },
              { name: 'decrement', label: 'Widen details' },
            ]}
            onAccessibilityAction={({ nativeEvent: { actionName } }) => {
              if (actionName === 'increment' || actionName === 'decrement') {
                scheduleOnUI(adjust, actionName);
              } else if (actionName === 'activate') scheduleOnUI(adjust, 'next');
            }}
            style={[styles.handle, handleStyle]}
          >
            <PaneGestureExclusion />
            <Animated.View style={[styles.grip, gripStyle]} pointerEvents="none" />
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pane: { position: 'absolute', overflow: 'hidden' },
  detailSurface: { flex: 1, overflow: 'hidden' },
  roundedDetail: {
    marginVertical: Spacing.two,
    marginRight: Spacing.two,
    borderRadius: Radius.extraLarge,
    borderCurve: 'continuous',
  },
  handle: {
    position: 'absolute',
    width: 48,
    height: 64,
    justifyContent: 'center',
  },
  grip: { position: 'absolute' },
});
