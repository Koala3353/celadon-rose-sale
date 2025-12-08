import { 
  INITIAL_PRODUCTS, 
  CACHE_KEY_PRODUCTS, 
  CACHE_KEY_FILTERS,
  CACHE_DURATION_MS, 
  SHEET_API_URL,
  API_BASE_URL
} from '../constants';
import { Product, OrderFormData, CartItem, Order, ProductFilters } from '../types';

interface CachedData {
  timestamp: number;
  products: Product[];
}

interface CachedFilters {
  timestamp: number;
  categories: string[];
  tags: string[];
  priceRange: { min: number; max: number };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  cacheAge?: number;
}

// Clear product cache on page load/refresh to always get latest data from API
// The API server has its own caching with the Google Sheet data
if (typeof window !== 'undefined') {
  localStorage.removeItem(CACHE_KEY_PRODUCTS);
  localStorage.removeItem(CACHE_KEY_FILTERS);
  console.log('Page load - cleared local product cache to fetch fresh from API');
}

/**
 * Fetches products from the API server (which caches Google Sheets data)
 */
export const fetchProducts = async (): Promise<Product[]> => {
  // Check local cache first for instant loading
  const cached = localStorage.getItem(CACHE_KEY_PRODUCTS);
  
  if (cached) {
    const parsed: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Use shorter local cache since API has its own caching
    if (now - parsed.timestamp < CACHE_DURATION_MS) {
      console.log('Serving products from local cache');
      return parsed.products;
    }
  }

  try {
    // Fetch from API server
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Product[]> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch products');
    }
    
    const products = result.data;
    
    // Cache locally
    const newCache: CachedData = {
      timestamp: Date.now(),
      products
    };
    localStorage.setItem(CACHE_KEY_PRODUCTS, JSON.stringify(newCache));
    
    console.log(`Fetched ${products.length} products from API (cached: ${result.cached}, age: ${result.cacheAge}ms)`);
    return products;
    
  } catch (error) {
    console.error('Failed to fetch from API, trying fallback:', error);
    
    // Return cached data if available (even if expired)
    if (cached) {
      const parsed: CachedData = JSON.parse(cached);
      console.log('Serving expired local cache due to fetch error');
      return parsed.products;
    }
    
    // Last resort: use initial products
    console.log('Using fallback products');
    return INITIAL_PRODUCTS;
  }
};

/**
 * Fetches filter options from the API
 */
export const fetchFilters = async (): Promise<CachedFilters | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/filters`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<CachedFilters> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch filters');
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to fetch filters:', error);
    return null;
  }
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
 * Clears the products cache (useful for forcing a refresh)
 */
export const clearProductsCache = (): void => {
  localStorage.removeItem(CACHE_KEY_PRODUCTS);
  localStorage.removeItem(CACHE_KEY_FILTERS);
  console.log('Products cache cleared');
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
  status: string;
  assignedDoveEmail: string;
}

export const submitOrder = async (orderData: any, paymentProof: File): Promise<boolean> => {
  // Use FormData to support file upload
  const formData = new FormData();
  
  formData.append('orderData', JSON.stringify(orderData));
  
  // Add payment proof file if provided
  if (paymentProof) {
    formData.append('paymentProof', paymentProof);
  }

  try {
    // Submit to API server (include credentials for session cookie)
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      credentials: 'include',
      body: formData  // Don't set Content-Type header - browser will set it with boundary
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to submit order');
    }

    console.log("Order submitted successfully:", result.data);

    // Store locally for order history
    const newOrder: Order = {
      ...(orderData as OrderFormData),
      id: result.data?.orderId || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      status: 'Pending',
      items: orderData.items,
    };

    const existingOrdersStr = localStorage.getItem(ORDERS_KEY);
    const existingOrders: Order[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
    localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...existingOrders]));

    return true;
  } catch (error) {
    console.error("Failed to submit order:", error);
    return false;
  }
};

export const fetchUserOrders = async (email: string): Promise<SheetOrder[]> => {
  try {
    // Fetch orders from API (which reads from Google Sheet Orders tab)
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      credentials: 'include', // Include session cookie for authentication
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('User not authenticated, returning empty orders');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch orders');
    }

    console.log(`Fetched ${result.data.length} orders for ${email} from API`);
    return result.data;
    
  } catch (error) {
    console.error('Failed to fetch orders from API:', error);
    return [];
  }
};

/**
 * Track a page view for analytics
 */
export const trackPageView = async (page: 'home' | 'shop' | 'product', productId?: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ page, productId }),
    });
  } catch (error) {
    // Silently fail - analytics should not affect user experience
    console.debug('Analytics tracking failed:', error);
  }
};

/**
 * Fetch analytics data
 */
export const fetchAnalytics = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
};