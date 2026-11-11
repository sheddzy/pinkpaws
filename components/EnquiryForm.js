'use client';
import { useRef, useState } from 'react';
import { SERVICE_NAMES } from '@/lib/data';

export default function EnquiryForm({ kind = 'enquiry', defaultService = '' }) {
  const consult = kind === 'consultation';
  const [key, setKey] = useState(() => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''));
  const loaded = useRef(Date.now());
  const [state, setState] = useState({ busy: false, error: '', fields: {}, done: null });

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(f.entries());
    setState((s) => ({ ...s, busy: true, error: '', fields: {} }));
    try {
      const r = await fetch('/api/enquiry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, kind, submission_key: key, elapsed: Date.now() - loaded.current }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        setState({ busy: false, error: '', fields: {}, done: j.ref });
        setKey(crypto.randomUUID());
        e.currentTarget.reset();
      } else setState({ busy: false, error: j.error || 'Something went wrong. Please try again.', fields: j.fields || {}, done: null });
    } catch {
      setState({ busy: false, error: 'We could not reach the server. Check your connection and press Send again.', fields: {}, done: null });
    }
  }

  const id = (n) => `${kind}-${n}`;
  const err = (n) => (state.fields[n] ? <small style={{ color: '#b00020' }}>{state.fields[n]}</small> : null);

  return (
    <form className="form" onSubmit={submit} noValidate>
      {state.done && (
        <div className="ok" role="status">
          <b>{consult ? 'Consultation request received.' : 'Enquiry received.'}</b> Your reference is {state.done}. Our team will use your preferred contact method to get back to you.
        </div>
      )}
      {state.error && <div className="bad" role="alert">{state.error}</div>}
      <div className="two">
        <label htmlFor={id('name')}>Full name{err('name')}<input id={id('name')} name="name" required maxLength={100} autoComplete="name" /></label>
        <label htmlFor={id('biz')}><span>Business or organisation <small>(optional)</small></span><input id={id('biz')} name="business_name" maxLength={150} autoComplete="organization" /></label>
      </div>
      <div className="two">
        <label htmlFor={id('email')}>Email address{err('email')}<input id={id('email')} name="email" type="email" required maxLength={150} autoComplete="email" /></label>
        <label htmlFor={id('phone')}>Phone or WhatsApp number{err('phone')}<input id={id('phone')} name="phone" type="tel" required maxLength={25} autoComplete="tel" /></label>
      </div>
      <div className="two">
        <label htmlFor={id('service')}>Service of interest{err('service')}
          <select id={id('service')} name="service" required defaultValue={defaultService}>
            <option value="" disabled>Choose a service</option>{SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
          </select></label>
        <label htmlFor={id('pref')}>Preferred contact method
          <select id={id('pref')} name="preferred_contact" defaultValue="Email"><option>Email</option><option>Phone call</option><option>WhatsApp</option></select></label>
      </div>
      {consult && <label htmlFor={id('time')}><span>Preferred date and time <small>(optional)</small></span><input id={id('time')} name="preferred_time" maxLength={100} placeholder="For example, a weekday morning" /></label>}
      <label htmlFor={id('subject')}>Subject{err('subject')}<input id={id('subject')} name="subject" required maxLength={150} defaultValue={consult ? 'Consultation request' : ''} /></label>
      <label htmlFor={id('msg')}>{consult ? 'What would you like to discuss?' : 'Your enquiry'}{err('message')}<textarea id={id('msg')} name="message" required maxLength={3000} /></label>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div><button className="btn" type="submit" style={{ color: '#fff' }} disabled={state.busy}>{state.busy ? 'Sending...' : consult ? 'Request consultation' : 'Send enquiry'}</button></div>
    </form>
  );
}
