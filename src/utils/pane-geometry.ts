export type Frame = { x: number; y: number; width: number; height: number };
export type Hinge = { left: number; top: number; right: number; bottom: number };
export type PaneGeometry = {
  twoPane: boolean;
  list: { left: number; width: number };
  detail: { left: number; width: number };
};

const MIN_LIST = 280;
const MIN_DETAIL = 360;
const TWO_PANE_AT = 720;
const GAP = 16;

export function getPaneGeometry(
  frame: Frame,
  verticalHinges: readonly Hinge[],
  hasHorizontalHinge: boolean,
): PaneGeometry {
  const width = Math.max(1, frame.width);
  const hinges = verticalHinges
    .filter((hinge) => hinge.bottom > frame.y && hinge.top < frame.y + frame.height)
    .map((hinge) => ({
      left: Math.max(0, hinge.left - frame.x - GAP / 2),
      right: Math.min(width, hinge.right - frame.x + GAP / 2),
    }))
    .filter((hinge) => hinge.left < width && hinge.right > 0)
    .sort((a, b) => a.left - b.left);

  const segments: { left: number; width: number }[] = [];
  let cursor = 0;
  for (const hinge of hinges) {
    if (hinge.left > cursor) segments.push({ left: cursor, width: hinge.left - cursor });
    cursor = Math.max(cursor, hinge.right);
  }
  if (cursor < width) segments.push({ left: cursor, width: width - cursor });

  const largest = segments.reduce(
    (best, segment) => (segment.width > best.width ? segment : best),
    { left: 0, width: 1 },
  );
  const single = { twoPane: false, list: largest, detail: largest };

  if (hasHorizontalHinge) return single;

  if (hinges.length > 0) {
    const list = segments[0];
    const detail = segments[segments.length - 1];
    if (segments.length > 1 && list.width >= MIN_LIST && detail.width >= MIN_DETAIL) {
      return { twoPane: true, list, detail };
    }
    return single;
  }

  if (width < TWO_PANE_AT) return single;

  const listWidth = Math.min(360, Math.max(MIN_LIST, width * 0.38));
  return {
    twoPane: true,
    list: { left: 0, width: listWidth },
    detail: { left: listWidth + GAP, width: width - listWidth - GAP },
  };
}
