import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { admin } from '@/lib/supabase';
import { renderBody } from '@/lib/render';

async function get(slug) {
  try {
    const { data } = await admin().from('articles').select('*, categories(name)').eq('slug', slug).eq('status', 'published').maybeSingle();
    return data;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const a = await get(params.slug);
  if (!a) return { title: 'Article not found' };
  return {
    title: a.title, description: a.excerpt || undefined, alternates: { canonical: `/insights/${a.slug}` },
    openGraph: { title: a.title, description: a.excerpt || undefined, type: 'article', images: a.featured_image_url ? [a.featured_image_url] : ['/logo.png'] },
  };
}

export default async function Article({ params }) {
  const a = await get(params.slug);
  if (!a) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, datePublished: a.published_at, dateModified: a.updated_at, publisher: { '@type': 'Organization', name: 'Pink Paws Groomers' } };
  return (
    <>
      <section className="pagehead"><div className="wrap article">
        {a.categories?.name && <span className="tag">{a.categories.name}</span>}
        <h1>{a.title}</h1>
        <p>{new Date(a.published_at).toLocaleDateString('en-NG', { dateStyle: 'long' })}</p>
      </div></section>
      <section className="sec"><div className="wrap article">
        {a.featured_image_url && <div className="vis tall" style={{ marginBottom: 32 }}><Image src={a.featured_image_url} alt={a.title} fill sizes="740px" priority /></div>}
        {renderBody(a.body)}
        <p style={{ marginTop: 40 }}><Link href="/insights" className="btn ghost">Back to insights</Link> <Link href="/contact" className="btn">Talk to us</Link></p>
      </div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
