import { useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';

const REASONS = [
  { value: 'consumer', label: 'I have a question about an order' },
  { value: 'farmer', label: 'I want to list my farm' },
  { value: 'partner', label: 'Business partnership' },
  { value: 'press', label: 'Press or media' },
  { value: 'careers', label: 'Careers' },
  { value: 'other', label: 'Something else' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: 'consumer', message: '' });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErr('Please fill name, email, and a short message.');
      return;
    }
    setErr('');
    setSent(true);
  };

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-14">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">Say hello — we&apos;re small enough to reply.</h1>
          <p className="mt-3 max-w-2xl text-leaf-800/70">
            Support answers within a few hours during the day (7 AM – 9 PM IST). Farmer registrations are reviewed within 48 hours.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 sm:p-8">
            {sent ? (
              <div className="text-center py-10">
                <p className="eyebrow text-leaf-700">Message sent</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-leaf-900">Thanks, {form.name.split(' ')[0]}.</h2>
                <p className="mt-2 text-leaf-800/70">We&apos;ll get back to you at {form.email} soon.</p>
                <button className="btn-secondary mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', reason: 'consumer', message: '' }); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input value={form.name} onChange={set('name')} required />
                  </Field>
                  <Field label="Email">
                    <Input type="email" value={form.email} onChange={set('email')} required />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone (optional)">
                    <Input inputMode="tel" value={form.phone} onChange={set('phone')} />
                  </Field>
                  <Field label="What can we help with?">
                    <Select value={form.reason} onChange={set('reason')}>
                      {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Select>
                  </Field>
                </div>
                <Field label="Your message">
                  <textarea
                    value={form.message}
                    onChange={set('message')}
                    rows={5}
                    className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm text-leaf-900 shadow-sm placeholder:text-leaf-800/40 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/30"
                    required
                  />
                </Field>
                {err && <p className="text-sm font-medium text-red-600">{err}</p>}
                <button className="btn-primary w-full sm:w-auto">Send message</button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6">
              <h3 className="font-display text-lg font-semibold text-leaf-900">Head office</h3>
              <p className="mt-2 text-sm text-leaf-800/80">
                AgroConnect Technologies Pvt Ltd<br />
                Level 4, Cyber Gateway, HITEC City<br />
                Hyderabad, Telangana 500081
              </p>
            </div>
            <div className="rounded-2xl border border-leaf-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-leaf-900">Reach us directly</h3>
              <ul className="mt-3 space-y-2 text-sm text-leaf-800/80">
                <li><span className="font-semibold text-leaf-900">Support:</span> hello@agroconnect.in</li>
                <li><span className="font-semibold text-leaf-900">Farmers:</span> farmers@agroconnect.in</li>
                <li><span className="font-semibold text-leaf-900">Partnerships:</span> partners@agroconnect.in</li>
                <li><span className="font-semibold text-leaf-900">Phone:</span> +91 90000 00000</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-leaf-100 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-leaf-900">Farmer registration</h3>
              <p className="mt-2 text-sm text-leaf-800/80">
                Ready to list your farm? Registration takes 10 minutes and gets reviewed within two working days.
              </p>
              <a href="/register/farmer" className="btn-secondary mt-4 inline-flex">Start farmer registration</a>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
