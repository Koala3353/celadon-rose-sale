# 🌹 Rose Sale 2026 - Celadon Shop

A modern React e-commerce website for the Celadon Rose Sale 2026. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features

- 🛒 **Shopping Cart** - Add products, adjust quantities, persistent cart
- 🔐 **Google Authentication** - Secure login with Google OAuth
- 📱 **Responsive Design** - Beautiful on mobile and desktop
- ✨ **Smooth Animations** - Framer Motion for delightful UX
- 📦 **Product Catalog** - Browse roses, carnations, tulips, bouquets & bundles
- 🎁 **Gift Messages** - Add personal messages for recipients
- 💳 **Checkout Flow** - Multi-step checkout with validation
- 📋 **Order History** - View past orders with details
- 🌸 **Advocacy Donations** - Support causes with each purchase

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Animations
- **React Router v7** - Navigation
- **TanStack Query** - Data fetching & caching
- **Google OAuth** - Authentication

## Setup

### 1. Install Dependencies

```bash
cd rose-sale-shop
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
# API Server URL
VITE_API_BASE_URL=http://localhost:3001/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Optional: Gemini API for AI features
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
rose-sale-shop/
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx      # Shopping cart sidebar
│   │   ├── CheckoutForm.tsx    # Multi-step checkout
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Login.tsx           # Google login component
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── OrderHistory.tsx    # Past orders display
│   │   └── ProductCard.tsx     # Product display card
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── CartContext.tsx     # Shopping cart state
│   ├── pages/
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── ShopPage.tsx        # Product catalog
│   │   └── OrdersPage.tsx      # Order history page
│   ├── services/
│   │   └── sheetService.ts     # API client
│   ├── App.tsx                 # Main app component
│   ├── constants.ts            # Configuration
│   ├── index.tsx               # Entry point
│   └── types.ts                # TypeScript types
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── package.json
└── README.md
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with featured products |
| `/shop` | Shop | Product catalog with search & filters |
| `/orders` | Orders | Order history (requires login) |

## Deployment

### GitHub Pages

1. Update `vite.config.ts` base path to match your repo name:
   ```ts
   base: '/your-repo-name/'
   ```

2. Create `.env.production` with your production API URL:
   ```env
   VITE_API_BASE_URL=https://your-api.onrender.com/api
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages in repo settings (use `gh-pages` branch)

### Vercel / Netlify

1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically on push

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | ✅ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GEMINI_API_KEY` | Gemini API for AI features | ❌ |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |
