import type { News } from './types';

/** Formats a YYYY-MM-DD string deterministically (no timezone drift between server/client). */
export function formatNewsDate(date: string, style: 'long' | 'short' = 'long'): string {
  const [y, m, d] = (date || '').split('-').map(Number);
  if (!y || !m || !d) return date;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = months[m - 1];
  return style === 'short' ? `${d} ${month.slice(0, 3)} ${y}` : `${d} ${month} ${y}`;
}

/** Card teaser: the editor's summary, or a trimmed slice of the story. */
export function getTeaser(n: News, max = 160): string {
  const text = (n.summary || n.content || '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** Approximate reading time in minutes. */
export function readingTime(content: string): number {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const newsHref = (n: Pick<News, 'slug' | 'id'>) => `/news/${n.slug || n.id}`;
