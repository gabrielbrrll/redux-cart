import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem, MenuItem, AddOn } from '../types';

const initialState: CartState = {
  items: [],
  subtotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Cart Item Duplication Strategy:
     *
     * Items are considered duplicates ONLY if both the base item AND add-ons are identical.
     * Each unique combination of (item + add-ons) is treated as a separate cart entry.
     *
     * Examples:
     * - "Burger" with no add-ons → cartItemId: "1-"
     * - "Burger" with Gift Wrap → cartItemId: "1-gift-wrap"
     * - "Burger" with Gift Wrap + Express Ship → cartItemId: "1-express-ship,gift-wrap" (sorted)
     *
     * When adding an item:
     * 1. Generate cartItemId from item.id + sorted add-on IDs
     * 2. Check if this exact combination exists in cart
     * 3. If exists → increment quantity
     * 4. If not → create new cart entry
     *
     * Rationale:
     * - Users may want the same product with different customizations
     * - Each unique combination should be clearly visible in the cart
     * - Add-on IDs are sorted to ensure "A+B" and "B+A" generate the same ID
     * - Simpler UX than nesting add-ons within a single grouped item
     */
    addItem: (state, action: PayloadAction<{ item: MenuItem; addOns: AddOn[] }>) => {
      const { item, addOns } = action.payload;
      const cartItemId = generateCartItemId(item, addOns);

      const existingItem = state.items.find((i) => i.cartItemId === cartItemId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newCartItem: CartItem = {
          ...item,
          quantity: 1,
          addOns,
          cartItemId,
        };
        state.items.push(newCartItem);
      }

      state.subtotal = calculateSubtotal(state.items);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ cartItemId: string; quantity: number }>
    ) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.cartItemId !== cartItemId);
        } else {
          item.quantity = quantity;
        }
      }

      state.subtotal = calculateSubtotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },

    updateItem: (
      state,
      action: PayloadAction<{ cartItemId: string; addOns: AddOn[]; quantity: number }>
    ) => {
      const { cartItemId, addOns, quantity } = action.payload;
      const oldItem = state.items.find((i) => i.cartItemId === cartItemId);

      if (oldItem) {
        state.items = state.items.filter((i) => i.cartItemId !== cartItemId);

        const newCartItemId = generateCartItemId(oldItem, addOns);
        const existingItem = state.items.find((i) => i.cartItemId === newCartItemId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const updatedItem: CartItem = {
            ...oldItem,
            addOns,
            quantity,
            cartItemId: newCartItemId,
          };
          state.items.push(updatedItem);
        }

        state.subtotal = calculateSubtotal(state.items);
      }
    },
  },
});

function generateCartItemId(item: MenuItem, addOns: AddOn[]): string {
  const addOnIds = addOns.map((a) => a.id).sort().join(',');
  return `${item.id}-${addOnIds}`;
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const itemPrice = item.price;
    const addOnsPrice = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    return total + (itemPrice + addOnsPrice) * item.quantity;
  }, 0);
}

export const { addItem, removeItem, updateQuantity, clearCart, updateItem } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.subtotal;
