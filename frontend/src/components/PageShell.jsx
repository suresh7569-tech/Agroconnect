import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PageShell({ children, footer = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      {footer && <Footer />}
    </div>
  );
}
