import snapshot from './tmdb.json';

export type Title = (typeof snapshot.titles)[number];

export const titles: Title[] = snapshot.titles;
export const refreshedAt = snapshot.fetchedAt;

export function formatRuntime(title: Title): string {
  if (title.mediaType === 'tv' && title.seasons) {
    return `${title.seasons} season${title.seasons === 1 ? '' : 's'}`;
  }
  if (!title.runtime) return '';
  return `${Math.floor(title.runtime / 60)}h ${title.runtime % 60}m`;
}

export function metadata(title: Title): string {
  return [title.mediaType === 'tv' ? 'Series' : 'Film', title.year, formatRuntime(title)]
    .filter(Boolean)
    .join(' · ');
}
