import { featuredFarms } from '../data/mockFarms.js';

export default function FeaturedFarms() {
  return (
    <section id="farms" className="bg-leaf-50/60 py-24">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">Featured farms</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">
              Meet the people growing your food.
            </h2>
            <p className="mt-4 text-leaf-800/70">
              Every farm on AgroConnect is manually verified — government ID, land documents, and a video walkthrough of their fields.
            </p>
          </div>
          <a href="#marketplace" className="btn-secondary">View all farms →</a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredFarms.map(f => (
            <article key={f.id} className="group overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-leaf-100">
                <img
                  src={f.hero}
                  alt={`${f.farmName} in ${f.village}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-leaf-900">{f.farmName}</h3>
                  <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-xs font-semibold text-leaf-700">
                    ★ {f.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-leaf-800/70">
                  by {f.farmer} · {f.village}, {f.district}
                </p>
                <p className="mt-3 text-sm text-leaf-800/85">{f.tagline}</p>

                <div className="mt-5 flex items-center justify-between border-t border-leaf-100 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-earth-600">{f.certified}</span>
                  <span className="text-xs text-leaf-700/70">{f.orders} orders</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
