import { Link, useLocation } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';

export default function VisitConfirmed() {
  const { state } = useLocation();
  const visit = state?.visit;

  return (
    <PageShell>
      <section className="container-page py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-leaf-100 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-2xl">🌱</div>
          <h1 className="mt-4 font-display text-2xl font-bold text-leaf-900">Visit confirmed!</h1>
          {state?.farmName && <p className="mt-1 text-leaf-800/70">at {state.farmName}</p>}
          {visit && (
            <dl className="mt-6 grid gap-2 text-left text-sm">
              <div className="flex justify-between"><dt>Date</dt><dd>{new Date(visit.visitDate).toDateString()}</dd></div>
              <div className="flex justify-between"><dt>Slot</dt><dd>{visit.timeSlot}</dd></div>
              <div className="flex justify-between"><dt>Visitors</dt><dd>{visit.numberOfVisitors}</dd></div>
              <div className="flex justify-between font-bold text-leaf-900"><dt>Paid</dt><dd>₹{visit.totalAmount}</dd></div>
            </dl>
          )}
          <p className="mt-6 text-xs text-leaf-800/60">
            The farmer will reach out with directions and what to bring. See you soon.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/" className="btn-secondary">Back to home</Link>
            <Link to="/marketplace" className="btn-primary">Shop produce</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
