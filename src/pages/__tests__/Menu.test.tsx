import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { MenuPage } from '../Menu';
import menuReducer, { setSortBy } from '../../store/menuSlice';
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
        sortBy: 'name-asc',
        categoryFilter: ['Main', 'Appetizer', 'Side'],
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
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        products: mockMenuItems.map(item => ({
          id: item.id,
          title: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          thumbnail: item.image,
        }))
      }),
    });
    global.fetch = fetchMock;
  });

  it('should render menu items for browsing', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
    });
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
        sortBy: 'name-asc',
        categoryFilter: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should display error state with retry button when API fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Failed to fetch menu'));

    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Products')).toBeInTheDocument();
    });
    expect(screen.getByText(/Failed to fetch menu/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should filter menu items when user searches', async () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
    });

    const searchBar = container.querySelector('ion-searchbar');
    expect(searchBar).toBeTruthy();

    const event = new CustomEvent('ionInput', {
      detail: { value: 'pizza' }
    });
    fireEvent(searchBar!, event);

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.queryByText('Burger')).not.toBeInTheDocument();
      expect(screen.queryByText('Salad')).not.toBeInTheDocument();
    });
  });

  it('should display empty state when search returns no results', async () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
    });

    const searchBar = container.querySelector('ion-searchbar');
    expect(searchBar).toBeTruthy();

    const event = new CustomEvent('ionInput', {
      detail: { value: 'nonexistent' }
    });
    fireEvent(searchBar!, event);

    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });
  });

  it('should update sort order when user changes sorting', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
    });

    store.dispatch(setSortBy('price-asc'));

    const state = store.getState();
    expect(state.menu.sortBy).toBe('price-asc');
  });

  it('should display all menu items with their details', async () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <MenuPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      const cards = container.querySelectorAll('ion-card');
      expect(cards.length).toBe(4);
    });
  });
});
