import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Storage from 'expo-sqlite/kv-store';

import { titles } from '@/data/catalog';

type ShelfContextValue = {
  savedIds: readonly string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  ready: boolean;
  error: string | null;
};

const storageKey = 'ott-finder:saved-title-ids:v1';
const initialSavedIds = ['movie:693134', 'tv:95396', 'movie:666277'];
const catalogIds = new Set(titles.map((title) => title.id));
const ShelfContext = createContext<ShelfContextValue | null>(null);

async function readSavedIds(): Promise<string[]> {
  const stored = await Storage.getItem(storageKey);

  if (stored === null) {
    return [...initialSavedIds];
  }

  const parsed: unknown = JSON.parse(stored);

  if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) {
    throw new Error('Saved title IDs must be an array of strings.');
  }

  return [...new Set(parsed.filter((id: string) => catalogIds.has(id)))];
}

export function ShelfProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedIdsRef = useRef<string[]>([]);
  const readyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShelf() {
      try {
        const loaded = await readSavedIds();

        if (cancelled) {
          return;
        }

        savedIdsRef.current = loaded;
        readyRef.current = true;
        setSavedIds(loaded);
        setReady(true);
        setError(null);
      } catch {
        if (!cancelled) {
          setError('Your saved Shelf could not be loaded. Restart the app to try again.');
        }
      }
    }

    void loadShelf();

    return () => {
      cancelled = true;
    };
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSaved = useCallback((id: string) => {
    if (!readyRef.current || !catalogIds.has(id)) {
      return;
    }

    const current = savedIdsRef.current;
    const next = current.includes(id)
      ? current.filter((savedId) => savedId !== id)
      : [...current, id];

    try {
      Storage.setItemSync(storageKey, JSON.stringify(next));
      savedIdsRef.current = next;
      setSavedIds(next);
      setError(null);
    } catch {
      setError('Your Shelf could not be saved. Your previous selection is unchanged. Try again.');
    }
  }, []);

  const value = useMemo(
    () => ({ savedIds, isSaved, toggleSaved, ready, error }),
    [savedIds, isSaved, toggleSaved, ready, error],
  );

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>;
}

export function useShelf() {
  const value = useContext(ShelfContext);

  if (value === null) {
    throw new Error('useShelf must be used inside ShelfProvider.');
  }

  return value;
}
