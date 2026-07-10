import { Link } from 'react-router-dom';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-leaf-50 via-white to-earth-50/40">
      <div className="container-page py-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-600 text-white font-bold">A</span>
          <span className="font-display text-xl font-bold text-leaf-800">AgroConnect</span>
        </Link>
      </div>

      <div className="container-page pb-16">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-leaf-100 bg-white p-8 shadow-sm sm:p-10">
            <h1 className="font-display text-3xl font-bold text-leaf-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-leaf-800/70">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-4 text-center text-sm text-leaf-800/70">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
