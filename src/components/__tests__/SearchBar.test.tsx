import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SearchBar } from '../SearchBar';
import menuReducer from '../../store/menuSlice';

const createMockStore = () => {
  return configureStore({
    reducer: {
      menu: menuReducer,
    },
  });
};

describe('SearchBar', () => {
  it('should render search input with placeholder', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <SearchBar />
      </Provider>
    );

    const searchbar = screen.getByPlaceholderText('Search menu items...');
    expect(searchbar).toBeInTheDocument();
  });
});
