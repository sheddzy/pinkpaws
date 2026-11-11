import Link from 'next/link';
import { notFound } from 'next/navigation';
import { admin } from '@/lib/supabase';
import { saveArticle, deleteArticle } from '../../../actions';

const ERR = { title: 'Enter a title.', image: 'Image must be a JPG, PNG or WebP under 4 MB.', upload: 'The image could not be uploaded. Try again.', slug: 'Another article already uses that URL. Change the URL slug.', save: 'The article could not be saved. Try again.' };

export default async function Editor({ params, searchParams: sp }) {
  const db = admin();
  const isNew = params.id === 'new';
  let a = { title: '', slug: '', excerpt: '', body: '', category_id: '', featured_image_url: '', status: 'draft' };
  if (!isNew) { const { data } = await db.from('articles').select('*').eq('id', params.id).maybeSingle(); if (!data) notFound(); a = data; }
  const { data: cats } = await db.from('categories').select('id,name').order('name');
  return (
    <>
      <p><Link href="/admin/articles">Back to articles</Link></p>
      <h1>{isNew ? 'New article' : 'Edit article'}</h1>
      {sp.saved && <div className="ok" role="status">Article saved.</div>}
      {sp.e && <div className="bad" role="alert">{ERR[sp.e] || ERR.save}</div>}
      <form action={saveArticle} className="panel form" style={{ marginTop: 16 }}>
        <input type="hidden" name="id" value={isNew ? 'new' : a.id} />
        <input type="hidden" name="current_image" value={a.featured_image_url || ''} />
        <label>Title<input name="title" defaultValue={a.title} required maxLength={200} /></label>
        <div className="two">
          <label>URL slug <small>(leave empty to use the title)</small><input name="slug" defaultValue={a.slug} maxLength={100} /></label>
          <label>Category<select name="category_id" defaultValue={a.category_id || ''}><option value="">None</option>{(cats || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        </div>
        <label>Summary <small>(shown in lists and search results)</small><textarea name="excerpt" defaultValue={a.excerpt || ''} maxLength={400} style={{ minHeight: 80 }} /></label>
        <label>Article text <small>Separate paragraphs with a blank line. Start a line with ## for a heading, ### for a subheading, or - for a list.</small>
          <textarea name="body" defaultValue={a.body} style={{ minHeight: 360 }} /></label>
        <label>Featured image <small>JPG, PNG or WebP, up to 4 MB</small><input type="file" name="image" accept="image/jpeg,image/png,image/webp" /></label>
        {a.featured_image_url && <div><img src={a.featured_image_url} alt="Current featured" style={{ maxWidth: 260, borderRadius: 10 }} /><br /><label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 400 }}><input type="checkbox" name="remove_image" style={{ width: 'auto' }} /> Remove the current image</label></div>}
        <label>Status<select name="status" defaultValue={a.status}><option value="draft">Draft (not visible on the site)</option><option value="published">Published</option></select></label>
        <div><button className="btn" type="submit">Save article</button></div>
      </form>
      {!isNew && <form action={deleteArticle} style={{ marginTop: 18 }}><input type="hidden" name="id" value={a.id} /><button className="btn ghost sm" type="submit">Delete this article</button></form>}
    </>
  );
}
