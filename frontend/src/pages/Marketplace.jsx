import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageShell from '../components/PageShell.jsx';
import CropCard from '../components/CropCard.jsx';
import { Field, Input, Select } from '../components/FormField.jsx';
import { api } from '../lib/api.js';

const CATEGORIES = ['vegetables', 'leafy_greens', 'fruits', 'grains', 'pulses', 'spices', 'dairy'];

export default function Marketplace() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ search: '', category: '', sort: 'newest', maxPrice: '' });
  const [crops, setCrops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    api.listCrops(filters)
      .then(({ crops }) => { if (!cancelled) { setCrops(crops); setStatus('ok'); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setStatus('error'); } });
    return () => { cancelled = true; };
  }, [filters]);

  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-14">
          <p className="eyebrow">{t('nav.marketplace')}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">{t('marketplace.title')}</h1>
          <p className="mt-3 max-w-2xl text-leaf-800/70">{t('marketplace.subtitle')}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr,180px,180px]">
            <Input
              placeholder={t('marketplace.search')}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">{t('marketplace.categoryAll')}</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </Select>
            <Select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="newest">{t('marketplace.newest')}</option>
              <option value="price_asc">{t('marketplace.priceAsc')}</option>
              <option value="price_desc">{t('marketplace.priceDesc')}</option>
            </Select>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        {status === 'loading' && <p className="text-leaf-800/60">Loading crops…</p>}
        {status === 'error' && <p className="text-red-600">Could not load crops: {error}</p>}
        {status === 'ok' && crops.length === 0 && <p className="text-leaf-800/60">{t('marketplace.empty')}</p>}
        {status === 'ok' && crops.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {crops.map(c => <CropCard key={c._id} crop={c} />)}
          </div>
        )}
      </section>
    </PageShell>
  );
}
