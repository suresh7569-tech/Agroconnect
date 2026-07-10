import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const STATUS_STYLE = {
  pending: 'bg-earth-100 text-earth-800',
  confirmed: 'bg-leaf-100 text-leaf-800',
  packed: 'bg-leaf-100 text-leaf-800',
  dispatched: 'bg-leaf-100 text-leaf-800',
  delivered: 'bg-leaf-600 text-white',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.myOrders(token).then(({ orders }) => { setOrders(orders); setStatus('ok'); }).catch(() => setStatus('error'));
  }, [token]);

  return (
    <PageShell>
      <section className="container-page py-12">
        <h1 className="font-display text-3xl font-bold text-leaf-900">Your orders</h1>

        {status === 'loading' && <p className="mt-6 text-leaf-800/60">Loading…</p>}
        {status === 'ok' && orders.length === 0 && (
          <div className="mt-8 rounded-2xl border border-leaf-100 bg-leaf-50/40 p-10 text-center">
            <p className="text-leaf-800/70">No orders yet.</p>
            <Link to="/marketplace" className="btn-primary mt-6">Browse marketplace</Link>
          </div>
        )}
        {status === 'ok' && orders.length > 0 && (
          <ul className="mt-8 space-y-4">
            {orders.map((o) => (
              <li key={o._id} className="rounded-2xl border border-leaf-100 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-leaf-800/60">Order #{o._id.slice(-6)}</p>
                    <Link to={`/orders/${o._id}`} className="mt-1 block font-semibold text-leaf-900 hover:underline">
                      {o.items.map(i => i.cropId?.cropName || 'Item').join(', ')}
                    </Link>
                    <p className="mt-1 text-xs text-leaf-800/60">from {o.farmId?.farmName} · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[o.status] || 'bg-leaf-100 text-leaf-800'}`}>
                      {o.status}
                    </span>
                    <span className="font-semibold text-leaf-900">₹{o.totalAmount}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
