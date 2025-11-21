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
  IonButton,
  IonText,
  IonIcon,
} from '@ionic/react';
import { alertCircleOutline, refreshOutline } from 'ionicons/icons';
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
          <div style={{ marginTop: '2rem' }}>
            <IonSpinner name="crescent" color="primary" />
            <IonText color="medium">
              <p>Loading menu...</p>
            </IonText>
          </div>
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
        <IonContent className="ion-padding ion-text-center">
          <div style={{ marginTop: '2rem' }}>
            <IonIcon
              icon={alertCircleOutline}
              style={{ fontSize: '64px' }}
              color="danger"
            />
            <IonText color="danger">
              <h2>Unable to Load Menu</h2>
            </IonText>
            <IonText color="medium">
              <p>We're having trouble connecting to our servers. Please check your internet connection and try again.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>{error}</p>
            </IonText>
            <IonButton onClick={() => dispatch(fetchMenu())}>
              <IonIcon slot="start" icon={refreshOutline} />
              Retry
            </IonButton>
          </div>
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

        {filteredItems.length === 0 ? (
          <div className="ion-padding ion-text-center" style={{ marginTop: '2rem' }}>
            <IonText color="medium">
              <h3>No items found</h3>
              <p>Try adjusting your search or filters</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {filteredItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
