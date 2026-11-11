import Link from 'next/link';
import { APPROACH } from '@/lib/content';

export const metadata = {
  title: 'Our Approach',
  description: 'A proposed five step consulting engagement framework from Pink Paws Groomers: understand, identify, recommend, implement where agreed, and review.',
  alternates: { canonical: '/approach' },
};

export default function Approach() {
  return (
    <>
      <section className="pagehead"><div className="wrap"><h1>Our Approach</h1><p className="lede">A proposed framework for working together.</p></div></section>
      <section className="sec">
        <div className="wrap">
          <span className="draft">Proposed framework, not a verified company methodology</span>
          <ol className="steps">{APPROACH.map(([t, d]) => <li key={t}><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol>
          <p style={{ marginTop: 28 }}><Link href="/contact#consultation" className="btn">Request a consultation</Link></p>
        </div>
      </section>
    </>
  );
}
