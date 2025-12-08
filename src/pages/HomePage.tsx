import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, trackPageView } from '../services/sheetService';
import { Product } from '../types';

// Floating petal component
const FloatingPetal = ({ delay, duration, left }: { delay: number; duration: number; left: string }) => (
  <motion.div
    className="petal text-rose-300"
    style={{ left }}
    initial={{ y: -50, rotate: 0, opacity: 0 }}
    animate={{ y: '100vh', rotate: 720, opacity: [0, 1, 1, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 9 9.5 11 12 11C14.5 11 16.5 9 16.5 6.5C16.5 4 14.5 2 12 2Z" />
    </svg>
  </motion.div>
);

const HomePage = () => {
  const [petals, setPetals] = useState<{ id: number; delay: number; duration: number; left: string }[]>([]);

  // Fetch products for featured section
  const { data: products } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Get featured products (low stock items - selling fast!)
  const featuredProducts = products
    ?.filter(p => p.stock > 0 && p.stock <= 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 4) || [];

  // Get popular products (random selection, excluding featured items)
  const popularProducts = useMemo(() => {
    if (!products) return [];
    const featuredIds = new Set(featuredProducts.map(p => p.id));
    const available = products.filter(p => p.stock > 0 && !featuredIds.has(p.id));
    // Shuffle and take up to 4
    let shuffled = [...available].sort(() => Math.random() - 0.5);
    if (shuffled.length >= 4) {
      return shuffled.slice(0, 4);
    }
    // If less than 4, fill with featured products (not already included)
    const needed = 4 - shuffled.length;
    const featuredFill = featuredProducts.filter(p => !shuffled.some(sp => sp.id === p.id)).slice(0, needed);
    let result = [...shuffled, ...featuredFill];
    // If still less than 4, fill with any other products (not already included)
    if (result.length < 4) {
      const allIds = new Set(result.map(p => p.id));
      const extra = products.filter(p => !allIds.has(p.id)).slice(0, 4 - result.length);
      result = [...result, ...extra];
    }
    return result;
  }, [products, featuredProducts]);

  useEffect(() => {
    const newPetals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 6,
      left: `${Math.random() * 100}%`,
    }));
    setPetals(newPetals);
    
    // Track home page view
    trackPageView('home');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-rose-100" />
      <div className="absolute inset-0 rose-pattern opacity-30" />
      
      {/* Floating petals */}
      {petals.map((petal) => (
        <FloatingPetal key={petal.id} {...petal} />
      ))}

      {/* Decorative circles */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-rose-300 to-rose-400 rounded-full opacity-20 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="inline-block p-6 bg-white rounded-full shadow-2xl animate-pulse-glow">
              <svg className="w-16 h-16 md:w-20 md:h-20 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 9 9.5 11 12 11C14.5 11 16.5 9 16.5 6.5C16.5 4 14.5 2 12 2Z" />
                <path d="M6 8C4 8 2 10 2 12C2 14 4 16 6 16C8 16 10 14 10 12C10 10 8 8 6 8Z" opacity="0.8" />
                <path d="M18 8C16 8 14 10 14 12C14 14 16 16 18 16C20 16 22 14 22 12C22 10 20 8 18 8Z" opacity="0.8" />
                <path d="M12 13C9.5 13 7.5 15 7.5 17.5C7.5 20 9.5 22 12 22C14.5 22 16.5 20 16.5 17.5C16.5 15 14.5 13 12 13Z" opacity="0.9" />
                <circle cx="12" cy="12" r="3" fill="#fda4af" />
              </svg>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text">Rose Sale</span>{' '}
            <span className="text-rose-600">2026</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-4 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Exquisite bouquets for every occasion
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="text-sm md:text-base text-gray-500 mb-10 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Handcrafted with love, delivered with care. Make every moment special with our premium rose collections.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/shop">
              <motion.button
                className="btn-primary text-lg px-10 py-4 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Shop Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
            <Link to="/shop">
              <motion.button
                className="btn-secondary text-lg px-10 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Collection
              </motion.button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { icon: '🌹', title: 'Fresh Roses', desc: 'Handpicked daily' },
              { icon: '🎁', title: 'Gift Wrapped', desc: 'Beautifully packaged' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day available' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="text-center p-6 glass rounded-2xl"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <span className="text-4xl mb-3 block">{feature.icon}</span>
                <h3 className="font-playfair font-bold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Featured Products - Selling Fast */}
        {featuredProducts.length > 0 && (
          <motion.section
            className="mt-24 max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.7 3.7-.4.5-.7 1.1-.7 1.8 0 1.5 1.3 2.8 2.8 2.8.3 0 .5 0 .7-.1v5.3c0 1 .8 2 2 2s2-1 2-2v-5.3c.2.1.5.1.7.1 1.5 0 2.8-1.3 2.8-2.8 0-.7-.3-1.3-.7-1.8 1-1 1.7-2.2 1.7-3.7C16.5 4 14.5 2 12 2z"/>
                </svg>
                Selling Fast
              </span>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
                Limited Stock Available
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                These roses are flying off the shelves! Grab them before they're gone.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="glass rounded-2xl overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.7 3.7-.4.5-.7 1.1-.7 1.8 0 1.5 1.3 2.8 2.8 2.8.3 0 .5 0 .7-.1v5.3c0 1 .8 2 2 2s2-1 2-2v-5.3c.2.1.5.1.7.1 1.5 0 2.8-1.3 2.8-2.8 0-.7-.3-1.3-.7-1.8 1-1 1.7-2.2 1.7-3.7C16.5 4 14.5 2 12 2z"/>
                      </svg>
                    )}
                    <span className="absolute top-3 right-3 px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                      Only {product.stock} left!
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-rose-600">₱{product.price.toFixed(2)}</span>
                      <Link to="/shop">
                        <motion.button
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-full transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Products */}
        {popularProducts.length > 0 && (
          <motion.section
            className="mt-24 max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
                Popular Picks
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Our most loved rose arrangements, handpicked for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="glass rounded-2xl overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.7 3.7-.4.5-.7 1.1-.7 1.8 0 1.5 1.3 2.8 2.8 2.8.3 0 .5 0 .7-.1v5.3c0 1 .8 2 2 2s2-1 2-2v-5.3c.2.1.5.1.7.1 1.5 0 2.8-1.3 2.8-2.8 0-.7-.3-1.3-.7-1.8 1-1 1.7-2.2 1.7-3.7C16.5 4 14.5 2 12 2z"/>
                      </svg>
                    )}
                    {product.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-white/80 text-gray-700 text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-rose-600">₱{product.price.toFixed(2)}</span>
                      <Link to="/shop">
                        <motion.button
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-full transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/shop">
                <motion.button
                  className="btn-secondary text-lg px-10 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Products
                </motion.button>
              </Link>
            </div>
          </motion.section>
        )}

        {/* How It Works Section */}
        <motion.section
          className="mt-24 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Sending roses has never been easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Your Roses', desc: 'Browse our collection and pick your favorites', icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )},
              { step: '2', title: 'Add Your Message', desc: 'Include a heartfelt note for your recipient', icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )},
              { step: '3', title: 'We Deliver', desc: 'Your roses are hand-delivered with care', icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              )},
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-6"
                whileHover={{ y: -5 }}
              >
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-playfair font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="mt-24 mb-20 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-pink-400/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                Ready to Spread Some Love?
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Make someone's day special with a beautiful rose arrangement. Order now and brighten their world.
              </p>
              <Link to="/shop">
                <motion.button
                  className="btn-primary text-lg px-12 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Shopping
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;