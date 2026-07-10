import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Input, Select } from '../components/FormField.jsx';
import { api } from '../lib/api.js';

const TYPES = [
  { value: '', label: 'All locations' },
  { value: 'city_store', label: 'City stores' },
  { value: 'procurement_center', label: 'Procurement centers' },
];

export default function StoreLocator() {
  const [stores, setStores] = useState([]);
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api.listStores({ type, city })
      .then(({ stores }) => {
        if (cancelled) return;
        setStores(stores);
        setSelected(stores[0] || null);
        setStatus('ok');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [type, city]);

  const mapSrc = selected
    ? `https://maps.google.com/maps?q=${selected.location.lat},${selected.location.lng}&z=14&output=embed`
    : null;

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-14">
          <p className="eyebrow">Store Locator</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">Find an AgroConnect near you</h1>
          <p className="mt-3 max-w-2xl text-leaf-800/70">City stores for daily pickup + delivery. Procurement centers where farmers drop off produce and quality inspectors take over.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr,200px]">
            <Input placeholder="Search city (Hyderabad, Bengaluru…)" value={city} onChange={(e) => setCity(e.target.value)} />
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        {status === 'loading' && <p className="text-leaf-800/60">Loading stores…</p>}
        {status === 'error' && <p className="text-red-600">Could not load stores.</p>}
        {status === 'ok' && stores.length === 0 && <p className="text-leaf-800/60">No stores match those filters.</p>}
        {status === 'ok' && stores.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
            <ul className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {stores.map(s => (
                <li key={s._id}>
                  <button
                    type="button"
                    onClick={() => setSelected(s)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected?._id === s._id ? 'border-leaf-600 bg-leaf-50' : 'border-leaf-100 bg-white hover:border-leaf-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-leaf-900">{s.name}</h3>
                        <p className="text-xs uppercase tracking-wider text-leaf-700">{s.code} · {labelFor(s.type)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        s.isActive ? 'bg-leaf-100 text-leaf-800' : 'bg-slate-200 text-slate-600'
                      }`}>{s.isActive ? 'OPEN' : 'CLOSED'}</span>
                    </div>
                    <p className="mt-2 text-sm text-leaf-800/70">
                      {[s.address?.line1, s.address?.city, s.address?.pincode].filter(Boolean).join(' · ')}
                    </p>
                    <p className="mt-1 text-xs text-leaf-700">{s.hours} · {s.phone}</p>
                    {s.services?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {s.services.map(svc => (
                          <span key={svc} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-leaf-700 ring-1 ring-leaf-200">
                            {svc.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-leaf-100 bg-white p-4">
              {selected ? (
                <>
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-leaf-900">{selected.name}</h2>
                      <p className="text-sm text-leaf-700">{labelFor(selected.type)}</p>
                    </div>
                    <a
                      className="btn-secondary"
                      target="_blank" rel="noopener noreferrer"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selected.location.lat},${selected.location.lng}`}
                    >Get directions</a>
                  </div>
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-leaf-100">
                    <iframe title={selected.name} src={mapSrc} className="h-full w-full" loading="lazy" />
                  </div>
                </>
              ) : (
                <p className="text-leaf-800/60">Select a store to see it on the map.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function labelFor(type) {
  if (type === 'city_store') return 'City Store';
  if (type === 'procurement_center') return 'Procurement Center';
  if (type === 'mobile_van') return 'Mobile Van';
  return type;
}
