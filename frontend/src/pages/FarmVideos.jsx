import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell.jsx';
import { Select } from '../components/FormField.jsx';
import { api } from '../lib/api.js';

const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'sowing', label: 'Sowing' },
  { value: 'growing', label: 'Growing' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'processing', label: 'Processing' },
  { value: 'story', label: 'Farmer stories' },
];

export default function FarmVideos() {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState('');
  const [active, setActive] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api.listVideos({ category })
      .then(({ videos }) => {
        if (cancelled) return;
        setVideos(videos);
        setStatus('ok');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [category]);

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-14">
          <p className="eyebrow">Farm Videos</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">See exactly how your food is grown</h1>
          <p className="mt-3 max-w-2xl text-leaf-800/70">
            Every crop on AgroConnect comes with cultivation footage from the farmer&apos;s own phone. No stock imagery.
            Real hands, real fields, real harvest days.
          </p>
          <div className="mt-8 max-w-xs">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </Select>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        {status === 'loading' && <p className="text-leaf-800/60">Loading videos…</p>}
        {status === 'error' && <p className="text-red-600">Could not load videos.</p>}
        {status === 'ok' && videos.length === 0 && <p className="text-leaf-800/60">No videos yet in this category.</p>}
        {status === 'ok' && videos.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map(v => (
              <button
                type="button"
                key={v._id}
                onClick={() => setActive(v)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-leaf-100 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-video overflow-hidden bg-leaf-100">
                  <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition group-hover:opacity-100">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-leaf-800">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {fmt(v.durationSec)}
                  </span>
                </div>
                <div className="flex-1 p-4">
                  <span className="eyebrow">{v.category}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold text-leaf-900 line-clamp-2">{v.title}</h3>
                  <p className="mt-2 text-sm text-leaf-800/70">{v.farmName} · {v.farmerName}</p>
                  <p className="mt-1 text-xs text-leaf-700">{v.views?.toLocaleString?.() ?? v.views} views</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={() => setActive(null)}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full bg-black">
              <iframe title={active.title} src={active.url} className="h-full w-full" allow="autoplay" allowFullScreen />
            </div>
            <div className="p-5">
              <span className="eyebrow">{active.category}</span>
              <h3 className="mt-1 font-display text-xl font-bold text-leaf-900">{active.title}</h3>
              <p className="mt-1 text-sm text-leaf-800/70">{active.farmName} · {active.farmerName}</p>
              {active.description && <p className="mt-2 text-sm text-leaf-800/80">{active.description}</p>}
              <button className="btn-secondary mt-4" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function fmt(sec) {
  if (!sec && sec !== 0) return '';
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
