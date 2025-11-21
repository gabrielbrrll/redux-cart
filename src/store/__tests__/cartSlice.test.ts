import { describe, it, expect } from 'vitest';
import cartReducer, { addItem, removeItem, updateQuantity, clearCart } from '../cartSlice';
import type { CartState, MenuItem, AddOn } from '../../types';

describe('cartSlice', () => {
  const mockItem: MenuItem = {
    id: 1,
    name: 'Burger',
    price: 10,
    category: 'food',
  };

  const mockAddOn: AddOn = {
    id: 'cheese',
    name: 'Cheese',
    price: 2,
  };

  const initialState: CartState = {
    items: [],
    subtotal: 0,
  };

  it('should add item to empty cart', () => {
    const newState = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].name).toBe('Burger');
    expect(newState.items[0].quantity).toBe(1);
    expect(newState.subtotal).toBe(10);
  });

  it('should increase quantity for duplicate item without add-ons', () => {
    const stateWithItem = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const newState = cartReducer(
      stateWithItem,
      addItem({ item: mockItem, addOns: [] })
    );

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].quantity).toBe(2);
    expect(newState.subtotal).toBe(20);
  });

  it('should create separate entries for same item with different add-ons', () => {
    const stateWithItem = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const newState = cartReducer(
      stateWithItem,
      addItem({ item: mockItem, addOns: [mockAddOn] })
    );

    expect(newState.items).toHaveLength(2);
    expect(newState.items[0].addOns).toHaveLength(0);
    expect(newState.items[1].addOns).toHaveLength(1);
    expect(newState.subtotal).toBe(22);
  });

  it('should calculate subtotal with add-ons', () => {
    const newState = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [mockAddOn] })
    );

    expect(newState.subtotal).toBe(12);
  });

  it('should remove item from cart', () => {
    const stateWithItem = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const cartItemId = stateWithItem.items[0].cartItemId;
    const newState = cartReducer(stateWithItem, removeItem(cartItemId));

    expect(newState.items).toHaveLength(0);
    expect(newState.subtotal).toBe(0);
  });

  it('should update quantity', () => {
    const stateWithItem = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const cartItemId = stateWithItem.items[0].cartItemId;
    const newState = cartReducer(
      stateWithItem,
      updateQuantity({ cartItemId, quantity: 5 })
    );

    expect(newState.items[0].quantity).toBe(5);
    expect(newState.subtotal).toBe(50);
  });

  it('should remove item when quantity updated to 0', () => {
    const stateWithItem = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const cartItemId = stateWithItem.items[0].cartItemId;
    const newState = cartReducer(
      stateWithItem,
      updateQuantity({ cartItemId, quantity: 0 })
    );

    expect(newState.items).toHaveLength(0);
    expect(newState.subtotal).toBe(0);
  });

  it('should clear cart', () => {
    const stateWithItems = cartReducer(
      initialState,
      addItem({ item: mockItem, addOns: [] })
    );
    const newState = cartReducer(stateWithItems, clearCart());

    expect(newState.items).toHaveLength(0);
    expect(newState.subtotal).toBe(0);
  });
});
