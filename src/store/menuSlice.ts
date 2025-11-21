import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem, MenuState } from '../types';

interface DummyJSONProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  description: string;
}

interface DummyJSONResponse {
  products: DummyJSONProduct[];
}

export const fetchMenu = createAsyncThunk<
  MenuItem[],
  void,
  { rejectValue: string }
>(
  'menu/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=30');

      if (!response.ok) {
        return rejectWithValue('Failed to fetch menu');
      }

      const data: DummyJSONResponse = await response.json();

      const items: MenuItem[] = data.products.map((product) => ({
        id: product.id,
        name: product.title,
        price: product.price,
        category: product.category,
        image: product.thumbnail,
        description: product.description,
      }));

      const deduplicated = deduplicateItems(items);
      return deduplicated;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
);

function deduplicateItems(items: MenuItem[]): MenuItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.name}-${item.price}-${item.category}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'name-asc',
  categoryFilter: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string[]>) => {
      state.categoryFilter = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.categoryFilter.indexOf(category);
      if (index > -1) {
        state.categoryFilter.splice(index, 1);
      } else {
        state.categoryFilter.push(category);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load menu';
      });
  },
});

export const { setSearchQuery, setSortBy, setCategoryFilter, toggleCategory } = menuSlice.actions;
export default menuSlice.reducer;

export const selectFilteredAndSortedItems = createSelector(
  [(state: { menu: MenuState }) => state.menu],
  (menu) => {
    const { items, searchQuery, sortBy, categoryFilter } = menu;

    let filtered = items;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.price.toString().includes(query)
      );
    }

    if (categoryFilter && categoryFilter.length > 0) {
      filtered = filtered.filter((item) => categoryFilter.includes(item.category));
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }
);

export const selectUniqueCategories = createSelector(
  [(state: { menu: MenuState }) => state.menu.items],
  (items) => {
    const categories = items.map((item) => item.category);
    return Array.from(new Set(categories)).sort();
  }
);
