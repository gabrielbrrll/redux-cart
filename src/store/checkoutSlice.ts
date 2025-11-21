import { createSlice } from '@reduxjs/toolkit';
import type { CheckoutState, CartState } from '../types';

const SERVICE_CHARGE_RATE = 0.1;

const initialState: CheckoutState = {
  receipt: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    generateReceipt: (state, action) => {
      const cartState: CartState = action.payload;
      const subtotal = cartState.subtotal;
      const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
      const total = subtotal + serviceCharge;

      state.receipt = {
        items: cartState.items,
        subtotal,
        serviceCharge,
        total,
        timestamp: new Date().toISOString(),
      };
    },

    clearReceipt: (state) => {
      state.receipt = null;
    },
  },
});

export const { generateReceipt, clearReceipt } = checkoutSlice.actions;
export default checkoutSlice.reducer;

export const selectReceipt = (state: { checkout: CheckoutState }) => state.checkout.receipt;

export const selectTotal = (state: { checkout: CheckoutState }) =>
  state.checkout.receipt?.total ?? 0;
