import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonIcon,
  IonButtons,
  IonModal,
} from '@ionic/react';
import { alertCircleOutline, refreshOutline, optionsOutline, closeOutline, checkmark } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchMenu, selectFilteredAndSortedItems, selectUniqueCategories, setSortBy, setCategoryFilter, toggleCategory } from '../store/menuSlice';
import { MenuItem } from '../components/MenuItem';
import { SearchBar } from '../components/SearchBar';

export const MenuPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, sortBy, categoryFilter } = useAppSelector((state) => state.menu);
  const filteredItems = useAppSelector(selectFilteredAndSortedItems);
  const categories = useAppSelector(selectUniqueCategories);
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && categoryFilter.length === 0) {
      dispatch(setCategoryFilter(categories));
    }
  }, [categories, categoryFilter.length, dispatch]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Products</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <div style={{ marginTop: '2rem' }}>
            <IonSpinner name="crescent" color="primary" />
            <IonText color="medium">
              <p>Loading products...</p>
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
            <IonTitle>Products</IonTitle>
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
              <h2>Unable to Load Products</h2>
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
          <IonTitle>Products</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowFilterModal(true)}>
              <IonIcon icon={optionsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <SearchBar />

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

      <IonModal isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sort & Filter</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowFilterModal(false)}>
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Sort By
            </h3>
            <IonItem button onClick={() => dispatch(setSortBy('name-asc'))} detail={false}>
              {sortBy === 'name-asc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'name-asc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Name (A-Z)</IonLabel>
            </IonItem>
            <IonItem button onClick={() => dispatch(setSortBy('name-desc'))} detail={false}>
              {sortBy === 'name-desc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'name-desc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Name (Z-A)</IonLabel>
            </IonItem>
            <IonItem button onClick={() => dispatch(setSortBy('category-asc'))} detail={false}>
              {sortBy === 'category-asc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'category-asc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Category (A-Z)</IonLabel>
            </IonItem>
            <IonItem button onClick={() => dispatch(setSortBy('category-desc'))} detail={false}>
              {sortBy === 'category-desc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'category-desc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Category (Z-A)</IonLabel>
            </IonItem>
            <IonItem button onClick={() => dispatch(setSortBy('price-asc'))} detail={false}>
              {sortBy === 'price-asc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'price-asc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Price (Lowest to Highest)</IonLabel>
            </IonItem>
            <IonItem button onClick={() => dispatch(setSortBy('price-desc'))} detail={false}>
              {sortBy === 'price-desc' && (
                <IonIcon
                  icon={checkmark}
                  slot="start"
                  color="primary"
                  style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                />
              )}
              {sortBy !== 'price-desc' && (
                <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
              )}
              <IonLabel>Price (Highest to Lowest)</IonLabel>
            </IonItem>

            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '2rem 0 1rem 0' }}>
              Filter by Category
            </h3>
            {categories.map((category) => (
              <IonItem
                key={category}
                button
                onClick={() => dispatch(toggleCategory(category))}
                detail={false}
              >
                {categoryFilter.includes(category) && (
                  <IonIcon
                    icon={checkmark}
                    slot="start"
                    color="primary"
                    style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                  />
                )}
                {!categoryFilter.includes(category) && (
                  <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
                )}
                <IonLabel style={{ textTransform: 'capitalize' }}>
                  {category}
                </IonLabel>
              </IonItem>
            ))}

            <div style={{ marginTop: '2rem' }}>
              <IonButton
                expand="block"
                onClick={() => setShowFilterModal(false)}
                style={{
                  '--border-radius': '12px',
                  fontWeight: '600'
                }}
              >
                Apply
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};
