# Restaurant Ordering System

A lightweight restaurant ordering system built with React, TypeScript, Redux Toolkit, and Ionic Framework.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the app in action.

## 📋 Features

### Core Functionality
- ✅ **Menu Browsing** - View products with images, prices, and descriptions
- ✅ **Fuzzy Search** - Case-insensitive search across name, price, and category
- ✅ **Sorting** - Sort by name, price, or category
- ✅ **Cart Management** - Add, remove, and adjust quantities
- ✅ **Add-ons Support** - Customize items with add-ons (separate cart entries)
- ✅ **Checkout** - 10% service charge calculation with receipt generation
- ✅ **Duplicate Handling** - Same item without add-ons increases quantity

### Technical Features
- ✅ **TypeScript** - Full type safety with no `any` types
- ✅ **Redux Toolkit** - Modern state management with async thunks
- ✅ **Ionic Framework** - Mobile-first UI components
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Testing** - Unit tests and component tests with Vitest
- ✅ **Pre-commit Hooks** - Auto-formatting and testing before commits

## 🏗️ Tech Stack

- **Build Tool**: Vite 7.2.4
- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **State Management**: Redux Toolkit 2.10.1
- **UI Framework**: Ionic React 8.7.10
- **Routing**: React Router DOM 5.3.4
- **Testing**: Vitest 4.0.12 + React Testing Library 16.3.0
- **Code Quality**: ESLint + Husky + lint-staged

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MenuItem.tsx    # Menu item card with add-ons modal
│   ├── CartItem.tsx    # Cart item with quantity controls
│   ├── SearchBar.tsx   # Search input with debouncing
│   └── __tests__/      # Component tests
├── pages/              # Route-level page components
│   ├── Menu.tsx        # Menu page with search/sort
│   ├── Cart.tsx        # Cart page with subtotal
│   └── Checkout.tsx    # Checkout with receipt
├── store/              # Redux store and slices
│   ├── index.ts        # Store configuration + typed hooks
│   ├── menuSlice.ts    # Menu state + async thunk
│   ├── cartSlice.ts    # Cart state + logic
│   ├── checkoutSlice.ts # Checkout + receipt generation
│   └── __tests__/      # Unit tests for slices
├── types/              # TypeScript type definitions
│   └── index.ts        # Interfaces for domain models
├── App.tsx             # Main app with Ionic tabs
└── main.tsx            # Entry point with Redux Provider
```

## 🎨 Design Decisions

### State Management
**Decision**: Use Redux Toolkit for all state (menu, cart, checkout)

**Rationale**:
- Assignment requirement: "Manage state with Redux Toolkit"
- Cart is truly shared across Menu, Cart, and Checkout pages
- Demonstrates Redux knowledge with async thunks, selectors, and normalized state
- Note: In a production app, search/sort could be local state (see code comments)

**State Shape**:
```typescript
{
  menu: {
    items: MenuItem[],        // Fetched from DummyJSON API
    loading: boolean,
    error: string | null,
    searchQuery: string,
    sortBy: 'name' | 'price' | 'category'
  },
  cart: {
    items: CartItem[],        // Items with quantity and add-ons
    subtotal: number
  },
  checkout: {
    receipt: Receipt | null   // Generated on order completion
  }
}
```

### API Choice
**Decision**: DummyJSON Products API (`https://dummyjson.com/products`)

**Rationale**:
- Free public API with no authentication required
- Good product data with images, prices, categories
- Maps naturally to MenuItem structure
- Mentioned in assignment's helpful links

**Data Transformation**:
```typescript
// API Response → MenuItem
{
  id: product.id,
  name: product.title,          // title → name
  price: product.price,
  category: product.category,
  image: product.thumbnail,      // thumbnail → image
  description: product.description
}
```

### Add-ons Strategy
**Decision**: Items with different add-ons are separate cart entries

**Rationale**:
- Per requirements: "items with add-ons are separate entries"
- Allows different customizations of the same base item
- Simpler logic than nesting add-ons within a single item
- Better UX: users see each unique combination clearly
- CartItemId generated from `${itemId}-${sortedAddOnIds}`

### Deduplication Logic
**Decision**: Hash by `name + price + category`, keep first occurrence

**Rationale**:
- Composite key ensures true uniqueness
- Handles edge cases where API returns duplicates
- First-occurrence strategy is deterministic

### Search Implementation
**Decision**: Client-side fuzzy search with 300ms debounce

**Rationale**:
- DummyJSON API doesn't support search queries
- Dataset is small enough (~30 products) for client-side processing
- Debouncing prevents excessive re-renders
- Searches across name, price, and category

### Component Architecture
**Decision**: Atomic design with presentational/container separation

**Rationale**:
- Reusable components (MenuItem, CartItem, SearchBar) as required
- Pages are container components that orchestrate state
- Separation of concerns: components for UI, slices for logic
- Easier to test and maintain

## 🧪 Testing Strategy

### Unit Tests (Redux Slices)
**Location**: `src/store/__tests__/`

**Coverage**:
- `menuSlice.test.ts` - Search query, sort, initial state
- `cartSlice.test.ts` - Add/remove, quantity management, add-ons handling
- `checkoutSlice.test.ts` - 10% service charge calculation

**Why**: Verify business logic in isolation (calculations, transformations)

### Component Tests
**Location**: `src/components/__tests__/`

**Coverage**:
- `SearchBar.test.tsx` - Renders with correct placeholder

**Why**: Ensure UI components behave correctly

**Run Tests**:
```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

## 🔍 Known Limitations

1. **API Dependency**: Relies on DummyJSON uptime; no offline fallback
2. **No Persistence**: Cart clears on page refresh (could add localStorage)
3. **Basic Search**: Simple string matching, not full-text search
4. **No Authentication**: No user accounts or order history
5. **Hardcoded Add-ons**: Add-on options are static in MenuItem component
6. **Limited Error Recovery**: Network errors show message but no automatic retry

## 📊 Test Results

```
Test Files  4 passed (4)
Tests      13 passed (13)
├─ Unit Tests: 12 (menuSlice, cartSlice, checkoutSlice)
└─ Component Tests: 1 (SearchBar)
```

## 🎯 Assignment Requirements Met

- ✅ React with TypeScript (no `any` types)
- ✅ Redux Toolkit for state management
- ✅ At least one async thunk (fetchMenu from DummyJSON API)
- ✅ At least three reusable components (MenuItem, CartItem, SearchBar)
- ✅ Unit and component tests (Vitest + React Testing Library)
- ✅ Organized code for readability and maintainability
- ✅ Menu list with fuzzy search and sorting
- ✅ Remove duplicates by name + price + category
- ✅ Cart management with add-ons support
- ✅ Checkout with 10% service charge
- ✅ Receipt with timestamp
- ✅ Clear cart after checkout
- ✅ **Bonus**: Ionic Framework UI components and navigation

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The `dist/` folder can be deployed to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📝 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 🤝 Contributing

Pre-commit hooks ensure code quality:
- ✅ ESLint auto-fix
- ✅ Vitest tests run on changed files

## 📄 License

MIT

---

**Built with ❤️ using React, Redux Toolkit, and Ionic Framework**
