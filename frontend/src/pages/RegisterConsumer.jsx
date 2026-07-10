import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Field, Input } from '../components/FormField.jsx';
import OtpStep from '../components/OtpStep.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterConsumer() {
  const { setSession } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    address: { street: '', village: '', district: '', state: '', pincode: '' },
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const setAddr = (k, v) => setForm({ ...form, address: { ...form.address, [k]: v } });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.registerConsumer(form);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onVerified = ({ token, user }) => {
    setSession({ token, user });
    nav('/dashboard', { replace: true });
  };

  if (step === 'otp') {
    return (
      <AuthShell title="Verify your phone" subtitle="Enter the OTP we sent to complete signup.">
        <OtpStep phone={form.phone} onVerified={onVerified} onBack={() => setStep('form')} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Shop fresh, chemical-free produce"
      subtitle="Create your consumer account — takes about a minute."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-leaf-700 hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <Input required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Mobile number" hint="10-digit Indian mobile (starts with 6-9)">
          <Input required inputMode="numeric" maxLength={10}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
        </Field>
        <Field label="Password" hint="At least 8 characters">
          <Input type="password" required minLength={8}
            value={form.password} onChange={(e) => set('password', e.target.value)} />
        </Field>

        <div className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700">Delivery address</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Street / Area">
              <Input value={form.address.street} onChange={(e) => setAddr('street', e.target.value)} />
            </Field>
            <Field label="Village / City">
              <Input value={form.address.village} onChange={(e) => setAddr('village', e.target.value)} />
            </Field>
            <Field label="District">
              <Input value={form.address.district} onChange={(e) => setAddr('district', e.target.value)} />
            </Field>
            <Field label="State">
              <Input value={form.address.state} onChange={(e) => setAddr('state', e.target.value)} />
            </Field>
            <Field label="Pincode" hint="6 digits">
              <Input inputMode="numeric" maxLength={6}
                value={form.address.pincode}
                onChange={(e) => setAddr('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
            </Field>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? 'Creating account…' : 'Create account & send OTP'}
        </button>
      </form>
    </AuthShell>
  );
}
