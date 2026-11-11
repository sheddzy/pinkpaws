import { getContent } from '@/lib/content';
import { saveContent } from '../../actions';

const FIELDS = [
  ['hero_headline', 'Homepage headline', 2], ['hero_text', 'Homepage introduction', 3], ['brand_statement', 'Brand statement', 2], ['about_company', 'Company description', 5],
  ['mission', 'Mission (draft)', 3], ['vision', 'Vision (draft)', 3], ['values', 'Core values (one per line)', 6],
  ['service_0_desc', 'Customer Service Consulting description', 4], ['service_1_desc', 'Attitude Development description', 4],
  ['service_2_desc', 'Business and NGO Start-up description', 4], ['service_3_desc', 'Strategy and Sustainability description', 4],
];

export default async function Content({ searchParams: sp }) {
  const c = await getContent();
  return (
    <>
      <h1>Site text</h1>
      <p>Edit the main wording of the website. Saved text appears on the public site straight away. Clear a box and save to restore the original wording.</p>
      {sp.saved && <div className="ok" role="status">Site text saved.</div>}
      <form action={saveContent} className="panel form" style={{ marginTop: 16 }}>
        {FIELDS.map(([k, l, r]) => <label key={k}>{l}<textarea name={k} defaultValue={c[k]} rows={r} style={{ minHeight: 0 }} /></label>)}
        <div><button className="btn" type="submit">Save site text</button></div>
      </form>
    </>
  );
}
