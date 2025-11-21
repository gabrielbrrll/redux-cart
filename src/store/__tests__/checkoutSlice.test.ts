import { describe, it, expect } from 'vitest';
import checkoutReducer, { generateReceipt } from '../checkoutSlice';
import type { CartState } from '../../types';

describe('checkoutSlice', () => {
  it('should calculate 10% service charge correctly', () => {
    const mockCartState: CartState = {
      items: [
        {
          id: 1,
          name: 'Burger',
          price: 10,
          category: 'food',
          quantity: 2,
          addOns: [],
          cartItemId: '1-',
        },
      ],
      subtotal: 20,
    };

    const newState = checkoutReducer(
      { receipt: null },
      generateReceipt(mockCartState)
    );

    expect(newState.receipt).toBeDefined();
    expect(newState.receipt?.subtotal).toBe(20);
    expect(newState.receipt?.serviceCharge).toBe(2);
    expect(newState.receipt?.total).toBe(22);
    expect(newState.receipt?.timestamp).toBeDefined();
  });
});
