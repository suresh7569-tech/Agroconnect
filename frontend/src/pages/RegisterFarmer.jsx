import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import OtpStep from '../components/OtpStep.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const empty = {
  name: '', email: '', phone: '', password: '',
  address: { street: '', village: '', district: '', state: '', pincode: '' },
  govtIdUrl: '',
  landDocUrl: '',
  profilePhoto: '',
  preferredLanguage: 'en',
};

export default function RegisterFarmer() {
  const { setSession } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState(1); // 1 = personal, 2 = docs, 3 = otp
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const setAddr = (k, v) => setForm({ ...form, address: { ...form.address, [k]: v } });

  const goToStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { setError('Enter a valid 10-digit Indian mobile number'); return; }
    if (!/^\d{6}$/.test(form.address.pincode)) { setError('Pincode must be 6 digits'); return; }
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.registerFarmer(form);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onVerified = (result) => {
    if (result.token && result.user) setSession({ token: result.token, user: result.user });
    nav('/dashboard', { replace: true });
  };

  if (step === 3) {
    return (
      <AuthShell
        title="Verify your phone"
        subtitle="Enter the OTP we sent. After verification your farmer account will go to admin for approval."
      >
        <OtpStep phone={form.phone} onVerified={onVerified} onBack={() => setStep(2)} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={step === 1 ? 'List your farm on AgroConnect' : 'Verification documents'}
      subtitle={
        step === 1
          ? 'Reach customers directly. Set your own price. Keep more of what you earn.'
          : 'Upload proof of identity and land ownership. Your account will be reviewed by our team before going live.'
      }
      footer={<>Already registered? <Link to="/login" className="font-semibold text-leaf-700 hover:underline">Sign in</Link></>}
    >
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span className={step >= 1 ? 'text-leaf-700' : 'text-leaf-800/40'}>1. Details</span>
        <span className="text-leaf-800/30">/</span>
        <span className={step >= 2 ? 'text-leaf-700' : 'text-leaf-800/40'}>2. Documents</span>
        <span className="text-leaf-800/30">/</span>
        <span className={step >= 3 ? 'text-leaf-700' : 'text-leaf-800/40'}>3. OTP</span>
      </div>

      {step === 1 && (
        <form onSubmit={goToStep2} className="space-y-4">
          <Field label="Full name"><Input required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
          <Field label="Email"><Input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
          <Field label="Mobile number" hint="10-digit Indian mobile">
            <Input required inputMode="numeric" maxLength={10}
              value={form.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </Field>
          <Field label="Password" hint="At least 8 characters">
            <Input type="password" required minLength={8}
              value={form.password} onChange={(e) => set('password', e.target.value)} />
          </Field>

          <div className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700">Farm location</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Village"><Input required value={form.address.village} onChange={(e) => setAddr('village', e.target.value)} /></Field>
              <Field label="District"><Input required value={form.address.district} onChange={(e) => setAddr('district', e.target.value)} /></Field>
              <Field label="State"><Input required value={form.address.state} onChange={(e) => setAddr('state', e.target.value)} /></Field>
              <Field label="Pincode">
                <Input required inputMode="numeric" maxLength={6}
                  value={form.address.pincode}
                  onChange={(e) => setAddr('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
              </Field>
            </div>
          </div>

          <Field label="Preferred language">
            <Select value={form.preferredLanguage} onChange={(e) => set('preferredLanguage', e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </Select>
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Continue to documents →</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Government ID (Aadhaar / Voter ID)" hint="Paste a Cloudinary or hosted image URL for now. File upload arrives with the Cloudinary integration in Month 2.">
            <Input required placeholder="https://…/aadhaar.jpg"
              value={form.govtIdUrl} onChange={(e) => set('govtIdUrl', e.target.value)} />
          </Field>
          <Field label="Land ownership document" hint="Same — paste a URL for now.">
            <Input required placeholder="https://…/land-record.pdf"
              value={form.landDocUrl} onChange={(e) => set('landDocUrl', e.target.value)} />
          </Field>
          <Field label="Profile photo (optional)">
            <Input placeholder="https://…/profile.jpg"
              value={form.profilePhoto} onChange={(e) => set('profilePhoto', e.target.value)} />
          </Field>

          <div className="rounded-2xl bg-earth-50 p-4 text-xs text-earth-800">
            <strong className="block text-earth-900">What happens next?</strong>
            After you verify the OTP, our team reviews your ID and land document — usually within 48 hours. You&apos;ll get an email when your farm goes live.
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
            <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
              {busy ? 'Submitting…' : 'Register & send OTP'}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
