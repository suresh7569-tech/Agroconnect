import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const TABS = ['Farm profile', 'Crops', 'Orders', 'Visits'];

export default function FarmerDashboard() {
  const { user, token } = useAuth();
  const [tab, setTab] = useState('Crops');
  const [farm, setFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visits, setVisits] = useState([]);

  const reload = async () => {
    const [{ farm: f }, { crops: c }, { orders: o }, { visits: v }] = await Promise.all([
      api.getMyFarm(token).catch(() => ({ farm: null })),
      api.myCrops(token).catch(() => ({ crops: [] })),
      api.farmerOrders(token).catch(() => ({ orders: [] })),
      api.farmerVisits(token).catch(() => ({ visits: [] })),
    ]);
    setFarm(f); setCrops(c); setOrders(o); setVisits(v);
  };

  useEffect(() => { reload(); }, [token]);

  return (
    <PageShell>
      <section className="container-page py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="eyebrow">Farmer dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-leaf-900">
              Namaste, {user?.name?.split(' ')[0]}
            </h1>
            {!user?.isVerified && (
              <p className="mt-2 rounded-lg bg-earth-100 px-3 py-1.5 inline-block text-xs font-semibold text-earth-800">
                Your account is under admin review — listings stay hidden until approved.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t ? 'bg-leaf-600 text-white' : 'bg-leaf-100 text-leaf-800 hover:bg-leaf-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {tab === 'Farm profile' && <FarmProfileTab farm={farm} token={token} onSaved={reload} />}
          {tab === 'Crops' && <CropsTab farm={farm} crops={crops} token={token} onChanged={reload} />}
          {tab === 'Orders' && <OrdersTab orders={orders} token={token} onChanged={reload} />}
          {tab === 'Visits' && <VisitsTab visits={visits} />}
        </div>
      </section>
    </PageShell>
  );
}

function FarmProfileTab({ farm, token, onSaved }) {
  const [form, setForm] = useState({
    farmName: '', description: '', certifications: '',
    location: { lat: '', lng: '', village: '', district: '', state: '', pincode: '', address: '' },
    photos: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (farm) setForm({
      farmName: farm.farmName || '',
      description: farm.description || '',
      certifications: (farm.certifications || []).join(', '),
      location: {
        lat: farm.location?.lat || '', lng: farm.location?.lng || '',
        village: farm.location?.village || '', district: farm.location?.district || '',
        state: farm.location?.state || '', pincode: farm.location?.pincode || '',
        address: farm.location?.address || '',
      },
      photos: (farm.photos || []).join(', '),
    });
  }, [farm]);

  const save = async (e) => {
    e.preventDefault();
    setSaved(false);
    await api.saveMyFarm({
      farmName: form.farmName,
      description: form.description,
      certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
      location: form.location,
      photos: form.photos.split(',').map(s => s.trim()).filter(Boolean),
    }, token);
    setSaved(true);
    onSaved();
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 rounded-2xl border border-leaf-100 bg-white p-6">
      <h2 className="font-display text-xl font-bold text-leaf-900">Your farm profile</h2>
      <Field label="Farm name"><Input required value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} /></Field>
      <Field label="Description" hint="Story of your farm, how you grow, what makes it special.">
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/30" />
      </Field>
      <Field label="Certifications" hint="Comma-separated (e.g. PGS-India, NPOP)">
        <Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
      </Field>

      <div className="rounded-xl border border-leaf-100 bg-leaf-50/40 p-4">
        <p className="eyebrow">Location</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Village"><Input value={form.location.village} onChange={(e) => setForm({ ...form, location: { ...form.location, village: e.target.value } })} /></Field>
          <Field label="District"><Input value={form.location.district} onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })} /></Field>
          <Field label="State"><Input value={form.location.state} onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} /></Field>
          <Field label="Pincode"><Input value={form.location.pincode} onChange={(e) => setForm({ ...form, location: { ...form.location, pincode: e.target.value } })} /></Field>
          <Field label="Latitude"><Input value={form.location.lat} onChange={(e) => setForm({ ...form, location: { ...form.location, lat: Number(e.target.value) || '' } })} /></Field>
          <Field label="Longitude"><Input value={form.location.lng} onChange={(e) => setForm({ ...form, location: { ...form.location, lng: Number(e.target.value) || '' } })} /></Field>
        </div>
      </div>

      <Field label="Farm photos" hint="Comma-separated image URLs (Cloudinary integration coming soon)">
        <Input value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} placeholder="https://…/farm-1.jpg, https://…/farm-2.jpg" />
      </Field>

      {saved && <p className="text-sm text-leaf-700">✓ Farm profile saved.</p>}
      <button type="submit" className="btn-primary">Save farm profile</button>
    </form>
  );
}

function CropsTab({ farm, crops, token, onChanged }) {
  return (
    <div>
      {!farm && (
        <p className="mb-4 rounded-lg bg-earth-100 p-3 text-sm text-earth-800">
          Create your farm profile first. Once it's approved, the AgroConnect team will add your crop listings for you.
        </p>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-leaf-900">Your crop listings</h2>
      </div>
      <p className="mt-1 text-xs text-leaf-800/60">
        Crop listings are added by the AgroConnect team after reviewing your details. Contact admin to add or update a listing.
      </p>

      {crops.length === 0 ? (
        <p className="mt-6 text-sm text-leaf-800/70">No listings yet.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {crops.map(c => (
            <li key={c._id} className="flex gap-4 rounded-2xl border border-leaf-100 bg-white p-4">
              <img src={c.photos?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-leaf-900">{c.cropName}</p>
                    <p className="text-xs text-leaf-800/60">₹{c.pricePerUnit}/{c.unit} · {c.availableQuantity} available</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.isApprovedByAdmin ? 'bg-leaf-100 text-leaf-800' : 'bg-earth-100 text-earth-800'}`}>
                    {c.isApprovedByAdmin ? 'live' : 'pending review'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrdersTab({ orders, token, onChanged }) {
  const advance = async (order, next) => {
    await api.updateOrderStatus(order._id, next, token);
    onChanged();
  };
  const NEXT = { confirmed: 'packed', packed: 'dispatched', dispatched: 'delivered' };

  if (orders.length === 0) return <p className="text-leaf-800/60">No orders yet — they'll appear here as soon as consumers buy.</p>;

  return (
    <ul className="space-y-3">
      {orders.map(o => (
        <li key={o._id} className="rounded-2xl border border-leaf-100 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-leaf-800/60">Order #{o._id.slice(-6)}</p>
              <p className="mt-1 font-semibold text-leaf-900">{o.consumerId?.name} · +91 {o.consumerId?.phone}</p>
              <p className="mt-1 text-xs text-leaf-800/70">{o.items.map(i => `${i.cropId?.cropName} × ${i.quantity} ${i.cropId?.unit}`).join(', ')}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-800">{o.status}</span>
              <span className="font-semibold text-leaf-900">₹{o.totalAmount}</span>
              {NEXT[o.status] && (
                <button onClick={() => advance(o, NEXT[o.status])} className="btn-primary py-1.5 text-xs">
                  Mark {NEXT[o.status]}
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function VisitsTab({ visits }) {
  if (visits.length === 0) return <p className="text-leaf-800/60">No visit bookings yet.</p>;
  return (
    <ul className="space-y-3">
      {visits.map(v => (
        <li key={v._id} className="rounded-2xl border border-leaf-100 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-leaf-900">{v.consumerId?.name} · +91 {v.consumerId?.phone}</p>
              <p className="text-xs text-leaf-800/70">{new Date(v.visitDate).toDateString()} · {v.timeSlot} · {v.numberOfVisitors} visitors</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-earth-700">{v.packageType.replace('_', ' ')}</p>
            </div>
            <span className="font-semibold text-leaf-900">₹{v.totalAmount}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
