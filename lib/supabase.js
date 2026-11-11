import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const noStore = (u, o) => fetch(u, { ...o, cache: 'no-store' });

// Service role client. Server only. Bypasses row level security.
export function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    global: { fetch: noStore },
  });
}

// Cookie based client for the signed-in administrator.
export function sessionClient() {
  const store = cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {} },
    },
  });
}

export async function requireAdmin() {
  const { data: { user } } = await sessionClient().auth.getUser();
  if (!user) redirect('/admin/login');
  const { data } = await admin().from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!data) redirect('/admin/login?e=denied');
  return user;
}
