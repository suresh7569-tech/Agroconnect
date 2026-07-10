import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();

  const dashboardPath =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'farmer' ? '/farmer' :
    '/dashboard';

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/stores', label: 'Stores' },
    { href: '/mobile-vans', label: 'Mobile Vans' },
    { href: '/farm-videos', label: 'Farm Videos' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-600 text-white font-bold">A</span>
          <span className="font-display text-xl font-bold text-leaf-800">AgroConnect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} to={l.href} className="text-sm font-medium text-leaf-800/80 hover:text-leaf-700">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/cart" className="relative rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-xs font-semibold text-leaf-800 hover:border-leaf-400">
            {t('nav.cart')}
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-leaf-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to={dashboardPath} className="text-sm font-semibold text-leaf-700 hover:text-leaf-800">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="btn-secondary">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-leaf-700 hover:text-leaf-800">{t('nav.login')}</Link>
              <Link to="/register/consumer" className="btn-primary">{t('nav.join')}</Link>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-leaf-800"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
              : <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-leaf-100 bg-white">
          <div className="container-page flex flex-col py-3">
            {links.map(l => (
              <Link key={l.href} to={l.href} className="py-2 text-sm font-medium text-leaf-800/80"
                 onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-leaf-800/80">
              {t('nav.cart')} ({count})
            </Link>
            <div className="mt-2 flex gap-3 items-center">
              <LanguageSwitcher className="flex-none" />
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => setOpen(false)} className="btn-secondary flex-1">{t('nav.dashboard')}</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="btn-primary flex-1">{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">{t('nav.login')}</Link>
                  <Link to="/register/consumer" onClick={() => setOpen(false)} className="btn-primary flex-1">{t('nav.join')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
