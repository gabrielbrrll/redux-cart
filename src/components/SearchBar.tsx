import { IonSearchbar } from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSearchQuery } from '../store/menuSlice';

export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.menu.searchQuery);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  return (
    <IonSearchbar
      value={searchQuery}
      onIonInput={(e) => handleSearchChange(e.detail.value || '')}
      debounce={300}
      placeholder="Search menu items..."
    />
  );
};
