export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { SERVICES, getContent } from '@/lib/content';
import Visual from '@/components/Visual';

export const metadata = {
  title: 'Our Services',
  description: 'Customer service consulting, attitude development, business and NGO start-up, and strategy and sustainability consulting from Pink Paws Groomers in Lagos.',
  alternates: { canonical: '/services' },
};

export default async function Services() {
  const c = await getContent();
  return (
    <>
      <section className="pagehead"><div className="wrap"><h1>Our Services</h1><p className="lede">Four areas of consulting support.</p></div></section>
      {SERVICES.map((s, i) => (
        <section className="svc" id={s.slug} key={s.slug}>
          <div className="wrap split" style={i % 2 ? { direction: 'rtl' } : undefined}>
            <div style={{ direction: 'ltr' }}>
              <h2>{s.name}</h2>
              <p>{c[`service_${i}_desc`]}</p>
              <h3>Areas of focus</h3>
              <ul className="ticks">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <h3>Why it matters</h3>
              <p>{s.relevance}</p>
              <Link className="btn" href={`/contact?service=${encodeURIComponent(s.name)}#enquiry`}>Enquire about {s.name}</Link>
            </div>
            <div style={{ direction: 'ltr' }}><Visual id={s.slug} alt={`${s.name}`} label={s.name} tall /></div>
          </div>
        </section>
      ))}
    </>
  );
}
