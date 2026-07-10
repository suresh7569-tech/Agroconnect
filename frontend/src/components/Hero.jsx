import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-leaf-50 via-white to-white">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-leaf-200 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-earth-200 blur-3xl" />
      </div>

      <div className="container-page grid gap-12 py-20 md:grid-cols-2 md:py-28 items-center">
        <div>
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] text-leaf-900 sm:text-5xl md:text-6xl">
            {t('hero.title')}{' '}
            <span className="text-leaf-600">{t('hero.titleAccent')}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-leaf-800/80">{t('hero.body')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/marketplace" className="btn-primary">{t('hero.shop')}</a>
            <a href="/register/farmer" className="btn-secondary">{t('hero.farmer')}</a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">{t('hero.kpiFarms')}</dt>
              <dd className="mt-1 text-2xl font-bold text-leaf-900">120+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">{t('hero.kpiVillages')}</dt>
              <dd className="mt-1 text-2xl font-bold text-leaf-900">40+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">{t('hero.kpiOrders')}</dt>
              <dd className="mt-1 text-2xl font-bold text-leaf-900">8,500+</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-leaf-100 bg-leaf-100 shadow-xl">
            <img
              src="/images/jonathan-borba-3bypBTqc2AY-unsplash.jpg"
              alt="Farmer holding harvested organic produce"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>

          <div className="absolute -left-6 bottom-8 hidden rounded-2xl border border-leaf-100 bg-white p-4 shadow-lg sm:block max-w-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-leaf-100 text-leaf-700">▶</div>
              <div>
                <p className="text-xs uppercase tracking-wider text-leaf-700/70">Cultivation video</p>
                <p className="text-sm font-semibold text-leaf-900">Watch how it was grown</p>
              </div>
            </div>
          </div>

    
        </div>
      </div>
    </section>
  );
}
