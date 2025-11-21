import { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
} from '@ionic/react';
import { useAppDispatch } from '../store';
import { addItem } from '../store/cartSlice';
import type { MenuItem as MenuItemType, AddOn } from '../types';

interface MenuItemProps {
  item: MenuItemType;
}

const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'cheese', name: 'Extra Cheese', price: 2 },
  { id: 'bacon', name: 'Bacon', price: 3 },
  { id: 'avocado', name: 'Avocado', price: 2.5 },
  { id: 'fries', name: 'Fries', price: 4 },
  { id: 'ketchup', name: 'Ketchup', price: 0.5 },
];

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const handleAddToCart = () => {
    setShowAddOnsModal(true);
  };

  const handleConfirmAddToCart = () => {
    dispatch(addItem({ item, addOns: selectedAddOns }));
    setShowAddOnsModal(false);
    setSelectedAddOns([]);
  };

  const handleAddOnToggle = (addOn: AddOn, checked: boolean) => {
    if (checked) {
      setSelectedAddOns([...selectedAddOns, addOn]);
    } else {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    }
  };

  return (
    <>
      <IonCard>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}
        <IonCardHeader>
          <IonCardTitle>{item.name}</IonCardTitle>
          <IonCardSubtitle>{item.category}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {item.description && <p>{item.description}</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <strong>${item.price.toFixed(2)}</strong>
            <IonButton onClick={handleAddToCart}>Add to Cart</IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <IonModal isOpen={showAddOnsModal} onDidDismiss={() => setShowAddOnsModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Customize {item.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddOnsModal(false)}>Cancel</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {AVAILABLE_ADDONS.map((addOn) => (
              <IonItem key={addOn.id}>
                <IonLabel>
                  {addOn.name} (+${addOn.price.toFixed(2)})
                </IonLabel>
                <IonCheckbox
                  slot="end"
                  checked={selectedAddOns.some((a) => a.id === addOn.id)}
                  onIonChange={(e) => handleAddOnToggle(addOn, e.detail.checked)}
                />
              </IonItem>
            ))}
          </IonList>
          <div style={{ padding: '1rem' }}>
            <IonButton expand="block" onClick={handleConfirmAddToCart}>
              Add to Cart
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};
