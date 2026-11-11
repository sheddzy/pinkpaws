import { admin } from '@/lib/supabase';
import { siteUrl } from '@/lib/content';

export default async function sitemap() {
  const base = siteUrl();
  const pages = ['', '/about', '/services', '/approach', '/insights', '/contact'].map((p) => ({ url: base + p, lastModified: new Date() }));
  let posts = [];
  try { posts = (await admin().from('articles').select('slug,updated_at').eq('status', 'published')).data || []; } catch {}
  return [...pages, ...posts.map((a) => ({ url: `${base}/insights/${a.slug}`, lastModified: new Date(a.updated_at) }))];
}
