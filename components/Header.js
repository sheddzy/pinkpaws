'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [['/', 'Home'], ['/about', 'About Us'], ['/services', 'Our Services'], ['/approach', 'Our Approach'], ['/insights', 'Insights'], ['/contact', 'Contact Us']];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Pink Paws Groomers logo" width={44} height={44} priority /> Pink Paws Groomers
        </Link>
        <button className="burger" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        <nav id="nav" className={'nav' + (open ? ' open' : '')} aria-label="Main">
          {LINKS.map(([h, t]) => (
            <Link key={h} href={h} aria-current={path === h || (h !== '/' && path.startsWith(h)) ? 'page' : undefined} onClick={() => setOpen(false)}>{t}</Link>
          ))}
          <Link href="/contact#consultation" className="btn sm" onClick={() => setOpen(false)}>Request a consultation</Link>
        </nav>
      </div>
    </header>
  );
}
