import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import RegisterConsumer from './pages/RegisterConsumer.jsx';
import RegisterFarmer from './pages/RegisterFarmer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import CropDetail from './pages/CropDetail.jsx';
import FarmProfile from './pages/FarmProfile.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import VisitBooking from './pages/VisitBooking.jsx';
import VisitConfirmed from './pages/VisitConfirmed.jsx';
import FarmerDashboard from './pages/FarmerDashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import NotFound from './pages/NotFound.jsx';
import StoreLocator from './pages/StoreLocator.jsx';
import MobileVanTracker from './pages/MobileVanTracker.jsx';
import FarmVideos from './pages/FarmVideos.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/products" element={<Marketplace />} />
      <Route path="/products/:id" element={<CropDetail />} />
      <Route path="/crops/:id" element={<CropDetail />} />
      <Route path="/farms/:id" element={<FarmProfile />} />
      <Route path="/farms/:id/visit" element={<VisitBooking />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/stores" element={<StoreLocator />} />
      <Route path="/mobile-vans" element={<MobileVanTracker />} />
      <Route path="/farm-videos" element={<FarmVideos />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/consumer" element={<RegisterConsumer />} />
      <Route path="/register/farmer" element={<RegisterFarmer />} />

      {/* Consumer-only */}
      <Route path="/checkout" element={<ProtectedRoute roles={['consumer']}><Checkout /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={['consumer']}><Orders /></ProtectedRoute>} />
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
      <Route path="/farmer-visits/confirmed" element={<ProtectedRoute><VisitConfirmed /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute roles={['consumer']}><Dashboard /></ProtectedRoute>} />

      {/* Farmer-only */}
      <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />

      {/* Admin-only */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
