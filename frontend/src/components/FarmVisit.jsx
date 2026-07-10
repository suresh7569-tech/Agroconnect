const packages = [
  {
    name: 'Basic Tour',
    price: '₹199',
    perks: ['Guided walkthrough with the farmer', 'See how organic food is really grown', 'Photo opportunities on the farm'],
    highlight: false,
  },
  {
    name: 'Harvest Experience',
    price: '₹499',
    perks: ['Everything in Basic Tour', 'Harvest produce yourself', 'Buy at farm price — zero platform fee'],
    highlight: true,
  },
  {
    name: 'Full Day Stay',
    price: '₹999',
    perks: ['Full-day immersion on the farm', 'Home-cooked farm-fresh meals', 'Farm experience certificate'],
    highlight: false,
  },
];

export default function FarmVisit() {
  return (
    <section id="visit" className="bg-white py-24">
      <div className="container-page grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <p className="eyebrow">Farm visits & agri-tourism</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-leaf-900 sm:text-4xl">
            Don&apos;t just order the food. Visit where it grows.
          </h2>
          <p className="mt-4 max-w-lg text-leaf-800/70">
            Pack the kids, take a weekend, and see for yourself. AgroConnect farms welcome visitors — walk the fields,
            harvest what&apos;s ripe, and take it home at farmer-set prices.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-leaf-800/85">
            <li className="flex items-start gap-2"><span className="mt-1 text-leaf-600">✓</span>Group bookings for families, schools, corporate wellness trips</li>
            <li className="flex items-start gap-2"><span className="mt-1 text-leaf-600">✓</span>Full refund if you cancel more than 48 hours ahead</li>
            <li className="flex items-start gap-2"><span className="mt-1 text-leaf-600">✓</span>Photo opportunity + farm experience certificate</li>
          </ul>
        </div>

        <div className="grid gap-4">
          {packages.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 shadow-sm ${
                p.highlight
                  ? 'border-leaf-500 bg-leaf-50 ring-1 ring-leaf-500'
                  : 'border-leaf-100 bg-white'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-bold text-leaf-900">{p.name}</h3>
                <span className="font-display text-2xl font-black text-leaf-700">{p.price}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-leaf-800/80">
                {p.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2"><span className="mt-1 text-leaf-600">•</span>{perk}</li>
                ))}
              </ul>
              {p.highlight && <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-leaf-700">Most booked</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
