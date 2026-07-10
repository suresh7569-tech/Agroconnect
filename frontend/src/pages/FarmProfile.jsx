import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';
import CropCard from '../components/CropCard.jsx';
import { api } from '../lib/api.js';

export default function FarmProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null); setError('');
    api.getFarm(id).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <PageShell><div className="container-page py-16 text-red-600">Could not load: {error}</div></PageShell>;
  if (!data) return <PageShell><div className="container-page py-16 text-leaf-800/60">Loading…</div></PageShell>;

  const { farm, crops, reviews } = data;
  const loc = farm.location || {};
  const mapUrl = loc.lat && loc.lng
    ? `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=12&output=embed`
    : loc.village ? `https://maps.google.com/maps?q=${encodeURIComponent(`${loc.village} ${loc.district} ${loc.state}`)}&z=10&output=embed` : null;

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-12">
          <p className="eyebrow">Verified organic farm</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-leaf-900">{farm.farmName}</h1>
          {farm.farmerId?.name && <p className="mt-1 text-leaf-800/70">by {farm.farmerId.name}</p>}
          {loc.village && <p className="mt-3 text-sm text-leaf-800/70">📍 {loc.village}, {loc.district}, {loc.state} — {loc.pincode}</p>}
          <div className="mt-4 flex items-center gap-3">
            {farm.averageRating > 0 && (
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-semibold text-leaf-800">
                ★ {farm.averageRating.toFixed(1)} · {farm.totalReviews} reviews
              </span>
            )}
            {farm.certifications?.map((c) => (
              <span key={c} className="rounded-full bg-earth-100 px-3 py-1 text-xs font-semibold text-earth-700">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 grid gap-10 lg:grid-cols-[1.4fr,1fr]">
        <div>
          <h2 className="font-display text-2xl font-bold text-leaf-900">About</h2>
          <p className="mt-3 text-leaf-800/80">{farm.description || 'The farmer has not written a description yet.'}</p>

          <h2 className="mt-10 font-display text-2xl font-bold text-leaf-900">Crops from this farm</h2>
          {crops.length === 0 ? (
            <p className="mt-3 text-leaf-800/60">No listings right now — check back soon.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {crops.map(c => <CropCard key={c._id} crop={{ ...c, farmId: farm }} />)}
            </div>
          )}

          <h2 className="mt-10 font-display text-2xl font-bold text-leaf-900">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-leaf-800/60">No reviews yet — be the first once you order.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map(r => (
                <li key={r._id} className="rounded-2xl border border-leaf-100 bg-white p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold text-leaf-900">{r.consumerId?.name || 'Customer'}</p>
                    <p className="text-sm">{'★'.repeat(r.rating)}<span className="text-leaf-800/30">{'★'.repeat(5 - r.rating)}</span></p>
                  </div>
                  {r.reviewText && <p className="mt-2 text-sm text-leaf-800/80">{r.reviewText}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-6">
          {mapUrl && (
            <div className="overflow-hidden rounded-2xl border border-leaf-100">
              <iframe title="Farm location" src={mapUrl} className="h-64 w-full" />
            </div>
          )}
          <div className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6">
            <h3 className="font-display text-xl font-bold text-leaf-900">Visit this farm</h3>
            <p className="mt-2 text-sm text-leaf-800/70">
              Guided tours, harvest experiences, and full-day stays starting at ₹199.
            </p>
            <Link to={`/farms/${farm._id}/visit`} className="btn-primary mt-4 w-full">Book a visit</Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
