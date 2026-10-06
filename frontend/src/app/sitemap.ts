import type { MetadataRoute } from 'next';
import { getNotices, getNews } from '@/lib/api';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/admission', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/news', priority: 0.8, changeFrequency: 'daily' },
    { path: '/syllabus', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/notices', priority: 0.8, changeFrequency: 'daily' },
    { path: '/faculty', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/clubs', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const notices = await getNotices('all', '', true);
    for (const n of notices) {
      if (!n.slug) continue;
      const d = n.publish_date ? new Date(n.publish_date) : now;
      entries.push({
        url: absoluteUrl(`/notices/${n.slug}`),
        lastModified: isNaN(d.getTime()) ? now : d,
        changeFrequency: 'monthly',
        priority: n.is_pinned ? 0.7 : 0.5,
      });
    }
  } catch {
    // Backend unavailable: still serve the static portion of the sitemap.
  }

  try {
    const news = await getNews('all', '', true);
    for (const n of news) {
      if (!n.slug) continue;
      const d = n.publish_date ? new Date(n.publish_date) : now;
      entries.push({
        url: absoluteUrl(`/news/${n.slug}`),
        lastModified: isNaN(d.getTime()) ? now : d,
        changeFrequency: 'monthly',
        priority: n.is_featured ? 0.7 : 0.5,
      });
    }
  } catch {
    // Backend unavailable: skip news entries.
  }

  return entries;
}
