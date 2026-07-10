import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { Field, Input } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const TIMELINE = ['confirmed', 'packed', 'dispatched', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 5, reviewText: '' });
  const [reviewSaved, setReviewSaved] = useState(false);

  const load = () => api.getOrder(id, token).then(({ order }) => setOrder(order)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id, token]);

  if (error) return <PageShell><div className="container-page py-16 text-red-600">Could not load: {error}</div></PageShell>;
  if (!order) return <PageShell><div className="container-page py-16 text-leaf-800/60">Loading…</div></PageShell>;

  const currentStep = order.status === 'cancelled' ? -1 : TIMELINE.indexOf(order.status);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.createReview({ orderId: order._id, rating: review.rating, reviewText: review.reviewText }, token);
      setReviewSaved(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <PageShell>
      <section className="container-page py-12 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-6">
          <div>
            <Link to="/orders" className="text-xs text-leaf-800/60 hover:underline">← All orders</Link>
            <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900">Order #{order._id.slice(-6)}</h1>
            <p className="mt-1 text-leaf-800/70">from {order.farmId?.farmName}</p>
          </div>

          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h2 className="font-semibold text-leaf-900">Timeline</h2>
            {order.status === 'cancelled' ? (
              <p className="mt-3 text-sm text-red-600">This order was cancelled.</p>
            ) : (
              <ol className="mt-4 flex justify-between text-xs">
                {TIMELINE.map((s, i) => (
                  <li key={s} className="flex-1 text-center">
                    <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full font-bold ${i <= currentStep ? 'bg-leaf-600 text-white' : 'bg-leaf-100 text-leaf-700'}`}>
                      {i + 1}
                    </div>
                    <p className={`mt-2 uppercase tracking-wider ${i <= currentStep ? 'text-leaf-800' : 'text-leaf-800/40'}`}>{s}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h2 className="font-semibold text-leaf-900">Items</h2>
            <ul className="mt-3 divide-y divide-leaf-100">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between py-3 text-sm">
                  <span>{i.cropId?.cropName || 'Item'} × {i.quantity} {i.cropId?.unit}</span>
                  <span>₹{i.priceAtOrderTime * i.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.status === 'delivered' && !reviewSaved && (
            <form onSubmit={submitReview} className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 space-y-3">
              <h2 className="font-semibold text-leaf-900">How was your experience?</h2>
              <Field label="Rating">
                <div className="flex gap-1 text-2xl">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} onClick={() => setReview({ ...review, rating: n })}
                      className={n <= review.rating ? 'text-earth-500' : 'text-leaf-800/20'}>★</button>
                  ))}
                </div>
              </Field>
              <Field label="Say a few words (optional)">
                <Input value={review.reviewText} onChange={(e) => setReview({ ...review, reviewText: e.target.value })} placeholder="Fresh, on time, great taste…" />
              </Field>
              <button type="submit" className="btn-primary">Submit review</button>
            </form>
          )}
          {reviewSaved && (
            <div className="rounded-2xl bg-leaf-100 p-4 text-sm text-leaf-800">✓ Thanks for reviewing — the farmer will see your feedback.</div>
          )}
        </div>

        <aside className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 h-fit space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-leaf-700/70">Payment</p>
            <p className="text-sm font-semibold text-leaf-900">{order.paymentMethod.toUpperCase()} · {order.paymentStatus.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-leaf-700/70">Delivery</p>
            <p className="text-sm font-semibold text-leaf-900">{order.deliveryType === 'home' ? 'Home delivery' : 'Farm pickup'}</p>
            {order.deliveryAddress?.pincode && (
              <p className="text-xs text-leaf-800/70">{order.deliveryAddress.street}, {order.deliveryAddress.village}, {order.deliveryAddress.district} — {order.deliveryAddress.pincode}</p>
            )}
          </div>
          <div className="border-t border-leaf-200 pt-3">
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt>Items</dt><dd>₹{order.totalAmount - order.platformFee - order.deliveryCharge}</dd></div>
              <div className="flex justify-between text-leaf-800/70"><dt>Platform fee</dt><dd>₹{order.platformFee}</dd></div>
              <div className="flex justify-between text-leaf-800/70"><dt>Delivery</dt><dd>₹{order.deliveryCharge}</dd></div>
              <div className="border-t border-leaf-200 pt-2 flex justify-between font-bold text-leaf-900">
                <dt>Total</dt><dd>₹{order.totalAmount}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
