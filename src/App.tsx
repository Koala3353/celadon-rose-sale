import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import LoginModal from './components/LoginModal';
import OrderHistory from './components/OrderHistory';

const queryClient = new QueryClient();

function AppContent() {
  const [showCheckout, setShowCheckout] = useState(false);
  const { isCartOpen, setIsCartOpen } = useCart();
  const { showLoginModal, setShowLoginModal } = useAuth();
  const location = useLocation();

  // Reset checkout view when navigating to a different page
  useEffect(() => {
    setShowCheckout(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setShowCheckout(true);
        }}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <main className="flex-grow">
        {showCheckout ? (
          <CheckoutForm onBack={() => setShowCheckout(false)} />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Use basename for GitHub Pages subdirectory deployment
  const basename = import.meta.env.PROD ? '/celadon-rose-sale' : '';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router basename={basename}>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;