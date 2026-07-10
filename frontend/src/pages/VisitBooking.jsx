import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const PACKAGES = [
  { v: 'basic_tour', l: 'Basic Tour', price: 199 },
  { v: 'harvest_experience', l: 'Harvest Experience', price: 499 },
  { v: 'full_day_stay', l: 'Full Day Stay', price: 999 },
];
const SLOTS = ['08:00–10:00', '10:00–12:00', '15:00–17:00'];

export default function VisitBooking() {
  const { id: farmId } = useParams();
  const { user, token } = useAuth();
  const nav = useNavigate();

  const [farm, setFarm] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    visitDate: (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10); })(),
    timeSlot: SLOTS[0],
    packageType: 'basic_tour',
    numberOfVisitors: 2,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getFarm(farmId).then(({ farm }) => setFarm(farm)).catch((e) => setError(e.message));
  }, [farmId]);

  const price = PACKAGES.find(p => p.v === form.packageType).price;
  const total = price * form.numberOfVisitors;

  const book = async (e) => {
    e.preventDefault();
    if (!user) return nav('/login', { state: { from: `/farms/${farmId}/visit` } });
    setError(''); setBusy(true);
    try {
      const { visit } = await api.bookVisit({ farmId, ...form }, token);
      nav(`/farmer-visits/confirmed`, { state: { visit, farmName: farm?.farmName } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <section className="container-page py-12 grid gap-10 lg:grid-cols-[1.3fr,1fr]">
        <div>
          <p className="eyebrow">Book a farm visit</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900">
            {farm?.farmName || 'This farm'}
          </h1>
          {farm?.location && <p className="mt-1 text-sm text-leaf-800/70">📍 {farm.location.village}, {farm.location.district}</p>}

          <form onSubmit={book} className="mt-8 space-y-6 rounded-2xl border border-leaf-100 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Visit date">
                <Input type="date" min={new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)}
                  value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
              </Field>
              <Field label="Time slot">
                <Select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}>
                  {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Package">
              <div className="grid gap-3 sm:grid-cols-3">
                {PACKAGES.map(p => (
                  <label key={p.v}
                    className={`cursor-pointer rounded-xl border p-4 ${form.packageType === p.v ? 'border-leaf-500 bg-leaf-50' : 'border-leaf-200'}`}>
                    <input type="radio" name="pkg" value={p.v} checked={form.packageType === p.v}
                      onChange={() => setForm({ ...form, packageType: p.v })} className="sr-only" />
                    <p className="font-semibold text-leaf-900">{p.l}</p>
                    <p className="text-xs text-leaf-800/60">₹{p.price} / visitor</p>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Number of visitors" hint="1–30 (families, schools, corporate groups welcome)">
              <Input type="number" min={1} max={30}
                value={form.numberOfVisitors}
                onChange={(e) => setForm({ ...form, numberOfVisitors: Number(e.target.value) || 1 })} />
            </Field>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? 'Booking…' : `Confirm & pay ₹${total}`}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 h-fit">
          <h3 className="font-display text-xl font-bold text-leaf-900">Booking summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Package</dt><dd>{PACKAGES.find(p => p.v === form.packageType).l}</dd></div>
            <div className="flex justify-between"><dt>Visitors</dt><dd>{form.numberOfVisitors}</dd></div>
            <div className="flex justify-between"><dt>Date</dt><dd>{form.visitDate}</dd></div>
            <div className="flex justify-between"><dt>Slot</dt><dd>{form.timeSlot}</dd></div>
            <div className="border-t border-leaf-200 pt-2 flex justify-between font-bold text-leaf-900">
              <dt>Total</dt><dd>₹{total}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-leaf-800/60">
            Full refund if you cancel more than 48 hours before your visit.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
