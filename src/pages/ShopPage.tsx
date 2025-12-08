import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import CartDrawer from '../components/CartDrawer';
import { fetchProducts, trackPageView } from '../services/sheetService';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

  const { data: products, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Track shop page view
  useEffect(() => {
    trackPageView('shop');
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map((p) => p.category))].filter(Boolean);
    return cats.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
      default:
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 pt-20 md:pt-24">
      <CartDrawer />

      {/* Hero Section */}
      <motion.div
        className="relative py-12 md:py-20 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 rose-pattern opacity-20" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-playfair font-bold mb-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="gradient-text">Our Collection</span>
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover our handcrafted rose arrangements, perfect for every special moment
          </motion.p>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <motion.div
          className="glass rounded-2xl p-4 md:p-6 shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search roses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-field"
              >
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-800">
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-800">
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-gray-500 hover:text-rose-600"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4" />
            <p className="text-gray-500">Loading our beautiful roses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-rose-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-600 text-lg">Oops! Something went wrong.</p>
            <p className="text-gray-400">Please try refreshing the page.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-rose-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No roses found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopPage;