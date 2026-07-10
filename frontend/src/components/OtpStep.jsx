import { useState } from 'react';
import { api } from '../lib/api.js';
import { Field, Input } from './FormField.jsx';

export default function OtpStep({ phone, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api.verifyOtp(phone, code);
      onVerified(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setError('');
    try { await api.sendOtp(phone); }
    catch (err) { setError(err.message); }
    finally { setResending(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-2xl bg-leaf-50 p-4 text-sm text-leaf-800">
        We sent a 6-digit code to <strong>+91 {phone}</strong>.
        {' '}Check the backend console for the code during development.
      </div>

      <Field label="Enter OTP" error={error}>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit code"
          inputMode="numeric"
          autoFocus
        />
      </Field>

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} className="text-leaf-700 hover:underline">
          ← Change details
        </button>
        <button type="button" onClick={resend} disabled={resending} className="text-leaf-700 hover:underline disabled:opacity-50">
          {resending ? 'Resending…' : 'Resend OTP'}
        </button>
      </div>

      <button type="submit" disabled={code.length !== 6 || busy} className="btn-primary w-full disabled:opacity-60">
        {busy ? 'Verifying…' : 'Verify & continue'}
      </button>
    </form>
  );
}
