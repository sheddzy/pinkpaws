import Link from 'next/link';
import { admin } from '@/lib/supabase';
import { SERVICE_NAMES } from '@/lib/content';
import { refOf } from '@/lib/notify';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'];

export default async function Enquiries({ searchParams: sp }) {
  const q = String(sp.q || '').replace(/[,()%]/g, ' ').trim();
  let query = admin().from('enquiries').select('id,ref_no,name,business_name,email,service,subject,status,kind,created_at,notifications(channel,status)').order('created_at', { ascending: false }).limit(300);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,business_name.ilike.%${q}%,subject.ilike.%${q}%,message.ilike.%${q}%`);
  if (SERVICE_NAMES.includes(sp.service)) query = query.eq('service', sp.service);
  if (STATUSES.includes(sp.status)) query = query.eq('status', sp.status);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sp.from || '')) query = query.gte('created_at', `${sp.from}T00:00:00+01:00`);
  if (/^\d{4}-\d{2}-\d{2}$/.test(sp.to || '')) query = query.lte('created_at', `${sp.to}T23:59:59+01:00`);
  const { data } = await query;
  const st = (e, ch) => e.notifications?.find((n) => n.channel === ch)?.status || 'pending';
  return (
    <>
      <h1>Enquiries</h1>
      <form className="search" action="/admin/enquiries">
        <input name="q" defaultValue={q} placeholder="Search name, email, subject or message" aria-label="Search" />
        <select name="service" defaultValue={sp.service || ''} aria-label="Service"><option value="">All services</option>{SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}</select>
        <select name="status" defaultValue={sp.status || ''} aria-label="Status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>From<input type="date" name="from" defaultValue={sp.from || ''} style={{ width: 'auto' }} /></label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>To<input type="date" name="to" defaultValue={sp.to || ''} style={{ width: 'auto' }} /></label>
        <button className="btn sm" type="submit">Filter</button><Link className="btn ghost sm" href="/admin/enquiries">Clear</Link>
      </form>
      {(data || []).length === 0 ? <p>No enquiries match these filters.</p> : (
        <div className="scroll"><table><thead><tr><th>Ref</th><th>Name</th><th>Service</th><th>Subject</th><th>Status</th><th>Email</th><th>WhatsApp</th><th>Received</th><th></th></tr></thead><tbody>
          {data.map((e) => (<tr key={e.id}><td>{refOf(e)}</td><td>{e.name}<br /><small>{e.business_name}</small></td><td>{e.service}</td><td>{e.subject}</td>
            <td><span className={`pill ${e.status}`}>{e.status}</span></td><td><span className={`pill ${st(e, 'email')}`}>{st(e, 'email')}</span></td><td><span className={`pill ${st(e, 'whatsapp')}`}>{st(e, 'whatsapp')}</span></td>
            <td>{new Date(e.created_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })}</td><td><Link href={`/admin/enquiries/${e.id}`}>Open</Link></td></tr>))}
        </tbody></table></div>
      )}
    </>
  );
}
