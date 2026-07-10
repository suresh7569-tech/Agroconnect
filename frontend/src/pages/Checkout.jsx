import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const PLATFORM_FEE_RATE = 0.05;
const HOME_DELIVERY = 60;

export default function Checkout() {
  const { items, farmId, subtotal, clear } = useCart();
  const { user, token } = useAuth();
  const nav = useNavigate();

  const [deliveryType, setDeliveryType] = useState('home');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [address, setAddress] = useState({
    street: user?.address?.street || '', village: user?.address?.village || '',
    district: user?.address?.district || '', state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [expected, setExpected] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const delivery = deliveryType === 'home' ? HOME_DELIVERY : 0;
  const total = subtotal + platformFee + delivery;

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="container-page py-16 text-center text-leaf-800/70">
          Your cart is empty. <button onClick={() => nav('/marketplace')} className="ml-2 font-semibold text-leaf-700 underline">Browse marketplace</button>
        </div>
      </PageShell>
    );
  }

  const placeOrder = async () => {
    setError(''); setBusy(true);
    try {
      if (paymentMethod !== 'cod') {
        // Mock Razorpay dance: create order → mark verified.
        await api.createRazorpayOrder(total, 'cart_' + Date.now(), token);
      }

      const { order } = await api.createOrder({
        farmId,
        items: items.map(i => ({ cropId: i.crop._id, quantity: i.qty })),
        deliveryType,
        deliveryAddress: deliveryType === 'home' ? address : undefined,
        paymentMethod,
        expectedDeliveryDate: expected,
      }, token);

      if (paymentMethod !== 'cod') {
        await api.verifyPayment({ orderId: order._id }, token);
      }

      clear();
      nav(`/orders/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <section className="container-page py-12 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-leaf-900">Checkout</h1>
            <p className="mt-2 text-leaf-800/70">Almost there — confirm your delivery + payment details.</p>
          </div>

          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h2 className="font-semibold text-leaf-900">Delivery method</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { v: 'home', l: 'Home delivery', d: `₹${HOME_DELIVERY} · 2–3 days` },
                { v: 'pickup', l: 'Farm pickup', d: 'Free · pick from farm' },
              ].map((o) => (
                <label key={o.v} className={`cursor-pointer rounded-xl border p-4 ${deliveryType === o.v ? 'border-leaf-500 bg-leaf-50' : 'border-leaf-200'}`}>
                  <input type="radio" name="delivery" value={o.v} checked={deliveryType === o.v} onChange={() => setDeliveryType(o.v)} className="sr-only" />
                  <p className="font-semibold text-leaf-900">{o.l}</p>
                  <p className="text-xs text-leaf-800/60">{o.d}</p>
                </label>
              ))}
            </div>

            {deliveryType === 'home' && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Street / Area"><Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></Field>
                <Field label="Village / City"><Input value={address.village} onChange={(e) => setAddress({ ...address, village: e.target.value })} /></Field>
                <Field label="District"><Input value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} /></Field>
                <Field label="State"><Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></Field>
                <Field label="Pincode">
                  <Input inputMode="numeric" maxLength={6} value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
                </Field>
                <Field label="Expected delivery">
                  <Input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} />
                </Field>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h2 className="font-semibold text-leaf-900">Payment</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { v: 'razorpay', l: 'Card / Net banking', d: 'Razorpay (test mode)' },
                { v: 'upi', l: 'UPI', d: 'GPay, PhonePe, Paytm' },
                { v: 'cod', l: 'Cash on delivery', d: subtotal > 2000 ? 'Not available above ₹2000' : 'Pay in cash' },
              ].map((o) => {
                const disabled = o.v === 'cod' && subtotal > 2000;
                return (
                  <label key={o.v} className={`rounded-xl border p-4 ${paymentMethod === o.v ? 'border-leaf-500 bg-leaf-50' : 'border-leaf-200'} ${disabled ? 'opacity-40' : 'cursor-pointer'}`}>
                    <input type="radio" name="pay" value={o.v} checked={paymentMethod === o.v} disabled={disabled} onChange={() => setPaymentMethod(o.v)} className="sr-only" />
                    <p className="font-semibold text-leaf-900">{o.l}</p>
                    <p className="text-xs text-leaf-800/60">{o.d}</p>
                  </label>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-leaf-800/60">
              Payments are held in escrow — released to the farmer only after you confirm delivery.
              This build uses a Razorpay mock; drop in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` for the real flow.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <aside className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 h-fit">
          <h2 className="font-display text-xl font-bold text-leaf-900">Order summary</h2>
          <ul className="mt-3 divide-y divide-leaf-100 text-sm">
            {items.map(({ crop, qty }) => (
              <li key={crop._id} className="flex justify-between py-2">
                <span>{crop.cropName} × {qty}</span>
                <span>₹{crop.pricePerUnit * qty}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t border-leaf-200 pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>₹{subtotal}</dd></div>
            <div className="flex justify-between text-leaf-800/70"><dt>Platform fee</dt><dd>₹{platformFee}</dd></div>
            <div className="flex justify-between text-leaf-800/70"><dt>Delivery</dt><dd>₹{delivery}</dd></div>
            <div className="border-t border-leaf-200 pt-2 flex justify-between font-bold text-leaf-900">
              <dt>Total</dt><dd>₹{total}</dd>
            </div>
          </dl>
          <button onClick={placeOrder} disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
            {busy ? 'Placing order…' : `Place order · ₹${total}`}
          </button>
        </aside>
      </section>
    </PageShell>
  );
}
