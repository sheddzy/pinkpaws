export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getContent, SITE } from '@/lib/content';
import Visual from '@/components/Visual';

export const metadata = {
  title: 'About Us',
  description: 'Pink Paws Groomers is a Lagos business consulting firm established in 2014, working on customer service, attitude development, start-up, strategy and sustainability.',
  alternates: { canonical: '/about' },
};

export default async function About() {
  const c = await getContent();
  const values = c.values.split('\n').map((v) => v.trim()).filter(Boolean);
  return (
    <>
      <section className="pagehead"><div className="wrap"><h1>About Us</h1><p className="lede">A diverse consulting firm built around people, service and sustainable growth.</p></div></section>
      <section className="sec">
        <div className="wrap split">
          <div>
            <h2>Company profile</h2>
            <p>{c.about_company}</p>
            <ul className="ticks">
              <li>Established {SITE.established}</li><li>Based in {SITE.location}</li><li>Industry: Business Consulting and Services</li><li>Small team of 2 to 10 people</li>
            </ul>
          </div>
          <Visual id="about" alt="Consultants in a planning meeting" label="Consulting in practice" tall />
        </div>
      </section>
      <section className="sec alt">
        <div className="wrap">
          <span className="draft">Draft wording, awaiting confirmation by the company</span>
          <div className="grid g2">
            <div className="card"><h3>Our mission</h3><p>{c.mission}</p></div>
            <div className="card"><h3>Our vision</h3><p>{c.vision}</p></div>
          </div>
          <h2 style={{ marginTop: 44 }}>Core values</h2>
          <div className="grid g4">{values.map((v) => <div className="card" key={v}><h3>{v}</h3></div>)}</div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <h2>Where we sit</h2>
          <p>{c.brand_statement}</p>
          <p>We are a consulting partner for organisations that want to look after their customers, develop their people, start something new or plan for the long term.</p>
          <Link href="/contact" className="btn">Contact us</Link>
        </div>
      </section>
    </>
  );
}
