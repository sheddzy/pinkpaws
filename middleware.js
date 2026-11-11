import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// Keeps the administrator session fresh on /admin routes.
export async function middleware(req) {
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return res;
  const sb = createServerClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  await sb.auth.getUser();
  return res;
}
export const config = { matcher: ['/admin/:path*'] };
