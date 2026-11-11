import Link from 'next/link';
import { admin } from '@/lib/supabase';

export const metadata = {
  title: 'Insights',
  description: 'Articles from Pink Paws Groomers on business development, customer experience, leadership and people development, strategy and sustainability, and business and NGO start-up.',
  alternates: { canonical: '/insights' },
};

export default async function Insights({ searchParams }) {
  const q = String(searchParams.q || '').replace(/[,()%]/g, ' ').trim();
  const cat = String(searchParams.category || '');
  let cats = [], posts = [];
  try {
    const db = admin();
    cats = (await db.from('categories').select('id,name,slug').order('name')).data || [];
    let query = db.from('articles').select('title,slug,excerpt,published_at,category_id').eq('status', 'published').order('published_at', { ascending: false });
    if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,body.ilike.%${q}%`);
    const sel = cats.find((c) => c.slug === cat);
    if (sel) query = query.eq('category_id', sel.id);
    posts = (await query).data || [];
  } catch {}
  const name = (id) => cats.find((c) => c.id === id)?.name;
  return (
    <>
      <section className="pagehead"><div className="wrap"><h1>Insights</h1><p className="lede">Knowledge sharing on business, people and customers.</p></div></section>
      <section className="sec">
        <div className="wrap">
          <form className="search" action="/insights" role="search">
            <input name="q" defaultValue={q} placeholder="Search articles" aria-label="Search articles" />
            <select name="category" defaultValue={cat} aria-label="Category"><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
            <button className="btn" type="submit">Search</button>
          </form>
          {posts.length === 0 ? (
            <p>{q || cat ? 'No articles match your search. Try different words or clear the category.' : 'No articles have been published yet. Please check back soon.'}</p>
          ) : (
            <div className="grid g3">
              {posts.map((p) => (
                <article className="card" key={p.slug}>
                  {name(p.category_id) && <span className="tag">{name(p.category_id)}</span>}
                  <h3>{p.title}</h3><p>{p.excerpt}</p>
                  <Link className="btn ghost sm" href={`/insights/${p.slug}`}>Read article</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
