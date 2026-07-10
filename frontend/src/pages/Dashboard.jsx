import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const roleCopy = {
    consumer: {
      title: 'Welcome back',
      subtitle: 'Discover fresh produce from verified organic farmers across India.',
      primary: { label: 'Browse marketplace', href: '/marketplace' },
    },
    farmer: {
      title: user?.isVerified ? 'Your farm dashboard' : 'Almost there',
      subtitle: user?.isVerified
        ? 'Manage your crop listings, orders, and farm visit slots.'
        : 'Your account is with our team for verification. You can prepare your farm profile now — listings go live automatically once you\'re approved.',
      primary: { label: 'Add a crop listing', href: '/farmer/crops/new' },
    },
    admin: {
      title: 'Admin console',
      subtitle: 'Verify farmers, moderate listings, and manage the platform.',
      primary: { label: 'Open admin panel', href: '/admin' },
    },
  }[user?.role || 'consumer'];

  return (
    <div className="min-h-screen bg-leaf-50/40">
      <Navbar />
      <main className="container-page py-16">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-leaf-100">
          <p className="eyebrow">Signed in as {user?.role}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-leaf-900">{roleCopy.title}, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-2 max-w-xl text-leaf-800/70">{roleCopy.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={roleCopy.primary.href} className="btn-primary">{roleCopy.primary.label}</Link>
            <button onClick={logout} className="btn-secondary">Log out</button>
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">Email</dt>
              <dd className="mt-1 text-leaf-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">Phone</dt>
              <dd className="mt-1 text-leaf-900">+91 {user?.phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-leaf-700/70">Language</dt>
              <dd className="mt-1 text-leaf-900">{{ en: 'English', hi: 'हिंदी', te: 'తెలుగు', ta: 'தமிழ்' }[user?.preferredLanguage] || 'English'}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
