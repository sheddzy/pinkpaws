import Link from 'next/link';
import Image from 'next/image';
import { SERVICES, SITE } from '@/lib/content';

export default function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const li = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/pink-paws/';
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="grid g4">
          <div>
            <Image src="/logo.png" alt="Pink Paws Groomers logo" width={56} height={56} style={{ background: '#fdeaf3', borderRadius: 12, padding: 4 }} />
            <p style={{ marginTop: 14 }}>{SITE.tagline}</p>
            <p>Business consulting, Lekki, Lagos.</p>
          </div>
          <div><h4>Company</h4><ul>
            <li><Link href="/about">About Us</Link></li><li><Link href="/approach">Our Approach</Link></li>
            <li><Link href="/insights">Insights</Link></li><li><Link href="/contact">Contact Us</Link></li></ul></div>
          <div><h4>Services</h4><ul>{SERVICES.map((s) => <li key={s.slug}><Link href={`/services#${s.slug}`}>{s.name}</Link></li>)}</ul></div>
          <div><h4>Get in touch</h4><ul>
            <li>{SITE.location}</li>
            <li>{email ? <a href={`mailto:${email}`}>{email}</a> : 'Business email: to be confirmed'}</li>
            <li><a href={li} target="_blank" rel="noopener noreferrer">LinkedIn</a></li></ul></div>
        </div>
        <div className="fine">&copy; {new Date().getFullYear()} Pink Paws Groomers. All rights reserved.</div>
      </div>
    </footer>
  );
}
