import {
  CACHE_KEY_PRODUCTS,
  CACHE_KEY_FILTERS,
} from '../constants';
import { Product, OrderFormData, Order, ProductFilters } from '../types';

interface CachedFilters {
  timestamp: number;
  categories: string[];
  tags: string[];
  priceRange: { min: number; max: number };
}

/**
 * Product fetch result with fallback indicator
 */
export interface ProductsResult {
  products: Product[];
  isFallback: boolean;
  isExpiredCache: boolean;
}

// ─── STATIC / ARCHIVED MODE ────────────────────────────────────────────────────
// The rose sale has ended. All data is now served from a static JSON snapshot
// so the website works without the API for portfolio purposes.
// ────────────────────────────────────────────────────────────────────────────────

let _cachedProducts: Product[] | null = null;

/**
 * Loads products from the static JSON snapshot (public/products.json).
 */
const loadStaticProducts = async (): Promise<Product[]> => {
  if (_cachedProducts) return _cachedProducts;

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}products.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: Product[] = await response.json();
    _cachedProducts = data;
    console.log(`Loaded ${data.length} products from static JSON`);
    return data;
  } catch (error) {
    console.error('Failed to load static products:', error);
    return [];
  }
};

/**
 * Fetches products — now loads from static JSON instead of the API.
 */
export const fetchProducts = async (): Promise<ProductsResult> => {
  const products = await loadStaticProducts();
  // Filter to only show "available" products (same as API's default behavior)
  const available = products.filter(p => p.available !== false);
  return { products: available, isFallback: false, isExpiredCache: false };
};

/**
 * Fetches ALL products including unavailable ones.
 * Used for bundle configuration to display correct product names.
 */
export const fetchAllProducts = async (): Promise<ProductsResult> => {
  const products = await loadStaticProducts();
  return { products, isFallback: false, isExpiredCache: false };
};

/**
 * Fetches filter options — derived from static products.
 */
export const fetchFilters = async (): Promise<CachedFilters | null> => {
  const products = await loadStaticProducts();
  const available = products.filter(p => p.available !== false);
  return extractFilters(available);
};

/**
 * Extracts available filter options from products
 */
export const extractFilters = (products: Product[]): CachedFilters => {
  const categories = [...new Set(products.map(p => p.category))].sort();
  const allTags = products.flatMap(p => p.tags || []);
  const tags = [...new Set(allTags)].sort();

  const prices = products.map(p => p.price);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };

  return {
    timestamp: Date.now(),
    categories,
    tags,
    priceRange
  };
};

/**
 * Filters products based on given criteria
 */
export const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Stock filter
    if (filters.inStock && product.stock <= 0) {
      return false;
    }

    // Tags filter (product must have at least one matching tag)
    if (filters.tags && filters.tags.length > 0) {
      const productTags = product.tags || [];
      const hasMatchingTag = filters.tags.some(tag => productTags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description?.toLowerCase().includes(query);
      const matchesCategory = product.category.toLowerCase().includes(query);
      const matchesTags = product.tags?.some(t => t.toLowerCase().includes(query));

      if (!matchesName && !matchesDescription && !matchesCategory && !matchesTags) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Clears the products cache (no-op in archived mode)
 */
export const clearProductsCache = (): void => {
  localStorage.removeItem(CACHE_KEY_PRODUCTS);
  localStorage.removeItem(CACHE_KEY_FILTERS);
};

// Simulate "Server-Side" DB using LocalStorage for demo purposes
const ORDERS_KEY = 'rose_sale_orders_db';

/**
 * Order data from the Google Sheet Orders tab
 */
export interface SheetOrder {
  orderId: string;
  timestamp: string;
  email: string;
  purchaserName: string;
  studentId: string;
  contactNumber: string;
  facebookLink: string;
  recipientName: string;
  recipientContact: string;
  recipientFbLink: string;
  anonymous: boolean;
  deliveryDate1: string;
  time1: string;
  venue1: string;
  room1: string;
  deliveryDate2: string;
  time2: string;
  venue2: string;
  room2: string;
  cartItems: string;
  bundleDetails: string;
  advocacyDonation: number;
  msgBeneficiary: string;
  msgRecipient: string;
  notes: string;
  total: number;
  payment: number;
  status: string;
  paymentConfirmed: boolean;
  assignedDoveEmail: string;
}

/**
 * Submit order — ARCHIVED MODE: generates a fake order ID locally.
 * No data is sent to the API. The checkout flow still "works" for
 * portfolio demo purposes, but nothing is actually processed.
 */
export const submitOrder = async (orderData: any, paymentProof: File): Promise<string | null> => {
  // Simulate a small delay like a real API call
  await new Promise(resolve => setTimeout(resolve, 800));

  const orderId = 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  // Store locally for demo order history
  const newOrder: Order = {
    ...(orderData as OrderFormData),
    id: orderId,
    date: new Date().toISOString(),
    status: 'Pending',
    items: orderData.items,
  };

  const existingOrdersStr = localStorage.getItem(ORDERS_KEY);
  const existingOrders: Order[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
  localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...existingOrders]));

  console.log('Demo order created:', orderId);
  return orderId;
};

/**
 * Fetch user orders — ARCHIVED MODE: returns empty array.
 */
export const fetchUserOrders = async (_email: string): Promise<SheetOrder[]> => {
  return [];
};

/**
 * Search for an order by ID — ARCHIVED MODE: returns null.
 */
export const searchOrder = async (_orderId: string): Promise<SheetOrder | null> => {
  return null;
};

/**
 * Track a page view — ARCHIVED MODE: no-op.
 */
export const trackPageView = async (_page: 'home' | 'shop' | 'product', _productId?: string): Promise<void> => {
  // Analytics disabled — sale has ended
};

/**
 * Fetch analytics data — ARCHIVED MODE: returns null.
 */
export const fetchAnalytics = async (): Promise<any> => {
  return null;
};

/**
 * Best seller product with sold count
 */
export interface BestSellerProduct extends Product {
  soldCount: number;
  originalStock: number;
  availableStock: number;
}

/**
 * Fetch best sellers — ARCHIVED MODE: returns empty array.
 * Best seller data requires live inventory comparison which is no longer available.
 */
export const fetchBestSellers = async (_limit: number = 6): Promise<BestSellerProduct[]> => {
  return [];
};