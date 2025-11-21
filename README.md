# E-Commerce Shopping Cart

A lightweight shopping cart system with product catalog built with React, TypeScript, Redux Toolkit, and Ionic Framework.

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
- ✅ **Product Catalog** - Browse products with images, prices, descriptions, and categories
- ✅ **Fuzzy Search** - Case-insensitive search across name, price, and category
- ✅ **Sorting** - Sort by name, price, or category (ascending/descending)
- ✅ **Cart Management** - Add, remove, and adjust quantities
- ✅ **Add-ons System** - Customize products with optional add-ons (gift wrapping, express shipping, warranty, etc.)
- ✅ **Smart Duplication** - Same product with identical add-ons merges quantities; different add-ons create separate entries
- ✅ **Checkout Flow** - 10% service charge calculation with detailed receipt generation
- ✅ **Receipt System** - Order ID, timestamp, itemized breakdown with add-ons

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
│   ├── MenuItem.tsx    # Product card with add-ons modal
│   ├── CartItem.tsx    # Cart item with quantity controls and edit
│   ├── SearchBar.tsx   # Search input with debouncing
│   └── __tests__/      # Component tests
├── pages/              # Route-level page components
│   ├── Menu.tsx        # Product catalog with search/sort/filter
│   ├── Cart.tsx        # Shopping cart with subtotal
│   └── Checkout.tsx    # Order summary and receipt
├── store/              # Redux store and slices
│   ├── index.ts        # Store configuration + typed hooks
│   ├── menuSlice.ts    # Product catalog state + API fetching
│   ├── cartSlice.ts    # Cart state + duplication logic
│   ├── checkoutSlice.ts # Checkout + receipt generation
│   └── __tests__/      # Unit tests for slices
├── types/              # TypeScript type definitions
│   └── index.ts        # Interfaces for domain models
├── utils/              # Utility functions
│   └── format.ts       # Currency formatting
├── App.tsx             # Main app with Ionic tabs navigation
└── main.tsx            # Entry point with Redux Provider
```

## 🎨 Design Decisions

### State Management
**Decision**: Use Redux Toolkit for all state (menu, cart, checkout)

**Rationale**:
- Assignment requirement: "Manage state with Redux Toolkit"
- Cart is truly shared across Menu, Cart, and Checkout pages
- Demonstrates Redux knowledge with async thunks, memoized selectors, and normalized state
- Note: In a production app, search/sort could be local state (see code comments)

**State Shape**:
```typescript
{
  menu: {
    items: MenuItem[],        // Fetched from DummyJSON API
    loading: boolean,
    error: string | null,
    searchQuery: string,
    sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'category-asc' | 'category-desc',
    categoryFilter: string[]  // Active category filters
  },
  cart: {
    items: CartItem[],        // Items with quantity, add-ons, and unique cartItemId
    subtotal: number          // Calculated from items + add-ons
  },
  checkout: {
    receipt: Receipt | null   // Generated on order completion with timestamp
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

### Cart Duplication Strategy
**Decision**: Items are duplicates ONLY if both the base product AND add-ons are identical

**Rationale**:
- Same product with no add-ons merges into one cart entry (quantity increases)
- Same product with different add-ons creates separate cart entries
- Same product with identical add-ons merges (quantity increases)
- Users can customize the same product multiple ways
- Each unique combination is clearly visible in the cart
- CartItemId generated from `${itemId}-${sortedAddOnIds}` ensures consistency
- Add-on IDs are sorted so "A+B" and "B+A" produce the same ID

**Examples**:
- "Smartphone" (no add-ons) + "Smartphone" (no add-ons) = 1 entry with quantity 2
- "Smartphone" (Gift Wrap) + "Smartphone" (Express Ship) = 2 separate entries
- "Smartphone" (Gift Wrap, Warranty) + "Smartphone" (Warranty, Gift Wrap) = 1 entry with quantity 2

### Deduplication Logic
**Decision**: Hash by `name + price + category`, keep first occurrence

**Rationale**:
- Composite key ensures true uniqueness
- Handles edge cases where API returns duplicates
- First-occurrence strategy is deterministic

### Search & Filter Implementation
**Decision**: Client-side search and filtering with memoized selectors

**Rationale**:
- DummyJSON API doesn't support search/filter queries
- Dataset is small enough (~30 products) for client-side processing
- Redux Toolkit's `createSelector` memoizes results to prevent unnecessary re-renders
- Searches across name, price, and category fields
- Category filter allows multiple selections
- Sorting works on already filtered results

### Component Architecture
**Decision**: Functional components with React hooks and Redux Toolkit integration

**Rationale**:
- Reusable components (MenuItem, CartItem) handle their own UI logic
- Pages orchestrate data fetching and global state
- Custom hooks (`useAppDispatch`, `useAppSelector`) for type-safe Redux access
- Modal-based UI for add-ons customization
- Separation of concerns: components for UI, slices for business logic
- All TypeScript with no `any` types for full type safety

## 🧪 Testing Strategy

### Unit Tests (Redux Slices)
**Location**: `src/store/__tests__/`

**Coverage**:
- `menuSlice.test.ts` - Initial state, search, sort, category filter, async API calls
- `cartSlice.test.ts` - Add/remove, quantity management, add-ons, duplication logic
- `checkoutSlice.test.ts` - Receipt generation, 10% service charge, order ID

**Why**: Verify business logic in isolation (calculations, transformations, state updates)

### Integration Tests (Pages)
**Location**: `src/pages/__tests__/`

**Coverage**:
- `Menu.test.tsx` - Product browsing, search, sort, loading states, error handling
- `Cart.test.tsx` - Item display, quantity controls, subtotal calculation, empty state
- `Checkout.test.tsx` - Order summary, receipt generation, timestamp formatting

**Why**: Test complete user flows with Redux state and Ionic components

### Component Tests
**Location**: `src/components/__tests__/`

**Coverage**:
- `SearchBar.test.tsx` - Renders with correct placeholder

**Why**: Ensure reusable UI components behave correctly

**Run Tests**:
```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:ui       # Interactive UI mode
npm run test:coverage # With coverage report
```

## 🔍 Known Limitations

1. **API Dependency**: Relies on DummyJSON uptime; no offline fallback or cached data
2. **No Persistence**: Cart clears on page refresh (could add localStorage or session storage)
3. **Basic Search**: Simple string matching, not full-text search with ranking
4. **No Authentication**: No user accounts, order history, or saved carts
5. **Static Add-ons**: Add-on options are hardcoded in components (could fetch from API)
6. **Limited Error Recovery**: Network errors show message with manual retry button
7. **No Payment Integration**: Checkout is simulated; no real payment processing
8. **No Stock Management**: Products don't track inventory or availability

## 📊 Test Results

```
Test Files  7 passed (7)
Tests      43 passed (43)
├─ Unit Tests: 12 (menuSlice, cartSlice, checkoutSlice)
├─ Component Test: 1 (SearchBar)
└─ Integration Tests: 30 (Menu, Cart, Checkout user flows)
```

**Coverage**: All critical user journeys, state management logic, and UI interactions are tested. Tests use Vitest with React Testing Library for rendering and @testing-library/user-event for interactions.

## 🎯 Assignment Requirements Met

- ✅ React with TypeScript (strict mode, no `any` types)
- ✅ Redux Toolkit for state management (slices, async thunks, memoized selectors)
- ✅ At least one async thunk (fetchMenu from DummyJSON API with error handling)
- ✅ At least three reusable components (MenuItem, CartItem, SearchBar)
- ✅ Comprehensive testing suite (43 tests: unit, component, integration)
- ✅ Organized code structure with clear separation of concerns
- ✅ Product catalog with fuzzy search, sorting, and category filtering
- ✅ Remove duplicate products by name + price + category
- ✅ Cart management with add-ons and smart duplication logic
- ✅ Checkout flow with 10% service charge calculation
- ✅ Receipt generation with order ID, timestamp, and itemized breakdown
- ✅ Clear cart after order completion
- ✅ **Bonus**: Ionic Framework UI with mobile-first design and tab navigation
- ✅ **Bonus**: Edit cart items (quantity and add-ons) with modal interface
- ✅ **Bonus**: Pre-commit hooks with ESLint and automated testing

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

## 🎓 Learning Highlights

This project demonstrates:
- **Modern React patterns** - Hooks, functional components, custom hooks
- **Redux Toolkit best practices** - Slices, async thunks, memoized selectors
- **TypeScript proficiency** - Full type safety, interfaces, generics
- **Testing methodology** - Unit, component, and integration testing strategies
- **Ionic Framework** - Mobile-first UI with web components
- **Code quality** - ESLint, pre-commit hooks, automated testing
- **Problem-solving** - Cart duplication logic, memoization, async state management

---

**Built with ❤️ using React, Redux Toolkit, TypeScript, and Ionic Framework**
