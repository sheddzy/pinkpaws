import Link from 'next/link';
import { admin } from '@/lib/supabase';
import { addCategory, deleteCategory } from '../../actions';

export default async function Articles({ searchParams: sp }) {
  const db = admin();
  const { data: posts } = await db.from('articles').select('id,title,slug,status,updated_at,categories(name)').order('updated_at', { ascending: false });
  const { data: cats } = await db.from('categories').select('*').order('name');
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between' }}><h1>Articles</h1><Link className="btn" href="/admin/articles/new">New article</Link></div>
      {sp.deleted && <div className="ok" role="status">Article deleted.</div>}
      {(posts || []).length === 0 ? <p>No articles yet. Create the first one to see it here.</p> : (
        <div className="scroll"><table><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>
          {posts.map((p) => (<tr key={p.id}><td>{p.title}</td><td>{p.categories?.name || 'None'}</td><td><span className={`pill ${p.status === 'published' ? 'sent' : 'skipped'}`}>{p.status}</span></td>
            <td>{new Date(p.updated_at).toLocaleDateString('en-NG')}</td><td><Link href={`/admin/articles/${p.id}`}>Edit</Link>{p.status === 'published' && <> | <Link href={`/insights/${p.slug}`} target="_blank">View</Link></>}</td></tr>))}
        </tbody></table></div>
      )}
      <div className="panel" style={{ marginTop: 28 }}>
        <h3>Categories</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>{(cats || []).map((c) => (
          <li key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>{c.name}
            <form action={deleteCategory}><input type="hidden" name="id" value={c.id} /><button className="btn ghost sm" type="submit">Delete</button></form></li>))}</ul>
        <form action={addCategory} className="row"><input name="name" placeholder="New category name" required style={{ maxWidth: 320 }} aria-label="New category name" /><button className="btn sm" type="submit">Add category</button></form>
        <small>Deleting a category keeps its articles and leaves them uncategorised.</small>
      </div>
    </>
  );
}
