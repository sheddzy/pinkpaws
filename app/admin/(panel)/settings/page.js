import { getSettings } from '@/lib/content';
import { saveSettings } from '../../actions';

export default async function Settings({ searchParams: sp }) {
  const s = await getSettings();
  const has = (k) => Boolean(process.env[k]);
  const rows = [['Resend API key', has('RESEND_API_KEY')], ['Email sender address', has('EMAIL_FROM')], ['WhatsApp access token', has('WHATSAPP_TOKEN')], ['WhatsApp phone number ID', has('WHATSAPP_PHONE_NUMBER_ID')], ['WhatsApp message template', has('WHATSAPP_TEMPLATE_NAME')]];
  return (
    <>
      <h1>Notification settings</h1>
      {sp.saved && <div className="ok" role="status">Settings saved.</div>}
      <div className="grid g2" style={{ alignItems: 'start', marginTop: 16 }}>
        <form action={saveSettings} className="panel form">
          <label>Notification email address<input name="notification_email" type="email" defaultValue={s.notification_email || ''} placeholder="Dedicated business email" /></label>
          <label>WhatsApp Business number <small>International format, for example 2348012345678</small><input name="whatsapp_number" defaultValue={s.whatsapp_number || ''} /></label>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 400 }}><input type="checkbox" name="email_enabled" defaultChecked={s.email_enabled !== 'false'} style={{ width: 'auto' }} /> Send email notifications</label>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 400 }}><input type="checkbox" name="wa_enabled" defaultChecked={s.wa_enabled !== 'false'} style={{ width: 'auto' }} /> Send WhatsApp notifications</label>
          <div><button className="btn" type="submit">Save settings</button></div>
        </form>
        <div className="panel">
          <h3>Provider credentials</h3>
          <p>For security, keys live in the hosting environment variables and are never stored in the database or shown here. This list only shows whether each one is set.</p>
          <ul className="ticks" style={{ marginBottom: 0 }}>{rows.map(([n, ok]) => <li key={n}>{n}: <b style={{ color: ok ? '#14532d' : '#7a1313' }}>{ok ? 'set' : 'missing'}</b></li>)}</ul>
        </div>
      </div>
    </>
  );
}
