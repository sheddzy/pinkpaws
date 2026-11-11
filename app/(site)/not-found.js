import Link from 'next/link';
export default function NotFound() {
  return <section className="sec"><div className="wrap"><h1>Page not found</h1><p>The page you are looking for does not exist or has moved.</p><Link className="btn" href="/">Back to the homepage</Link></div></section>;
}
