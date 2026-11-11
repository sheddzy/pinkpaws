import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { admin } from '@/lib/supabase';
import { SERVICE_NAMES } from '@/lib/content';
import { processNotifications, refOf } from '@/lib/notify';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (v, n) => String(v ?? '').replace(/\u0000/g, '').trim().slice(0, n);

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }); }

  // Spam traps: hidden field must be empty, and a real person needs a few seconds to fill the form.
  if (b.website) return NextResponse.json({ ok: true, ref: 'PP-00000' });
  if (!Number.isFinite(b.elapsed) || b.elapsed < 3000) return NextResponse.json({ ok: false, error: 'Please take a moment to review the form and send again.' }, { status: 400 });

  const d = {
    kind: b.kind === 'consultation' ? 'consultation' : 'enquiry',
    name: clean(b.name, 100), business_name: clean(b.business_name, 150) || null, email: clean(b.email, 150).toLowerCase(),
    phone: clean(b.phone, 25), service: clean(b.service, 80), subject: clean(b.subject, 150), message: clean(b.message, 3000),
    preferred_contact: clean(b.preferred_contact, 20), preferred_time: clean(b.preferred_time, 100) || null,
  };
  const f = {};
  if (d.name.length < 2) f.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) f.email = 'Enter a valid email address.';
  if (!/^[+\d][\d\s\-()]{6,24}$/.test(d.phone)) f.phone = 'Enter a valid phone or WhatsApp number.';
  if (!SERVICE_NAMES.includes(d.service)) f.service = 'Choose a service.';
  if (d.subject.length < 3) f.subject = 'Enter a subject.';
  if (d.message.length < 10) f.message = 'Please write at least a short sentence.';
  if (!['Email', 'Phone call', 'WhatsApp'].includes(d.preferred_contact)) d.preferred_contact = 'Email';
  if (!UUID.test(String(b.submission_key))) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  if (Object.keys(f).length) return NextResponse.json({ ok: false, error: 'Please correct the highlighted fields.', fields: f }, { status: 422 });

  const db = admin();
  const ip = (req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const ip_hash = createHash('sha256').update(ip + (process.env.IP_SALT || 'pp')).digest('hex');

  // Retry of an already saved submission: return it without creating or notifying again.
  const existing = await db.from('enquiries').select('ref_no').eq('submission_key', b.submission_key).maybeSingle();
  if (existing.data) return NextResponse.json({ ok: true, ref: refOf(existing.data) });

  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await db.from('enquiries').select('id', { count: 'exact', head: true }).eq('ip_hash', ip_hash).gte('created_at', since);
  if ((count || 0) >= 5) return NextResponse.json({ ok: false, error: 'Too many submissions from your connection. Please try again later.' }, { status: 429 });

  const { data, error } = await db.from('enquiries').insert({ ...d, submission_key: b.submission_key, ip_hash }).select('id,ref_no').single();
  if (error) {
    if (error.code === '23505') { const again = await db.from('enquiries').select('ref_no').eq('submission_key', b.submission_key).single(); return NextResponse.json({ ok: true, ref: refOf(again.data) }); }
    console.error('enquiry insert failed', error.message);
    return NextResponse.json({ ok: false, error: 'We could not save your enquiry. Please try again in a moment.' }, { status: 500 });
  }

  // Saved first. Notification failures are recorded and never lose the enquiry.
  try { await processNotifications(data.id); } catch (e) { console.error('notify failed', e); }
  return NextResponse.json({ ok: true, ref: refOf(data) });
}
