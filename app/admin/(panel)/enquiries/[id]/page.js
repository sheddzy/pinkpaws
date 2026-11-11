import Link from 'next/link';
import { notFound } from 'next/navigation';
import { admin } from '@/lib/supabase';
import { refOf } from '@/lib/notify';
import { updateEnquiry, retryNotification } from '../../../actions';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'];

export default async function Detail({ params, searchParams: sp }) {
  const { data: e } = await admin().from('enquiries').select('*, notifications(*)').eq('id', params.id).maybeSingle();
  if (!e) notFound();
  const wa = e.phone.replace(/\D/g, '');
  const label = { email: 'Email', whatsapp: 'WhatsApp' };
  return (
    <>
      <p><Link href="/admin/enquiries">Back to enquiries</Link></p>
      <h1>{refOf(e)}: {e.subject}</h1>
      {sp.saved && <div className="ok" role="status">Changes saved.</div>}
      {sp.retried && <div className="ok" role="status">Retry attempted for {label[sp.retried]}. See the result below.</div>}
      <div className="grid g2" style={{ marginTop: 18, alignItems: 'start' }}>
        <div className="panel">
          <h3>Enquiry ({e.kind})</h3>
          <p><b>Name:</b> {e.name}<br /><b>Organisation:</b> {e.business_name || 'Not given'}<br /><b>Service:</b> {e.service}<br />
            <b>Preferred contact:</b> {e.preferred_contact}{e.preferred_time && <><br /><b>Preferred time:</b> {e.preferred_time}</>}<br />
            <b>Received:</b> {new Date(e.created_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>
          <p style={{ whiteSpace: 'pre-wrap', borderLeft: '3px solid #F5047E', paddingLeft: 12 }}>{e.message}</p>
          <h3>Follow up</h3>
          <div className="row">
            <a className="btn sm" href={`mailto:${e.email}?subject=${encodeURIComponent('Re: ' + e.subject)}`}>Email {e.email}</a>
            <a className="btn ghost sm" href={`tel:${e.phone.replace(/[^\d+]/g, '')}`}>Call {e.phone}</a>
            <a className="btn wa sm" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div>
          <form action={updateEnquiry} className="panel form">
            <input type="hidden" name="id" value={e.id} />
            <h3>Status and notes</h3>
            <label>Status<select name="status" defaultValue={e.status}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Internal notes<textarea name="internal_notes" defaultValue={e.internal_notes || ''} /></label>
            <div><button className="btn" type="submit">Save changes</button></div>
          </form>
          <div className="panel" style={{ marginTop: 22 }}>
            <h3>Notifications</h3>
            <p style={{ fontSize: '.9rem', color: '#6a6470' }}>Sent means the provider accepted the message. It is not proof of reading.</p>
            {['email', 'whatsapp'].map((ch) => {
              const n = e.notifications.find((x) => x.channel === ch);
              return (
                <div key={ch} style={{ borderTop: '1px solid #ecdde5', padding: '12px 0' }}>
                  <b>{label[ch]}</b> <span className={`pill ${n?.status || 'pending'}`}>{n?.status || 'not attempted'}</span>
                  {n && <small style={{ display: 'block' }}>Attempts: {n.attempts}. Last: {new Date(n.updated_at).toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</small>}
                  {n?.error && <small style={{ display: 'block', color: '#7a1313' }}>{n.error}</small>}
                  <form action={retryNotification} style={{ marginTop: 8 }}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="channel" value={ch} />
                    <button className="btn ghost sm" type="submit">{n?.status === 'sent' ? 'Send again' : 'Retry'}</button></form>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
