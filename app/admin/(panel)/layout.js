import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase';
import { logout } from '../actions';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Panel({ children }) {
  const user = await requireAdmin();
  return (
    <div className="adm">
      <div className="bar"><div className="wrap">
        <b>Pink Paws admin</b>
        <Link href="/admin">Dashboard</Link><Link href="/admin/enquiries">Enquiries</Link><Link href="/admin/articles">Articles</Link>
        <Link href="/admin/content">Site text</Link><Link href="/admin/settings">Settings</Link>
        <span className="sp" /><Link href="/" target="_blank">View site</Link>
        <form action={logout}><button className="btn light sm" type="submit" title={user.email}>Sign out</button></form>
      </div></div>
      <main><div className="wrap">{children}</div></main>
    </div>
  );
}
