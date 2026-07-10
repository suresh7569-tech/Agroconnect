import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import { api } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';

function embedYouTube(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function CropDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { items, farmId: cartFarmId, addItem, clear } = useCart();

  const [crop, setCrop] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setCrop(null); setError('');
    api.getCrop(id).then(({ crop }) => setCrop(crop)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <PageShell><div className="container-page py-16 text-red-600">Could not load: {error}</div></PageShell>;
  if (!crop) return <PageShell><div className="container-page py-16 text-leaf-800/60">Loading…</div></PageShell>;

  const embed = embedYouTube(crop.videoUrl);
  const farm = crop.farmId || {};
  const conflict = items.length > 0 && cartFarmId && cartFarmId !== farm._id;

  const handleAdd = () => {
    if (conflict) {
      if (!confirm('Your cart has items from another farm. Clear it and add this?')) return;
      clear();
    }
    addItem({ ...crop, farmId: farm }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <PageShell>
      <div className="container-page py-10">
        <nav className="text-xs text-leaf-800/60"><Link to="/marketplace" className="hover:underline">← Marketplace</Link></nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-leaf-100 bg-leaf-100">
              <img src={crop.photos?.[0]} alt={crop.cropName} className="h-full w-full object-cover" />
            </div>
            {crop.photos?.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {crop.photos.slice(1, 5).map((src, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl bg-leaf-100">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {embed && (
              <div className="mt-6">
                <p className="eyebrow">Cultivation video</p>
                <div className="mt-2 aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe title="Cultivation video" src={embed} className="h-full w-full" allowFullScreen />
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div>
              <p className="eyebrow">{crop.category?.replace('_', ' ')}</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900">{crop.cropName}</h1>
              <p className="mt-3 text-leaf-800/80">{crop.description}</p>
            </div>

            <div className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-black text-leaf-800">₹{crop.pricePerUnit}<span className="text-base font-medium text-leaf-800/60">/{crop.unit}</span></span>
                <span className="text-xs text-leaf-800/60">{crop.availableQuantity} {crop.unit} available</span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-semibold text-leaf-900">Qty:</label>
                <div className="flex items-center rounded-full border border-leaf-200 bg-white">
                  <button onClick={() => setQty(Math.max(crop.minOrderQty || 1, qty - 1))} className="px-3 py-1.5 text-lg text-leaf-700">−</button>
                  <span className="px-3 text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(Math.min(crop.availableQuantity, qty + 1))} className="px-3 py-1.5 text-lg text-leaf-700">+</button>
                </div>
                <span className="text-xs text-leaf-800/60">min {crop.minOrderQty || 1} {crop.unit}</span>
              </div>

              <button onClick={handleAdd} className="btn-primary mt-5 w-full">
                {added ? '✓ Added to cart' : `Add to cart · ₹${crop.pricePerUnit * qty}`}
              </button>
              <button onClick={() => { handleAdd(); nav('/cart'); }} className="btn-secondary mt-2 w-full">
                Buy now
              </button>
            </div>

            <div className="rounded-2xl border border-leaf-100 bg-white p-5">
              <p className="eyebrow">From this farm</p>
              <Link to={`/farms/${farm._id}`} className="mt-2 block font-display text-xl font-bold text-leaf-900 hover:underline">
                {farm.farmName}
              </Link>
              {farm.location && (
                <p className="mt-1 text-sm text-leaf-800/70">{farm.location.village}, {farm.location.district}, {farm.location.state}</p>
              )}
              {farm.averageRating > 0 && (
                <p className="mt-2 text-sm text-leaf-800/80">★ {farm.averageRating.toFixed(1)} average rating</p>
              )}
              <Link to={`/farms/${farm._id}`} className="mt-3 inline-block text-sm font-semibold text-leaf-700 hover:underline">
                Visit farm profile →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
