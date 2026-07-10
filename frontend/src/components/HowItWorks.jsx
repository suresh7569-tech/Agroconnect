const steps = [
  {
    n: '01',
    title: 'Discover verified farms',
    body: 'Browse organic listings with photos, cultivation videos, and real farmer stories from across rural India.',
  },
  {
    n: '02',
    title: 'Order or book a visit',
    body: 'Add produce to your cart or reserve a slot to visit the farm and harvest it yourself.',
  },
  {
    n: '03',
    title: 'Pay through escrow',
    body: 'Your payment is held safely until you confirm the produce arrived fresh — no risk, no surprises.',
  },
  {
    n: '04',
    title: 'Enjoy real food',
    body: 'Delivered within 24–48 hours of harvest. Rate the farmer and reorder from the ones you trust.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">
            From soil to your kitchen in four honest steps.
          </h2>
          <p className="mt-4 text-leaf-800/70">
            No middlemen. No mystery. Just a direct line from a real farmer to your table, with proof at every step.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(s => (
            <div key={s.n} className="rounded-2xl border border-leaf-100 bg-leaf-50/40 p-6 transition hover:border-leaf-300 hover:shadow-md">
              <span className="font-display text-3xl font-black text-leaf-300">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-leaf-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-leaf-800/75">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
