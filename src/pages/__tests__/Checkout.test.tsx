import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutPage } from '../Checkout';
import cartReducer from '../../store/cartSlice';
import checkoutReducer from '../../store/checkoutSlice';
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
    ],
    cartItemId: '1-cheese',
  },
  {
    id: 2,
    name: 'Pizza',
    price: 20,
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
      checkout: checkoutReducer,
    },
    preloadedState: {
      cart: {
        items: mockCartItems,
        subtotal: 44, // (10 + 2) * 2 + 20 = 44
      },
      checkout: {
        receipt: null,
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

describe('CheckoutPage', () => {
  it('should render order summary with cart items', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText(/Burger/)).toBeInTheDocument();
    expect(screen.getByText(/Pizza/)).toBeInTheDocument();
    expect(screen.getByText('Add-ons: Extra Cheese')).toBeInTheDocument();
  });

  it('should display subtotal', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$44.00')).toBeInTheDocument();
  });

  it('should display 10% service charge', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Service Charge (10%)')).toBeInTheDocument();
    expect(screen.getByText('$4.40')).toBeInTheDocument();
  });

  it('should display total amount', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$48.40')).toBeInTheDocument();
  });

  it('should display empty state when no items in cart', () => {
    const store = createMockStore({
      cart: {
        items: [],
        subtotal: 0,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No items to checkout')).toBeInTheDocument();
    expect(screen.getByText('Add some items to your cart first!')).toBeInTheDocument();
  });

  it('should generate receipt and clear cart when Complete Order is clicked', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.cart.items.length).toBe(0);
      expect(state.checkout.receipt).not.toBeNull();
    });
  });

  it('should display receipt after order completion', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you!')).toBeInTheDocument();
      expect(screen.getByText('Your order has been placed successfully')).toBeInTheDocument();
    });
  });

  it('should display receipt with timestamp', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.checkout.receipt?.timestamp).toBeDefined();

      const timestamp = state.checkout.receipt?.timestamp;
      if (timestamp) {
        const dateStr = new Date(timestamp).toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        expect(screen.getByText(dateStr)).toBeInTheDocument();
      }
    });
  });

  it('should display receipt items with quantities and prices', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      expect(screen.getByText(/Burger/)).toBeInTheDocument();
      expect(screen.getByText(/Pizza/)).toBeInTheDocument();
      expect(screen.getByText(/×2/)).toBeInTheDocument();
      expect(screen.getByText(/×1/)).toBeInTheDocument();
    });
  });

  it('should display receipt with subtotal, service charge, and total', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      const subtotalElements = screen.getAllByText('$44.00');
      const serviceChargeElements = screen.getAllByText('$4.40');
      const totalElements = screen.getAllByText('$48.40');

      expect(subtotalElements.length).toBeGreaterThan(0);
      expect(serviceChargeElements.length).toBeGreaterThan(0);
      expect(totalElements.length).toBeGreaterThan(0);
    });
  });

  it('should clear receipt and navigate to menu when Start New Order is clicked', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('Start New Order')).toBeInTheDocument();
    });

    const startNewOrderButton = screen.getByText('Start New Order');
    fireEvent.click(startNewOrderButton);

    await waitFor(() => {
      const state = store.getState();
      expect(state.checkout.receipt).toBeNull();
      expect(mockHistoryPush).toHaveBeenCalledWith('/menu');
    });
  });

  it('should calculate item totals including add-ons in receipt', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckoutPage />
        </MemoryRouter>
      </Provider>
    );

    const completeOrderButton = screen.getByText('Complete Order');
    fireEvent.click(completeOrderButton);

    await waitFor(() => {
      expect(screen.getByText('$24.00')).toBeInTheDocument();
      expect(screen.getByText('$20.00')).toBeInTheDocument();
    });
  });
});
