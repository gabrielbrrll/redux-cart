import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { MenuPage } from '../Menu';
import menuReducer from '../../store/menuSlice';
import cartReducer from '../../store/cartSlice';
import type { MenuItem } from '../../types';

const mockMenuItems: MenuItem[] = [
  { id: 1, name: 'Burger', price: 10, category: 'Main', description: 'Delicious burger', image: '' },
  { id: 2, name: 'Pizza', price: 15, category: 'Main', description: 'Tasty pizza', image: '' },
  { id: 3, name: 'Salad', price: 8, category: 'Appetizer', description: 'Fresh salad', image: '' },
  { id: 4, name: 'Fries', price: 5, category: 'Side', description: 'Crispy fries', image: '' },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      menu: menuReducer,
      cart: cartReducer,
    },
    preloadedState: {
      menu: {
        items: mockMenuItems,
        loading: false,
        error: null,
        searchQuery: '',
        sortBy: 'name',
      },
      cart: {
        items: [],
        subtotal: 0,
      },
      ...initialState,
    },
  });
};

describe('MenuPage - User Interaction Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('should render menu items for browsing', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
    expect(screen.getByText('Fries')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
  });

  it('should display loading state when fetching menu', () => {
    const store = createMockStore({
      menu: {
        items: [],
        loading: true,
        error: null,
        searchQuery: '',
        sortBy: 'name',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading menu...')).toBeInTheDocument();
  });

  it('should display error state with retry button when API fails', () => {
    const store = createMockStore({
      menu: {
        items: [],
        loading: false,
        error: 'Failed to fetch menu',
        searchQuery: '',
        sortBy: 'name',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Unable to Load Menu')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch menu')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should filter menu items when user searches', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.ionChange(searchInput, { detail: { value: 'pizza' } });

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.queryByText('Burger')).not.toBeInTheDocument();
      expect(screen.queryByText('Salad')).not.toBeInTheDocument();
    });
  });

  it('should display empty state when search returns no results', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search menu items...');
    fireEvent.ionChange(searchInput, { detail: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });
  });

  it('should update sort order when user changes sorting', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    const sortSelect = screen.getByText('Sort by:').closest('ion-item')?.querySelector('ion-select');
    expect(sortSelect).toBeTruthy();

    fireEvent.ionChange(sortSelect!, { detail: { value: 'price' } });

    const state = store.getState();
    expect(state.menu.sortBy).toBe('price');
  });

  it('should display all menu items with their details', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    const cards = container.querySelectorAll('ion-card');
    expect(cards.length).toBe(4);
  });
});
