import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import FeaturedFarms from '../components/FeaturedFarms.jsx';
import FarmVisit from '../components/FarmVisit.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CTA from '../components/CTA.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedFarms />
        <FarmVisit />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
