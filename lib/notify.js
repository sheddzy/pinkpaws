import { admin } from '@/lib/supabase';
import { getSettings, siteUrl } from '@/lib/content';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const when = (d) => new Date(d).toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' }) + ' (WAT)';
export const refOf = (e) => 'PP-' + String(e.ref_no).padStart(5, '0');

async function sendEmail(e, s) {
  if (s.email_enabled === 'false') return { status: 'skipped', error: 'Email notifications are switched off in Settings.' };
  const to = (s.notification_email || process.env.NOTIFY_EMAIL || '').trim();
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !to)
    return { status: 'skipped', error: 'Email is not configured (RESEND_API_KEY, EMAIL_FROM and a notification email are required).' };
  const link = `${siteUrl()}/admin/enquiries/${e.id}`;
  const text = [
    `New ${e.kind} ${refOf(e)}`, '',
    `Name: ${e.name}`, `Organisation: ${e.business_name || 'Not given'}`, `Email: ${e.email}`, `Phone/WhatsApp: ${e.phone}`,
    `Preferred contact: ${e.preferred_contact}`, e.preferred_time ? `Preferred time: ${e.preferred_time}` : null,
    `Service: ${e.service}`, `Subject: ${e.subject}`, `Submitted: ${when(e.created_at)}`, '', e.message, '', `Open in dashboard: ${link}`,
  ].filter((x) => x !== null).join('\n');
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="color:#4A0630">New ${esc(e.kind)} ${refOf(e)}</h2>
  <p><b>Name:</b> ${esc(e.name)}<br><b>Organisation:</b> ${esc(e.business_name || 'Not given')}<br><b>Email:</b> ${esc(e.email)}<br><b>Phone/WhatsApp:</b> ${esc(e.phone)}<br><b>Preferred contact:</b> ${esc(e.preferred_contact)}${e.preferred_time ? `<br><b>Preferred time:</b> ${esc(e.preferred_time)}` : ''}<br><b>Service:</b> ${esc(e.service)}<br><b>Subject:</b> ${esc(e.subject)}<br><b>Submitted:</b> ${esc(when(e.created_at))}</p>
  <p style="white-space:pre-wrap;border-left:3px solid #F5047E;padding-left:12px">${esc(e.message)}</p><p><a href="${link}">Open in dashboard</a></p></div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], reply_to: e.email, subject: `[${refOf(e)}] ${e.subject}`, text, html }),
    signal: AbortSignal.timeout(8000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { status: 'failed', error: `Resend ${r.status}: ${j.message || 'request rejected'}` };
  return { status: 'sent', ref: j.id };
}

async function sendWhatsApp(e, s) {
  if (s.wa_enabled === 'false') return { status: 'skipped', error: 'WhatsApp notifications are switched off in Settings.' };
  const to = String(s.whatsapp_number || '').replace(/\D/g, '');
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID || !to)
    return { status: 'skipped', error: 'WhatsApp API is not configured (WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID and a WhatsApp number are required).' };
  const one = (t, n) => String(t).replace(/\s+/g, ' ').slice(0, n);
  const link = `${siteUrl()}/admin/enquiries/${e.id}`;
  const summary = one(e.message, 160);
  const body = process.env.WHATSAPP_TEMPLATE_NAME
    ? { messaging_product: 'whatsapp', to, type: 'template', template: { name: process.env.WHATSAPP_TEMPLATE_NAME, language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
        components: [{ type: 'body', parameters: [one(e.name, 60), one(e.phone, 30), one(e.service, 60), summary, one(when(e.created_at), 40), link].map((text) => ({ type: 'text', text })) }] } }
    : { messaging_product: 'whatsapp', to, type: 'text', text: { preview_url: false, body: `New ${e.kind} ${refOf(e)}\nName: ${e.name}\nPhone: ${e.phone}\nService: ${e.service}\n${summary}\n${when(e.created_at)}\n${link}` } };
  const r = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return { status: 'failed', error: `WhatsApp ${r.status}: ${j.error?.message || 'request rejected'}` };
  return { status: 'sent', ref: j.messages?.[0]?.id };
}

// One row per enquiry and channel (unique constraint), so retries never create duplicates.
export async function processNotifications(id, channels = ['email', 'whatsapp']) {
  const db = admin();
  const { data: e } = await db.from('enquiries').select('*').eq('id', id).single();
  if (!e) return;
  const s = await getSettings();
  for (const channel of channels) {
    let r;
    try { r = channel === 'email' ? await sendEmail(e, s) : await sendWhatsApp(e, s); }
    catch (err) { r = { status: 'failed', error: String(err.message || err) }; }
    const { data: prev } = await db.from('notifications').select('attempts').eq('enquiry_id', id).eq('channel', channel).maybeSingle();
    await db.from('notifications').upsert(
      { enquiry_id: id, channel, status: r.status, provider_ref: r.ref || null, error: r.error || null, attempts: (prev?.attempts || 0) + 1, updated_at: new Date().toISOString() },
      { onConflict: 'enquiry_id,channel' });
  }
}
