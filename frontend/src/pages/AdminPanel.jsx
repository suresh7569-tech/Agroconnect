import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const TABS = ['Overview', 'Pending farmers', 'Pending crops', 'Users'];

export default function AdminPanel() {
  const { token } = useAuth();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [users, setUsers] = useState([]);
  const [farms, setFarms] = useState([]);

  const reload = async () => {
    const [s, f, c, fm] = await Promise.all([
      api.adminStats(token).catch(() => null),
      api.pendingFarmers(token).catch(() => ({ users: [] })),
      api.pendingCrops(token).catch(() => ({ crops: [] })),
      // GET /farms already returns approved farms with farmerId populated —
      // exactly what the "which farm is this crop for" dropdown needs.
      api.listFarms().catch(() => ({ farms: [] })),
    ]);
    setStats(s);
    setFarmers(f.users);
    setCrops(c.crops);
    setFarms(fm.farms);
    const u = await api.adminUsers('', token).catch(() => ({ users: [] }));
    setUsers(u.users);
  };
  useEffect(() => { reload(); }, [token]);

  return (
    <PageShell>
      <section className="container-page py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="eyebrow">Admin console</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-leaf-900">Platform controls</h1>
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
          {tab === 'Overview' && <OverviewTab stats={stats} />}
          {tab === 'Pending farmers' && <PendingFarmersTab farmers={farmers} token={token} onChanged={reload} />}
          {tab === 'Pending crops' && <PendingCropsTab crops={crops} farms={farms} token={token} onChanged={reload} />}
          {tab === 'Users' && <UsersTab users={users} token={token} onChanged={reload} />}
        </div>
      </section>
    </PageShell>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-leaf-100 bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-leaf-800/60">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-leaf-900">{value ?? '—'}</p>
    </div>
  );
}

function OverviewTab({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <Kpi label="Farmers" value={stats?.farmers} />
      <Kpi label="Consumers" value={stats?.consumers} />
      <Kpi label="Orders" value={stats?.orders} />
      <Kpi label="Revenue (₹)" value={stats?.platformRevenue} />
      <Kpi label="Pending farmers" value={stats?.pendingFarmers} />
      <Kpi label="Pending crops" value={stats?.pendingCrops} />
    </div>
  );
}

function PendingFarmersTab({ farmers, token, onChanged }) {
  if (farmers.length === 0) return <p className="text-leaf-800/60">No farmers waiting for review.</p>;

  return (
    <ul className="space-y-4">
      {farmers.map(u => (
        <li key={u._id} className="rounded-2xl border border-leaf-100 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-leaf-900">{u.name}</p>
              <p className="text-xs text-leaf-800/70">{u.email} · +91 {u.phone}</p>
              {u.address && (
                <p className="mt-1 text-xs text-leaf-800/70">
                  {u.address.village}, {u.address.district}, {u.address.state} — {u.address.pincode}
                </p>
              )}
              <div className="mt-3 flex gap-3 text-xs">
                {u.govtIdUrl && <a href={u.govtIdUrl} target="_blank" rel="noreferrer" className="text-leaf-700 hover:underline">View Govt ID ↗</a>}
                {u.landDocUrl && <a href={u.landDocUrl} target="_blank" rel="noreferrer" className="text-leaf-700 hover:underline">View land document ↗</a>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={async () => { await api.approveFarmer(u._id, token); onChanged(); }} className="btn-primary py-1.5 text-xs">Approve</button>
              <button onClick={async () => { if (confirm('Reject and deactivate this farmer?')) { await api.rejectFarmer(u._id, token); onChanged(); } }} className="btn-secondary py-1.5 text-xs">Reject</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PendingCropsTab({ crops, farms, token, onChanged }) {
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-leaf-900">Crop listings</h2>
        <button onClick={() => setCreating(true)} className="btn-primary">+ Add crop</button>
      </div>
      <p className="mt-1 text-xs text-leaf-800/60">
        Add a crop listing on behalf of an approved farmer — it goes live immediately, so it won't appear
        in the pending list below. Listings farmers submit themselves still land here for review.
      </p>

      {creating && (
        <AdminCropEditor farms={farms} token={token} onClose={() => { setCreating(false); onChanged(); }} />
      )}

      {crops.length === 0 ? (
        <p className="mt-6 text-leaf-800/60">No listings waiting for review.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {crops.map(c => (
            <li key={c._id} className="flex gap-4 rounded-2xl border border-leaf-100 bg-white p-5">
              <img src={c.photos?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-leaf-900">{c.cropName}</p>
                    <p className="text-xs text-leaf-800/70">from {c.farmId?.farmName} · {c.farmId?.farmerId?.name}</p>
                    <p className="mt-1 text-xs text-leaf-800/70">₹{c.pricePerUnit}/{c.unit} · {c.availableQuantity} available</p>
                    {c.description && <p className="mt-2 text-sm text-leaf-800/80">{c.description}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={async () => { await api.approveCrop(c._id, token); onChanged(); }} className="btn-primary py-1.5 text-xs">Approve</button>
                    <button onClick={async () => { await api.rejectCrop(c._id, token); onChanged(); }} className="btn-secondary py-1.5 text-xs">Reject</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AdminCropEditor({ farms, token, onClose }) {
  const [form, setForm] = useState({
    farmId: farms[0]?._id || '',
    cropName: '', category: 'vegetables', description: '',
    photos: '', videoUrl: '',
    pricePerUnit: '', unit: 'kg', availableQuantity: '', minOrderQty: 1, isInSeason: true,
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.farmId) { setError('Select a farm for this listing.'); return; }
    try {
      await api.adminCreateCrop({
        ...form,
        photos: form.photos.split(',').map(s => s.trim()).filter(Boolean),
        pricePerUnit: Number(form.pricePerUnit),
        availableQuantity: Number(form.availableQuantity),
        minOrderQty: Number(form.minOrderQty) || 1,
      }, token);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-leaf-300 bg-leaf-50/40 p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold text-leaf-900">New crop listing</h3>
        <button type="button" onClick={onClose} className="text-xs text-leaf-700">Cancel</button>
      </div>

      <Field label="Farm" hint="Which farmer is this listing for?">
        <Select required value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value })}>
          <option value="" disabled>Select a farm…</option>
          {farms.map(f => (
            <option key={f._id} value={f._id}>{f.farmName} — {f.farmerId?.name}</option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Crop name"><Input required value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} /></Field>
        <Field label="Category">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['vegetables', 'leafy_greens', 'fruits', 'grains', 'pulses', 'spices', 'dairy'].map(c => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </Select>
        </Field>
        <Field label="Price (₹)"><Input type="number" required value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} /></Field>
        <Field label="Unit">
          <Select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            {['kg', 'dozen', 'bundle', 'piece'].map(u => <option key={u} value={u}>{u}</option>)}
          </Select>
        </Field>
        <Field label="Available quantity"><Input type="number" required value={form.availableQuantity} onChange={(e) => setForm({ ...form, availableQuantity: e.target.value })} /></Field>
        <Field label="Minimum order qty"><Input type="number" value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} /></Field>
      </div>
      <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Photo URLs" hint="Comma-separated (at least 1 required)">
        <Input required value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} />
      </Field>
      <Field label="Cultivation video (YouTube URL)" hint="Optional but strongly recommended">
        <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary">Create listing</button>
    </form>
  );
}

function UsersTab({ users, token, onChanged }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-leaf-100 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-leaf-50 text-left text-xs uppercase tracking-wider text-leaf-800">
          <tr>
            <th className="px-4 py-3">Name</th><th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Contact</th><th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-leaf-100">
          {users.map(u => (
            <tr key={u._id}>
              <td className="px-4 py-3 font-medium text-leaf-900">{u.name}</td>
              <td className="px-4 py-3">{u.role}</td>
              <td className="px-4 py-3 text-xs text-leaf-800/70">{u.email}<br/>+91 {u.phone}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.isActive ? 'bg-leaf-100 text-leaf-800' : 'bg-red-100 text-red-700'}`}>
                  {u.isActive ? 'active' : 'suspended'}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={async () => { await api.setUserActive(u._id, !u.isActive, token); onChanged(); }}
                  className="text-xs font-semibold text-leaf-700 hover:underline">
                  {u.isActive ? 'Suspend' : 'Reactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
