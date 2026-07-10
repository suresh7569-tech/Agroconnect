import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-leaf-900 py-14 text-leaf-100">
      <div className="container-page grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-500 text-white font-bold">A</span>
            <span className="font-display text-xl font-bold">AgroConnect</span>
          </div>
          <p className="mt-4 text-sm text-leaf-200/80 max-w-xs">
            An AgriTech platform connecting India&apos;s farmers to city consumers through procurement centers,
            quality inspection, city stores, and smart mobile vans.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-leaf-200">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-leaf-100/80">
            <li><Link to="/products" className="hover:text-white">All products</Link></li>
            <li><Link to="/stores" className="hover:text-white">Store locator</Link></li>
            <li><Link to="/mobile-vans" className="hover:text-white">Mobile van tracker</Link></li>
            <li><Link to="/farm-videos" className="hover:text-white">Farm videos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-leaf-200">For farmers</h4>
          <ul className="mt-4 space-y-2 text-sm text-leaf-100/80">
            <li><Link to="/register/farmer" className="hover:text-white">List your farm</Link></li>
            <li><Link to="/contact" className="hover:text-white">Farmer support</Link></li>
            <li><Link to="/about" className="hover:text-white">How the supply chain works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-leaf-200">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-leaf-100/80">
            <li><Link to="/about" className="hover:text-white">About AgroConnect</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact us</Link></li>
            <li><Link to="/admin" className="hover:text-white">Admin dashboard</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-page mt-10 border-t border-leaf-700 pt-6 text-xs text-leaf-300 flex flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} AgroConnect Technologies Pvt Ltd. All rights reserved.</p>
        <p>Made with 🌱 for India&apos;s farmers.</p>
      </div>
    </footer>
  );
}
