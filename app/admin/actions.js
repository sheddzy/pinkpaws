'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin, sessionClient, requireAdmin } from '@/lib/supabase';
import { processNotifications } from '@/lib/notify';
import { slugify, DEFAULTS } from '@/lib/content';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Completed', 'Closed'];
const s = (f, k, n = 5000) => String(f.get(k) ?? '').trim().slice(0, n);

export async function login(formData) {
  const { error } = await sessionClient().auth.signInWithPassword({ email: s(formData, 'email', 200), password: String(formData.get('password') || '') });
  if (error) redirect('/admin/login?e=bad');
  redirect('/admin');
}

export async function logout() {
  await sessionClient().auth.signOut();
  redirect('/admin/login');
}

export async function updateEnquiry(formData) {
  await requireAdmin();
  const id = s(formData, 'id', 60), status = s(formData, 'status', 20);
  if (!STATUSES.includes(status)) return;
  await admin().from('enquiries').update({ status, internal_notes: s(formData, 'internal_notes', 5000) || null }).eq('id', id);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/enquiries/${id}?saved=1`);
}

export async function retryNotification(formData) {
  await requireAdmin();
  const id = s(formData, 'id', 60), channel = s(formData, 'channel', 10);
  if (!['email', 'whatsapp'].includes(channel)) return;
  await processNotifications(id, [channel]);
  revalidatePath(`/admin/enquiries/${id}`);
  redirect(`/admin/enquiries/${id}?retried=${channel}`);
}

export async function saveSettings(formData) {
  await requireAdmin();
  const rows = [
    ['notification_email', s(formData, 'notification_email', 150)],
    ['whatsapp_number', s(formData, 'whatsapp_number', 25).replace(/[^\d+]/g, '')],
    ['email_enabled', formData.get('email_enabled') ? 'true' : 'false'],
    ['wa_enabled', formData.get('wa_enabled') ? 'true' : 'false'],
  ].map(([key, value]) => ({ key, value }));
  await admin().from('settings').upsert(rows, { onConflict: 'key' });
  redirect('/admin/settings?saved=1');
}

export async function saveContent(formData) {
  await requireAdmin();
  const rows = Object.keys(DEFAULTS).map((key) => ({ key, value: s(formData, key, 4000) }));
  await admin().from('site_content').upsert(rows, { onConflict: 'key' });
  revalidatePath('/', 'layout');
  redirect('/admin/content?saved=1');
}

export async function saveArticle(formData) {
  await requireAdmin();
  const db = admin();
  const id = s(formData, 'id', 60);
  const title = s(formData, 'title', 200);
  if (!title) redirect(`/admin/articles/${id || 'new'}?e=title`);
  let slug = slugify(s(formData, 'slug', 100) || title);
  const status = s(formData, 'status', 10) === 'published' ? 'published' : 'draft';
  let image = s(formData, 'current_image', 1000) || null;
  const file = formData.get('image');
  if (file && typeof file === 'object' && file.size > 0) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 4 * 1024 * 1024) redirect(`/admin/articles/${id || 'new'}?e=image`);
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
    const path = `${Date.now()}-${slug}.${ext}`;
    const up = await db.storage.from('article-images').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
    if (up.error) redirect(`/admin/articles/${id || 'new'}?e=upload`);
    image = db.storage.from('article-images').getPublicUrl(path).data.publicUrl;
  }
  if (formData.get('remove_image')) image = null;
  const row = { title, slug, excerpt: s(formData, 'excerpt', 400) || null, body: s(formData, 'body', 60000), category_id: s(formData, 'category_id', 60) || null, featured_image_url: image, status, updated_at: new Date().toISOString() };
  let saved;
  if (id && id !== 'new') {
    const { data: cur } = await db.from('articles').select('published_at').eq('id', id).single();
    if (status === 'published' && !cur?.published_at) row.published_at = new Date().toISOString();
    if (status === 'draft') row.published_at = null;
    saved = await db.from('articles').update(row).eq('id', id).select('id').single();
  } else {
    if (status === 'published') row.published_at = new Date().toISOString();
    saved = await db.from('articles').insert(row).select('id').single();
  }
  if (saved.error) redirect(`/admin/articles/${id || 'new'}?e=${saved.error.code === '23505' ? 'slug' : 'save'}`);
  revalidatePath('/insights'); revalidatePath('/', 'layout');
  redirect(`/admin/articles/${saved.data.id}?saved=1`);
}

export async function deleteArticle(formData) {
  await requireAdmin();
  await admin().from('articles').delete().eq('id', s(formData, 'id', 60));
  revalidatePath('/insights');
  redirect('/admin/articles?deleted=1');
}

export async function addCategory(formData) {
  await requireAdmin();
  const name = s(formData, 'name', 80);
  if (name) await admin().from('categories').insert({ name, slug: slugify(name) });
  redirect('/admin/articles');
}

export async function deleteCategory(formData) {
  await requireAdmin();
  await admin().from('categories').delete().eq('id', s(formData, 'id', 60));
  redirect('/admin/articles');
}
