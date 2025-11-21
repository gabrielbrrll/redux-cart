import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { CartPage } from '../Cart';
import cartReducer from '../../store/cartSlice';
import type { CartItem } from '../../types';

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Burger',
    price: 10,
    category: 'Main',
    quantity: 2,
    addOns: [
      { id: 'cheese', name: 'Extra Cheese', price: 2 },
      { id: 'bacon', name: 'Bacon', price: 3 },
    ],
    cartItemId: '1-bacon,cheese',
  },
  {
    id: 2,
    name: 'Pizza',
    price: 15,
    category: 'Main',
    quantity: 1,
    addOns: [],
    cartItemId: '2-',
  },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: {
        items: mockCartItems,
        subtotal: 45, // (10 + 2 + 3) * 2 + 15 = 45
      },
      ...initialState,
    },
  });
};

const mockHistoryPush = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

describe('CartPage - User Interaction Tests', () => {
  it('should render cart items with details', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Add-ons: Extra Cheese, Bacon')).toBeInTheDocument();
  });

  it('should display cart item count in header', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Cart (3 items)')).toBeInTheDocument();
  });

  it('should display subtotal', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Subtotal: $45.00')).toBeInTheDocument();
  });

  it('should increase quantity when plus button is clicked', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const buttons = container.querySelectorAll('ion-button');
    const increaseButtons = Array.from(buttons).filter(btn => {
      const icon = btn.querySelector('ion-icon');
      return icon && icon.getAttribute('icon') === 'add';
    });

    expect(increaseButtons.length).toBeGreaterThan(0);
    fireEvent.click(increaseButtons[0]);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(3);
  });

  it('should decrease quantity when minus button is clicked', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const buttons = container.querySelectorAll('ion-button');
    const decreaseButtons = Array.from(buttons).filter(btn => {
      const icon = btn.querySelector('ion-icon');
      return icon && icon.getAttribute('icon') === 'remove';
    });

    expect(decreaseButtons.length).toBeGreaterThan(0);
    fireEvent.click(decreaseButtons[0]);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(1);
  });

  it('should remove item from cart when trash button is clicked', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const buttons = container.querySelectorAll('ion-button');
    const trashButtons = Array.from(buttons).filter(btn => {
      const icon = btn.querySelector('ion-icon');
      return icon && icon.getAttribute('icon') === 'trash';
    });

    expect(trashButtons.length).toBeGreaterThan(0);
    fireEvent.click(trashButtons[0]);

    const state = store.getState();
    expect(state.cart.items.length).toBe(1);
    expect(state.cart.items[0].name).toBe('Pizza');
  });

  it('should update subtotal when quantity changes', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const buttons = container.querySelectorAll('ion-button');
    const increaseButtons = Array.from(buttons).filter(btn => {
      const icon = btn.querySelector('ion-icon');
      return icon && icon.getAttribute('icon') === 'add';
    });

    fireEvent.click(increaseButtons[0]);

    const state = store.getState();
    expect(state.cart.subtotal).toBe(60);
  });

  it('should navigate to checkout when Proceed to Checkout is clicked', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);

    expect(mockHistoryPush).toHaveBeenCalledWith('/checkout');
  });

  it('should display empty cart message when cart is empty', () => {
    const store = createMockStore({
      cart: {
        items: [],
        subtotal: 0,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some items from the menu to get started!')).toBeInTheDocument();
  });

  it('should have Browse Menu link when cart is empty', () => {
    const store = createMockStore({
      cart: {
        items: [],
        subtotal: 0,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const browseMenuButton = screen.getByText('Browse Menu');
    expect(browseMenuButton).toBeInTheDocument();
  });

  it('should display correct quantity badges for items', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </Provider>
    );

    const badges = container.querySelectorAll('ion-badge');
    expect(badges.length).toBe(2);
    expect(badges[0].textContent).toBe('2');
    expect(badges[1].textContent).toBe('1');
  });
});
