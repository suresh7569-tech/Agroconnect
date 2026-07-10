export default function CTA() {
  return (
    <section className="bg-earth-50 py-24">
      <div className="container-page">
        <div className="grid gap-10 rounded-3xl border border-earth-200 bg-white p-8 shadow-sm md:grid-cols-2 md:p-14 items-center">
          <div>
            <p className="eyebrow text-earth-600">Two doors. One mission.</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">
              Join AgroConnect today.
            </h2>
            <p className="mt-4 text-leaf-800/70">
              Whether you&apos;re a farmer looking for fair prices or a family looking for real food, we&apos;d love to have you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="/register/farmer"
              className="rounded-2xl border-2 border-leaf-500 bg-leaf-50 p-6 transition hover:border-leaf-600 hover:bg-leaf-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-leaf-700">I&apos;m a farmer</p>
              <h3 className="mt-2 font-display text-xl font-bold text-leaf-900">List my crops</h3>
              <p className="mt-2 text-sm text-leaf-800/70">Reach customers directly. Set your own price. Keep more of what you earn.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-leaf-700">Start selling →</span>
            </a>

            <a
              href="/register/consumer"
              className="rounded-2xl border-2 border-earth-400 bg-earth-50 p-6 transition hover:border-earth-500 hover:bg-earth-100"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-earth-700">I&apos;m a consumer</p>
              <h3 className="mt-2 font-display text-xl font-bold text-leaf-900">Shop fresh produce</h3>
              <p className="mt-2 text-sm text-leaf-800/70">Discover verified organic farmers near you. Order or visit — your choice.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-earth-700">Start shopping →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
