import { Product } from './types';

// API Server Configuration
// Read from Vite env variable when available for easy deployment overrides
// In development this falls back to the local API server
// Allow overriding the API URL with Vite's env variable VITE_API_BASE_URL
export const API_BASE_URL = ((import.meta as any)?.env?.VITE_API_BASE_URL) || 'http://localhost:3001/api';

// Google Sheets Configuration (kept for reference, API handles this now)
export const GOOGLE_SHEET_ID = '1zroV5ASCbTRLWnkl1k1eKkJG992OZqhetdH9u48QZeU';
export const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
export const SHEET_NAME = 'Products';

// Google Sheets API URL (legacy - now handled by API server)
export const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`;

// Fallback products (used when Google Sheets is unavailable)
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'rose-red', name: 'Red Rose', price: 100, category: 'Single', stock: 50, imageUrl: 'https://picsum.photos/seed/rose-red/300/300' },
  { id: 'rose-pink', name: 'Baby Pink Rose', price: 100, category: 'Single', stock: 45, imageUrl: 'https://picsum.photos/seed/rose-pink/300/300' },
  { id: 'rose-white', name: 'White Rose', price: 100, category: 'Single', stock: 30, imageUrl: 'https://picsum.photos/seed/rose-white/300/300' },
  { id: 'carn-pink', name: 'Baby Pink Carnation', price: 100, category: 'Single', stock: 40, imageUrl: 'https://picsum.photos/seed/carn-pink/300/300' },
  { id: 'carn-purple', name: 'Purple Carnation', price: 100, category: 'Single', stock: 25, imageUrl: 'https://picsum.photos/seed/carn-purp/300/300' },
  { id: 'carn-pomelo', name: 'Pomelo Carnation', price: 100, category: 'Single', stock: 20, imageUrl: 'https://picsum.photos/seed/carn-pom/300/300' },
  { id: 'tulip-pink', name: 'Pink Tulip', price: 250, category: 'Single', stock: 15, imageUrl: 'https://picsum.photos/seed/tulip-pink/300/300' },
  { id: 'tulip-yellow', name: 'Yellow Tulip', price: 250, category: 'Single', stock: 15, imageUrl: 'https://picsum.photos/seed/tulip-yell/300/300' },
  
  { id: 'bouq-mixed', name: 'Red, White, Pink Roses Bouquet', price: 300, category: 'Bouquet', stock: 10, imageUrl: 'https://picsum.photos/seed/bouq-mix/300/300' },
  { id: 'bouq-tulip', name: '2 Pink Tulips & 1 Yellow Tulip Bouquet', price: 700, category: 'Bouquet', stock: 5, imageUrl: 'https://picsum.photos/seed/bouq-tul/300/300' },
  { id: 'bouq-carn', name: 'Baby Pink, Purple, Pomelo Carnations Bouquet', price: 300, category: 'Bouquet', stock: 8, imageUrl: 'https://picsum.photos/seed/bouq-carn/300/300' },
  
  { id: 'foil-purple', name: 'Purple Foiled Rose', price: 150, category: 'Single', stock: 100, imageUrl: 'https://picsum.photos/seed/foil-purp/300/300' },
  { id: 'foil-red', name: 'Red Foiled Rose', price: 150, category: 'Single', stock: 100, imageUrl: 'https://picsum.photos/seed/foil-red/300/300' },
  
  { id: 'lego-red', name: 'Red Lego Flower', price: 120, category: 'Add-on', stock: 20, imageUrl: 'https://picsum.photos/seed/lego-red/300/300' },
  { id: 'lego-pink', name: 'Pink Lego Flower', price: 120, category: 'Add-on', stock: 20, imageUrl: 'https://picsum.photos/seed/lego-pink/300/300' },
  { id: 'lego-blue', name: 'Blue Lego Flower', price: 120, category: 'Add-on', stock: 20, imageUrl: 'https://picsum.photos/seed/lego-blue/300/300' },
  
  { id: 'crochet-rose-red', name: 'Red Rose Crochet Flower', price: 250, category: 'Crochet', stock: 10, imageUrl: 'https://picsum.photos/seed/cro-red/300/300' },
  { id: 'crochet-rose-pink', name: 'Pink Rose Crochet Flower', price: 250, category: 'Crochet', stock: 10, imageUrl: 'https://picsum.photos/seed/cro-pink/300/300' },
  
  { id: 'bracelet-yy', name: 'Yin and Yang Friendship Bracelet', price: 200, category: 'Jewelry', stock: 50, imageUrl: 'https://picsum.photos/seed/brace-yy/300/300' },
  { id: 'bracelet-sm', name: 'Sun and Moon Friendship Bracelet', price: 200, category: 'Jewelry', stock: 50, imageUrl: 'https://picsum.photos/seed/brace-sm/300/300' },
  
  { id: 'bundle-roses', name: '💐 Roses Bundle', price: 600, category: 'Bundle', stock: 10, imageUrl: 'https://picsum.photos/seed/bund-rose/300/300' },
  { id: 'bundle-tulips', name: '💐 Tulips Bundle', price: 1000, category: 'Bundle', stock: 10, imageUrl: 'https://picsum.photos/seed/bund-tul/300/300' },
  
  { id: 'sunglasses', name: 'Rose Tinted Sunglasses', price: 200, category: 'Add-on', stock: 15, imageUrl: 'https://picsum.photos/seed/glasses/300/300' },
];

export const CACHE_KEY_PRODUCTS = 'rose_sale_products';
export const CACHE_KEY_FILTERS = 'rose_sale_filters';
export const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes (shorter for more frequent updates)
export const SHEET_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'; // For order submission