import { admin } from '@/lib/supabase';
import { DEFAULTS } from '@/lib/data';
export * from '@/lib/data';

export async function getContent() {
  try {
    const { data } = await admin().from('site_content').select('key,value');
    const out = { ...DEFAULTS };
    (data || []).forEach((r) => { if (r.value && r.value.trim()) out[r.key] = r.value; });
    return out;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function getSettings() {
  try {
    const { data } = await admin().from('settings').select('key,value');
    const s = { email_enabled: 'true', wa_enabled: 'true' };
    (data || []).forEach((r) => { s[r.key] = r.value; });
    return s;
  } catch {
    return { email_enabled: 'true', wa_enabled: 'true' };
  }
}

