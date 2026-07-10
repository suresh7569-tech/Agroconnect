import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PLATFORM_FEE_RATE = 0.05;
const HOME_DELIVERY = 60;

export default function Cart() {
  const { t } = useTranslation();
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const delivery = subtotal > 0 ? HOME_DELIVERY : 0;
  const total = subtotal + platformFee + delivery;

  const proceed = () => {
    if (!user) return nav('/login', { state: { from: '/checkout' } });
    if (user.role !== 'consumer') return alert('Only consumer accounts can place orders.');
    nav('/checkout');
  };

  return (
    <PageShell>
      <section className="container-page py-12">
        <h1 className="font-display text-3xl font-bold text-leaf-900">{t('cart.title')}</h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-leaf-100 bg-leaf-50/40 p-10 text-center">
            <p className="text-leaf-800/70">{t('cart.empty')}</p>
            <Link to="/marketplace" className="btn-primary mt-6">{t('cart.browse')}</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
            <ul className="space-y-4">
              {items.map(({ crop, qty }) => (
                <li key={crop._id} className="flex gap-4 rounded-2xl border border-leaf-100 bg-white p-4">
                  <img src={crop.photos?.[0]} alt="" className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/crops/${crop._id}`} className="font-semibold text-leaf-900 hover:underline">{crop.cropName}</Link>
                        <p className="text-xs text-leaf-800/60">{crop.farmId?.farmName}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-leaf-800">₹{crop.pricePerUnit * qty}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-leaf-200 bg-white">
                        <button onClick={() => updateQty(crop._id, qty - 1)} className="px-3 py-1 text-lg text-leaf-700">−</button>
                        <span className="px-3 text-sm font-semibold">{qty}</span>
                        <button onClick={() => updateQty(crop._id, qty + 1)} className="px-3 py-1 text-lg text-leaf-700">+</button>
                      </div>
                      <span className="text-xs text-leaf-800/60">{crop.unit}</span>
                      <button onClick={() => removeItem(crop._id)} className="ml-auto text-xs font-semibold text-red-600 hover:underline">
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 h-fit">
              <h2 className="font-display text-xl font-bold text-leaf-900">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt>{t('cart.subtotal')}</dt><dd>₹{subtotal}</dd></div>
                <div className="flex justify-between text-leaf-800/70"><dt>{t('cart.platformFee')} (5%)</dt><dd>₹{platformFee}</dd></div>
                <div className="flex justify-between text-leaf-800/70"><dt>{t('cart.delivery')}</dt><dd>₹{delivery}</dd></div>
                <div className="border-t border-leaf-200 pt-2 flex justify-between font-bold text-leaf-900">
                  <dt>{t('cart.total')}</dt><dd>₹{total}</dd>
                </div>
              </dl>
              <button onClick={proceed} className="btn-primary mt-6 w-full">{t('cart.checkout')} →</button>
              <button onClick={clear} className="mt-2 w-full text-xs text-leaf-800/60 hover:text-red-600">Clear cart</button>
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
}
