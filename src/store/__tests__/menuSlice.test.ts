import { describe, it, expect } from 'vitest';
import menuReducer, { setSearchQuery, setSortBy } from '../menuSlice';
import type { MenuState } from '../../types';

describe('menuSlice', () => {
  const initialState: MenuState = {
    items: [
      { id: 1, name: 'Burger', price: 10, category: 'food' },
      { id: 2, name: 'Pizza', price: 15, category: 'food' },
      { id: 3, name: 'Cola', price: 3, category: 'drinks' },
    ],
    loading: false,
    error: null,
    searchQuery: '',
    sortBy: 'name',
    categoryFilter: []
  };

  it('should handle setSearchQuery', () => {
    const newState = menuReducer(initialState, setSearchQuery('burger'));
    expect(newState.searchQuery).toBe('burger');
  });

  it('should handle setSortBy', () => {
    const newState = menuReducer(initialState, setSortBy('price'));
    expect(newState.sortBy).toBe('price');
  });

  it('should return initial state when undefined action', () => {
    const newState = menuReducer(undefined, { type: 'unknown' });
    expect(newState).toEqual({
      items: [],
      loading: false,
      error: null,
      searchQuery: '',
      sortBy: 'name-asc',
      categoryFilter: [],
    });
  });
});
