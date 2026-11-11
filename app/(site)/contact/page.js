import EnquiryForm from '@/components/EnquiryForm';
import { SERVICE_NAMES, SITE } from '@/lib/content';

export const metadata = {
  title: 'Contact Us',
  description: 'Contact Pink Paws Groomers in Lekki, Lagos. Send an enquiry or request a consultation about customer service, attitude development, start-up, strategy or sustainability.',
  alternates: { canonical: '/contact' },
};

export default function Contact({ searchParams }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '');
  const li = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/pink-paws/';
  const map = process.env.NEXT_PUBLIC_MAP_EMBED_URL;
  const svc = SERVICE_NAMES.includes(searchParams.service) ? searchParams.service : '';
  const waText = encodeURIComponent('Hello Pink Paws Groomers, I would like to make an enquiry.');
  return (
    <>
      <section className="pagehead"><div className="wrap"><h1>Contact Us</h1><p className="lede">Tell us what you need and we will respond through the contact method you choose.</p></div></section>
      <section className="sec">
        <div className="wrap grid g2" style={{ alignItems: 'start' }}>
          <div className="panel" id="enquiry"><h2>Send an enquiry</h2><EnquiryForm kind="enquiry" defaultService={svc} /></div>
          <div>
            <div className="panel">
              <h3>Contact information</h3>
              <p><b>Location:</b> {SITE.location}<br />Exact address: to be confirmed</p>
              <p><b>Email:</b> {email ? <a href={`mailto:${email}`}>{email}</a> : 'Business email to be confirmed'}</p>
              <p><b>LinkedIn:</b> <a href={li} target="_blank" rel="noopener noreferrer">Pink Paws Groomers</a></p>
              {wa ? <a className="btn wa sm" href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
                : <p>WhatsApp number to be confirmed.</p>}
              {wa && <p style={{ fontSize: '.85rem', color: '#6a6470', marginTop: 10 }}>This opens WhatsApp with a message for you to send. It is separate from the enquiry form.</p>}
            </div>
            <div className="panel" style={{ marginTop: 22 }}>
              <h3>Location</h3>
              {map ? <iframe title="Pink Paws Groomers location" src={map} width="100%" height="260" style={{ border: 0, borderRadius: 10 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                : <p>The map will be added once the exact business address is confirmed.</p>}
            </div>
          </div>
        </div>
      </section>
      <section className="sec alt" id="consultation">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="panel"><h2>Request a consultation</h2><p>Prefer to talk it through first? Share a preferred time and we will arrange a conversation.</p><EnquiryForm kind="consultation" defaultService={svc} /></div>
        </div>
      </section>
    </>
  );
}
