import { useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonList,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMenu, selectFilteredAndSortedItems, setSortBy } from '../store/menuSlice';
import { MenuItem } from '../components/MenuItem';
import { SearchBar } from '../components/SearchBar';

export const MenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.menu);
  const sortBy = useAppSelector((state) => state.menu.sortBy);
  const filteredItems = useAppSelector(selectFilteredAndSortedItems);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Error: {error}</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SearchBar />

        <IonItem lines="none">
          <IonLabel>Sort by:</IonLabel>
          <IonSelect
            value={sortBy}
            onIonChange={(e) => dispatch(setSortBy(e.detail.value))}
          >
            <IonSelectOption value="name">Name</IonSelectOption>
            <IonSelectOption value="price">Price</IonSelectOption>
            <IonSelectOption value="category">Category</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonList>
          {filteredItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
