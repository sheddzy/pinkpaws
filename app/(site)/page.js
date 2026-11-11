export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { SERVICES, APPROACH, getContent } from '@/lib/content';
import { admin } from '@/lib/supabase';
import Visual from '@/components/Visual';

export const metadata = {
  title: { absolute: 'Pink Paws Groomers | Business Consulting, Customer Service and Strategy in Lagos' },
  description: 'Lekki based business consulting firm helping organisations strengthen customer service, develop people, set up businesses and NGOs, and plan sustainable growth.',
  alternates: { canonical: '/' },
};

async function latest() {
  try {
    const { data } = await admin().from('articles').select('title,slug,excerpt,published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(3);
    return data || [];
  } catch { return []; }
}

export default async function Home() {
  const c = await getContent();
  const posts = await latest();
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="kicker">Business consulting, Lekki, Lagos</p>
            <h1>{c.hero_headline}</h1>
            <p className="lede">{c.hero_text}</p>
            <div className="row" style={{ marginTop: 28 }}>
              <Link href="/services" className="btn light">Explore Our Services</Link>
              <Link href="/contact" className="btn outline-light">Contact Us</Link>
            </div>
          </div>
          <div className="hero-mark"><Image src="/logo.png" alt="Pink Paws Groomers logo" width={260} height={260} priority /></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2>What we do</h2>
          <p className="lede">Four areas of consulting support for businesses and organisations.</p>
          <div className="grid g4" style={{ marginTop: 28 }}>
            {SERVICES.map((s, i) => (
              <article className="card" key={s.slug}>
                <Visual id={s.slug} alt={`${s.name} consulting`} label={s.name} />
                <h3>{s.name}</h3>
                <p>{c[`service_${i}_desc`]}</p>
                <Link className="btn ghost sm" href={`/services#${s.slug}`}>Learn more</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap split">
          <div>
            <h2>About Pink Paws Groomers</h2>
            <p>{c.about_company}</p>
            <Link href="/about" className="btn ghost">Read our story</Link>
          </div>
          <Visual id="about" alt="Consultants in a planning meeting" label="Consulting in practice" tall />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2>Why work with Pink Paws</h2>
          <div className="grid g4" style={{ marginTop: 24 }}>
            {[['Established in 2014', 'A consulting practice based in Lekki, Lagos, with more than a decade behind the name.'],
              ['People at the centre', 'Better organisations come from capable, motivated people, so our work starts there.'],
              ['Clear and practical', 'Recommendations are written plainly so your team can act on them.'],
              ['A focused team', 'A small team that keeps the work close to the people who ask for it.']].map(([t, d]) => (
              <div className="card" key={t}><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <h2>How an engagement could work</h2>
          <p className="lede">A proposed framework in five steps.</p>
          <ol className="steps" style={{ marginTop: 24 }}>{APPROACH.map(([t, d]) => <li key={t}><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
          <p style={{ marginTop: 22 }}><Link href="/approach" className="btn ghost">See the full approach</Link></p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2>Insights</h2>
          {posts.length === 0 ? (
            <p className="lede">Articles on business development, customer experience, people and strategy are on the way.</p>
          ) : (
            <div className="grid g3" style={{ marginTop: 24 }}>
              {posts.map((p) => (
                <article className="card" key={p.slug}><h3>{p.title}</h3><p>{p.excerpt}</p><Link className="btn ghost sm" href={`/insights/${p.slug}`}>Read article</Link></article>
              ))}
            </div>
          )}
          <p style={{ marginTop: 22 }}><Link href="/insights" className="btn ghost">All insights</Link></p>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Talk to us about your organisation</h2>
          <p>Tell us what you are working on and we will come back to you through your preferred contact method.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link href="/contact#consultation" className="btn light">Request a consultation</Link>
            <Link href="/contact" className="btn outline-light">Send an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
