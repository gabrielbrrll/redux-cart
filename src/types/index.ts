/**
 * Core domain types for the restaurant ordering system
 */

/**
 * Menu item from the API/database
 */
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

/**
 * Add-on/customization option for menu items
 */
export interface AddOn {
  id: string;
  name: string;
  price: number;
}

/**
 * Cart item - extends MenuItem with quantity and add-ons
 * Items with different add-ons are stored as separate cart entries
 */
export interface CartItem extends MenuItem {
  quantity: number;
  addOns: AddOn[];
  cartItemId: string; // Unique identifier for this cart entry
}

/**
 * Menu state shape
 */
export interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'price' | 'category';
}

/**
 * Cart state shape
 */
export interface CartState {
  items: CartItem[];
  subtotal: number;
}

/**
 * Checkout/Receipt data
 */
export interface Receipt {
  items: CartItem[];
  subtotal: number;
  serviceCharge: number;
  total: number;
  timestamp: string;
}

/**
 * Checkout state shape
 */
export interface CheckoutState {
  receipt: Receipt | null;
}
