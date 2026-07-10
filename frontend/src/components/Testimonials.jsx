import { testimonials } from '../data/mockFarms.js';

export default function Testimonials() {
  return (
    <section id="story" className="bg-leaf-800 py-24 text-leaf-50">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-200">Voices from the ground</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            The people we&apos;re building for.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.id} className="rounded-3xl bg-leaf-700/40 p-6 ring-1 ring-leaf-600/40">
              <svg className="h-6 w-6 text-leaf-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 7h4v10H3V13c0-3 1-5 4-6zm10 0h4v10h-8V13c0-3 1-5 4-6z" />
              </svg>
              <blockquote className="mt-4 text-lg leading-relaxed text-leaf-50/95">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-leaf-600/40 pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-leaf-200">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
