import Link from 'next/link';
import { admin } from '@/lib/supabase';
import { SERVICE_NAMES } from '@/lib/content';
import { refOf } from '@/lib/notify';

export default async function Dashboard() {
  const db = admin();
  const { data: all } = await db.from('enquiries').select('status,service');
  const { data: recent } = await db.from('enquiries').select('id,ref_no,name,service,subject,status,created_at,notifications(channel,status)').order('created_at', { ascending: false }).limit(8);
  const rows = all || [];
  const n = (st) => rows.filter((r) => r.status === st).length;
  const inProg = n('In Progress') + n('Contacted');
  const byService = SERVICE_NAMES.map((name) => [name, rows.filter((r) => r.service === name).length]);
  const max = Math.max(1, ...byService.map((x) => x[1]));
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <Link className="stat" href="/admin/enquiries"><b>{rows.length}</b><span>Total enquiries</span></Link>
        <Link className="stat" href="/admin/enquiries?status=New"><b>{n('New')}</b><span>New</span></Link>
        <Link className="stat" href="/admin/enquiries?status=In Progress"><b>{inProg}</b><span>Contacted or in progress</span></Link>
        <Link className="stat" href="/admin/enquiries?status=Completed"><b>{n('Completed')}</b><span>Completed</span></Link>
      </div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <h3>Enquiries by service</h3>
        <div className="bars">{byService.map(([name, c]) => <div key={name}><span>{name}</span><i style={{ width: `${(c / max) * 100}%`, minWidth: c ? 6 : 0 }} /><b>{c}</b></div>)}</div>
      </div>
      <h3>Recent enquiries</h3>
      {(recent || []).length === 0 ? <p>No enquiries yet. New submissions from the website will appear here.</p> : (
        <div className="scroll"><table><thead><tr><th>Ref</th><th>Name</th><th>Service</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>
          {recent.map((e) => (<tr key={e.id}><td>{refOf(e)}</td><td>{e.name}</td><td>{e.service}</td><td><span className={`pill ${e.status}`}>{e.status}</span></td>
            <td>{new Date(e.created_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</td><td><Link href={`/admin/enquiries/${e.id}`}>Open</Link></td></tr>))}
        </tbody></table></div>
      )}
    </>
  );
}
