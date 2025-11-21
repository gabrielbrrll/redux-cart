import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, MenuState } from '../types';

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
  sortBy: 'name',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'price' | 'category'>) => {
      state.sortBy = action.payload;
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

export const { setSearchQuery, setSortBy } = menuSlice.actions;
export default menuSlice.reducer;

export const selectFilteredAndSortedItems = (state: { menu: MenuState }) => {
  const { items, searchQuery, sortBy } = state.menu;

  let filtered = items;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.price.toString().includes(query)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return sorted;
};
