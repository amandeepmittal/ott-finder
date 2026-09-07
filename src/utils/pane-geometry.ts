export type Frame = { x: number; y: number; width: number; height: number };
export type Hinge = { left: number; top: number; right: number; bottom: number };
export type PaneWindowFeatures = {
  verticalHinges: readonly Hinge[];
  horizontalHinges: readonly Hinge[];
};
export type PaneRect = { left: number; top: number; width: number; height: number };
export type PaneGeometry = {
  available: boolean;
  twoPane: boolean;
  list: PaneRect;
  detail: PaneRect;
  resizeRange?: { min: number; max: number };
};

const MIN_LIST = 280;
const MIN_DETAIL = 360;
const TWO_PANE_AT = 720;
const GAP = 16;
export const PANE_ANCHORS = [0, 0.33, 0.45, 0.66, 1] as const;

export function getPaneSplit(width: number, center: number) {
  'worklet';
  const offset = Math.min(width, Math.max(0, center));
  const gap = Math.min(GAP, offset * 2, (width - offset) * 2);
  const listWidth = offset - gap / 2;
  const detailLeft = offset + gap / 2;
  return { listWidth, detailLeft, detailWidth: width - detailLeft };
}

export function consumePaneDrag(center: number, delta: number, width: number) {
  'worklet';
  return Math.min(width, Math.max(0, center + delta));
}

export function getPaneContentMinimums(width: number) {
  return {
    list: Math.min(MIN_LIST, getPaneSplit(width, width * PANE_ANCHORS[1]).listWidth),
    detail: Math.min(MIN_DETAIL, getPaneSplit(width, width * PANE_ANCHORS[3]).detailWidth),
  };
}

export function getPaneAnchor(center: number, width: number) {
  'worklet';
  const anchors = PANE_ANCHORS.map((fraction) => width * fraction);
  return anchors.reduce((closest, anchor) =>
    Math.abs(anchor - center) < Math.abs(closest - center) ? anchor : closest,
  );
}

type Interval = { start: number; end: number };

export function isValidHinge(value: unknown): value is Hinge {
  if (typeof value !== 'object' || value === null) return false;
  if (!('left' in value && 'top' in value && 'right' in value && 'bottom' in value)) {
    return false;
  }
  const { left, top, right, bottom } = value;
  return (
    typeof left === 'number' &&
    Number.isFinite(left) &&
    typeof top === 'number' &&
    Number.isFinite(top) &&
    typeof right === 'number' &&
    Number.isFinite(right) &&
    typeof bottom === 'number' &&
    Number.isFinite(bottom) &&
    right >= left &&
    bottom >= top
  );
}

function getUsableIntervals(size: number, exclusions: Interval[]): Interval[] {
  const intervals: Interval[] = [];
  let cursor = 0;
  for (const exclusion of exclusions.sort((a, b) => a.start - b.start)) {
    if (exclusion.start > cursor) intervals.push({ start: cursor, end: exclusion.start });
    cursor = Math.max(cursor, exclusion.end);
  }
  if (cursor < size) intervals.push({ start: cursor, end: size });
  return intervals;
}

export function getPaneGeometry(
  frame: Frame,
  features: PaneWindowFeatures,
  preferredFraction?: number,
): PaneGeometry {
  const fallback = { left: 0, top: 0, width: 1, height: 1 };
  const unavailable = { available: false, twoPane: false, list: fallback, detail: fallback };
  if (!Object.values(frame).every(Number.isFinite) || frame.width <= 0 || frame.height <= 0) {
    return unavailable;
  }

  const { x, y, width, height } = frame;
  const vertical = features.verticalHinges
    .filter(isValidHinge)
    .filter(
      (hinge) =>
        hinge.bottom > y && hinge.top < y + height && hinge.right >= x && hinge.left <= x + width,
    )
    .map((hinge) => ({
      start: Math.max(0, hinge.left - x - GAP / 2),
      end: Math.min(width, hinge.right - x + GAP / 2),
    }));
  const horizontal = features.horizontalHinges
    .filter(isValidHinge)
    .filter(
      (hinge) =>
        hinge.right > x && hinge.left < x + width && hinge.bottom >= y && hinge.top <= y + height,
    )
    .map((hinge) => ({
      start: Math.max(0, hinge.top - y - GAP / 2),
      end: Math.min(height, hinge.bottom - y + GAP / 2),
    }));
  const columns = getUsableIntervals(width, vertical);
  const rows = getUsableIntervals(height, horizontal);
  if (columns.length === 0 || rows.length === 0) return unavailable;

  let largest = fallback;
  let largestArea = 0;
  for (const row of rows) {
    for (const column of columns) {
      const rectangle = {
        left: column.start,
        top: row.start,
        width: column.end - column.start,
        height: row.end - row.start,
      };
      const area = rectangle.width * rectangle.height;
      if (area > largestArea) {
        largest = rectangle;
        largestArea = area;
      }
    }
  }
  const single = { available: true, twoPane: false, list: largest, detail: largest };

  if (horizontal.length > 0) return single;

  if (vertical.length > 0) {
    const first = columns[0];
    const last = columns[columns.length - 1];
    const list = { left: first.start, top: 0, width: first.end - first.start, height };
    const detail = { left: last.start, top: 0, width: last.end - last.start, height };
    if (columns.length > 1 && list.width >= MIN_LIST && detail.width >= MIN_DETAIL) {
      return { available: true, twoPane: true, list, detail };
    }
    return single;
  }

  if (width < TWO_PANE_AT) return single;

  const resizeRange = { min: 0, max: width };
  const center =
    preferredFraction !== undefined && Number.isFinite(preferredFraction)
      ? width * preferredFraction
      : Math.min(360, width * 0.38);
  const { listWidth, detailLeft, detailWidth } = getPaneSplit(width, center);
  return {
    available: true,
    twoPane: true,
    list: { left: 0, top: 0, width: listWidth, height },
    detail: { left: detailLeft, top: 0, width: detailWidth, height },
    resizeRange,
  };
}
