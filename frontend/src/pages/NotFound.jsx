import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell.jsx';

export default function NotFound() {
  return (
    <PageShell>
      <section className="container-page py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-leaf-900">Nothing grows here.</h1>
        <p className="mt-3 text-leaf-800/70">The page you were looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-8">Back to home</Link>
      </section>
    </PageShell>
  );
}
