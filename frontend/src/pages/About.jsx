import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';

const PILLARS = [
  { t: 'Hyperlocal sourcing', d: 'Every crop is sourced from the closest verified farmer first, then shipped through the shortest cold chain.' },
  { t: 'Quality-first supply chain', d: 'Every batch passes through an AgroConnect procurement center for a physical quality check before it reaches a store.' },
  { t: 'Omnichannel retail', d: 'Home delivery, store pickup, or a smart mobile van — pick whichever fits your day.' },
  { t: 'Radical transparency', d: 'You can see the farmer, the field, and a video of your food being grown.' },
  { t: 'Fair farmer payouts', d: 'Farmers get paid directly, on schedule, at a rate they set — no middlemen skimming margins.' },
  { t: 'Zero-waste operations', d: 'Freshness scoring + demand forecasting keep spoilage under 2% end-to-end.' },
];

const FLOW = [
  { t: '1. Farmer supplies produce', d: 'Registered farmers list crops with photos, price, and harvest date.' },
  { t: '2. Procurement center', d: 'Produce is collected at the nearest AgroConnect procurement hub.' },
  { t: '3. Quality inspection', d: 'A trained inspector grades the batch, records a freshness score, and rejects anything below the bar.' },
  { t: '4. AgroConnect store', d: 'Passed batches are dispatched to city stores or loaded onto smart mobile vans.' },
  { t: '5. To the consumer', d: 'Delivery, in-store pickup, or from the van at your street. Feedback loop closes with a review.' },
];

export default function About() {
  return (
    <PageShell>
      <section className="border-b border-leaf-100 bg-gradient-to-b from-leaf-50 to-white">
        <div className="container-page py-16">
          <p className="eyebrow">About AgroConnect</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-leaf-900 sm:text-5xl">A supply chain that treats both sides fairly.</h1>
          <p className="mt-4 max-w-3xl text-lg text-leaf-800/70">
            AgroConnect is an AgriTech platform that connects Indian farmers to city consumers through a curated procurement network,
            physical quality inspection, and three purchase modes: home delivery, in-store pickup, and a smart mobile van at your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/marketplace" className="btn-primary">Shop the marketplace</Link>
            <Link to="/stores" className="btn-secondary">Find a store</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">The problem</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-leaf-900">Farmers underpaid. Consumers under-informed.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-leaf-900">For farmers</h3>
            <ul className="mt-3 space-y-2 text-sm text-leaf-800/80">
              <li>• 6–8 middlemen between the field and the plate.</li>
              <li>• Prices unpredictable, paid in cash, weeks late.</li>
              <li>• No demand signal — you plant, you pray.</li>
              <li>• No path to build a brand or repeat customers.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-leaf-100 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-leaf-900">For consumers</h3>
            <ul className="mt-3 space-y-2 text-sm text-leaf-800/80">
              <li>• No idea where the food actually came from.</li>
              <li>• Quality varies wildly, batch to batch.</li>
              <li>• Delivery-only apps skip whole neighborhoods.</li>
              <li>• Zero trust that &quot;organic&quot; on the label means anything.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-leaf-100 bg-leaf-50">
        <div className="container-page py-16">
          <p className="eyebrow">Six pillars</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-leaf-900">How AgroConnect is built.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(p => (
              <div key={p.t} className="rounded-2xl border border-leaf-100 bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-leaf-900">{p.t}</h3>
                <p className="mt-2 text-sm text-leaf-800/80">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <p className="eyebrow">The flow</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-leaf-900">Farmer to your plate, step by step.</h2>
        <ol className="mt-8 space-y-3">
          {FLOW.map((s, i) => (
            <li key={s.t} className="flex items-start gap-4 rounded-2xl border border-leaf-100 bg-white p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf-600 text-lg font-bold text-white">{i + 1}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-leaf-900">{s.t}</h3>
                <p className="mt-1 text-sm text-leaf-800/80">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-leaf-100 bg-leaf-900 text-white">
        <div className="container-page py-16 text-center">
          <h2 className="font-display text-3xl font-bold">The road ahead</h2>
          <p className="mt-3 mx-auto max-w-2xl text-leaf-100/80">
            Blockchain traceability for every batch. IoT cold-chain sensors on every van. AI crop-recommendation models built on our own procurement data.
            Regional expansion across India, one district at a time.
          </p>
          <Link to="/contact" className="btn-primary mt-8 bg-white text-leaf-800 hover:bg-leaf-50">Partner with us</Link>
        </div>
      </section>
    </PageShell>
  );
}
