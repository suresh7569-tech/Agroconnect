import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { api } from '../lib/api.js';

export default function MobileVanTracker() {
  const [vans, setVans] = useState([]);
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api.listVans({ city })
      .then(({ vans }) => {
        if (cancelled) return;
        setVans(vans);
        setSelected(vans[0] || null);
        setStatus('ok');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [city]);

  const mapSrc = selected
    ? `https://maps.google.com/maps?q=${selected.currentLocation.lat},${selected.currentLocation.lng}&z=14&output=embed`
    : null;

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-14">
          <p className="eyebrow">Smart Mobile Store</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">Track a van. Reserve your basket.</h1>
          <p className="mt-3 max-w-2xl text-leaf-800/70">
            Our refrigerated Smart Mobile Stores drive fixed daily routes across each city.
            See where your nearest van is right now, what it&apos;s carrying today, and reserve items to be held for you at your stop.
          </p>
          <div className="mt-8 max-w-md">
            <Input placeholder="Filter by city…" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        {status === 'loading' && <p className="text-leaf-800/60">Loading vans…</p>}
        {status === 'error' && <p className="text-red-600">Could not load vans.</p>}
        {status === 'ok' && vans.length === 0 && <p className="text-leaf-800/60">No vans in that city yet.</p>}
        {status === 'ok' && vans.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
            <ul className="space-y-3">
              {vans.map(v => (
                <li key={v._id}>
                  <button
                    type="button"
                    onClick={() => setSelected(v)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?._id === v._id ? 'border-leaf-600 bg-leaf-50' : 'border-leaf-100 bg-white hover:border-leaf-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-leaf-900">{v.vanCode}</h3>
                        <p className="text-xs uppercase tracking-wider text-leaf-700">{v.city}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        v.isRunning ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-200 text-slate-600'
                      }`}>{v.isRunning ? 'LIVE' : 'PARKED'}</span>
                    </div>
                    <p className="mt-2 text-sm text-leaf-800/70">{v.routeName}</p>
                    <p className="mt-1 text-xs text-leaf-700">Driver: {v.driverName}</p>
                  </button>
                </li>
              ))}
            </ul>

            {selected && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-leaf-100 bg-white p-4">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-leaf-900">{selected.vanCode}</h2>
                      <p className="text-sm text-leaf-700">{selected.routeName}</p>
                    </div>
                    <a
                      className="btn-secondary"
                      target="_blank" rel="noopener noreferrer"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selected.currentLocation.lat},${selected.currentLocation.lng}`}
                    >Directions to van</a>
                  </div>
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-leaf-100">
                    <iframe title={selected.vanCode} src={mapSrc} className="h-full w-full" loading="lazy" />
                  </div>
                </div>

                <div className="rounded-2xl border border-leaf-100 bg-white p-5">
                  <h3 className="font-display text-lg font-semibold text-leaf-900">Today&apos;s route</h3>
                  <ol className="mt-4 space-y-3">
                    {selected.stops.map((stop, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                          stop.status === 'departed'
                            ? 'bg-slate-200 text-slate-500'
                            : stop.status === 'current'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-leaf-100 text-leaf-700'
                        }`}>{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-leaf-900">{stop.name}</p>
                          <p className="text-xs text-leaf-700">{stop.arrival} → {stop.departure}</p>
                        </div>
                        {stop.status === 'current' && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">HERE NOW</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <StockAndReserve van={selected} />
              </div>
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}

function StockAndReserve({ van }) {
  const [qty, setQty] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { setQty({}); setConfirm(null); setErr(''); }, [van._id]);

  const submit = async (e) => {
    e.preventDefault();
    const items = Object.entries(qty)
      .filter(([, q]) => Number(q) > 0)
      .map(([crop, q]) => ({ crop, quantity: Number(q) }));
    if (!items.length) { setErr('Add at least one item.'); return; }
    setBusy(true); setErr('');
    try {
      const res = await api.reserveVan(van._id, { name, phone, items });
      setConfirm(res);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  if (confirm) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="eyebrow text-emerald-700">Reservation confirmed</p>
        <h3 className="mt-1 font-display text-xl font-bold text-emerald-900">Code {confirm.reservationCode}</h3>
        <p className="mt-2 text-sm text-emerald-900/80">{confirm.message} Show this code at the van to pick up your items.</p>
        <button className="btn-secondary mt-4" onClick={() => setConfirm(null)}>Reserve again</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-leaf-100 bg-white p-5">
      <h3 className="font-display text-lg font-semibold text-leaf-900">Today&apos;s stock — reserve now</h3>
      <p className="mt-1 text-xs text-leaf-800/70">Held for you at your chosen stop. Cash or UPI at pickup.</p>
      <ul className="mt-4 space-y-3">
        {van.stockToday.map(item => (
          <li key={item.crop} className="grid grid-cols-[1fr,80px,90px] items-center gap-3 rounded-xl border border-leaf-100 bg-white px-3 py-2">
            <div>
              <p className="font-semibold text-leaf-900">{item.crop}</p>
              <p className="text-xs text-leaf-700">₹{item.pricePerUnit}/{item.unit} · {item.qty} {item.unit} left</p>
            </div>
            <Input
              type="number" min="0" max={item.qty} placeholder="0"
              value={qty[item.crop] || ''}
              onChange={(e) => setQty(q => ({ ...q, [item.crop]: e.target.value }))}
            />
            <span className="text-right text-sm font-semibold text-leaf-900">
              ₹{(Number(qty[item.crop]) || 0) * item.pricePerUnit}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="Your name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" /></Field>
      </div>

      {err && <p className="mt-3 text-sm font-medium text-red-600">{err}</p>}
      <button className="btn-primary mt-5 w-full" disabled={busy}>{busy ? 'Reserving…' : 'Reserve at van'}</button>
    </form>
  );
}
