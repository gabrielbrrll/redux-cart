import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonCard,
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
  IonIcon,
} from '@ionic/react';
import { add, remove, close, checkmark } from 'ionicons/icons';
import { useAppDispatch } from '../store';
import { addItem } from '../store/cartSlice';
import type { MenuItem as MenuItemType, AddOn } from '../types';
import { formatCurrency } from '../utils/format';

interface MenuItemProps {
  item: MenuItemType;
}

const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'gift-wrap', name: 'Gift Wrapping', price: 3 },
  { id: 'express-ship', name: 'Express Shipping', price: 5 },
  { id: 'warranty', name: 'Extended Warranty', price: 10 },
  { id: 'gift-card', name: 'Gift Card Message', price: 1 },
  { id: 'premium-pack', name: 'Premium Packaging', price: 2.5 },
];

export const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  const handleCardClick = () => {
    history.push(`/menu/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddOnsModal(true);
  };

  const handleConfirmAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addItem({ item, addOns: selectedAddOns }));
    }
    setShowAddOnsModal(false);
    setSelectedAddOns([]);
    setQuantity(1);
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
      <IonCard
        button
        onClick={handleCardClick}
        style={{ cursor: 'pointer', margin: '0.5rem 0' }}
      >
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '0.75rem'
        }}>
          {/* Image on the left */}
          {item.image && (
            <div style={{
              flex: '0 0 120px',
              width: '120px',
              height: '120px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f8f8f8'
            }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Content on the right */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '120px'
          }}>
            {/* Top section: Title and description */}
            <div>
              <div style={{
                fontSize: '0.65rem',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#999'
              }}>
                {item.category}
              </div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                lineHeight: '1.3',
                margin: '0 0 0.5rem 0'
              }}>
                {item.name}
              </h3>
              {item.description && (
                <p style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontSize: '0.8125rem',
                  lineHeight: '1.4',
                  color: '#666',
                  margin: 0
                }}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Bottom section: Price and button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <strong style={{
                fontSize: '1.125rem',
                color: 'var(--ion-color-primary)'
              }}>
                ${formatCurrency(item.price)}
              </strong>
              <IonButton
                size="small"
                onClick={handleAddToCart}
                style={{
                  '--border-radius': '8px',
                  fontWeight: '600',
                  fontSize: '0.7rem',
                  '--padding-top': '0.5rem',
                  '--padding-bottom': '0.5rem',
                  '--padding-start': '0.75rem',
                  '--padding-end': '0.75rem',
                  height: '32px'
                }}
              >
                Add to Cart
              </IonButton>
            </div>
          </div>
        </div>
      </IonCard>

      <IonModal isOpen={showAddOnsModal} onDidDismiss={() => setShowAddOnsModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Customize {item.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowAddOnsModal(false)}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Quantity
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              justifyContent: 'center'
            }}>
              <IonButton
                fill="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                style={{ '--border-radius': '50%', width: '44px', height: '44px' }}
              >
                <IonIcon icon={remove} slot="icon-only" />
              </IonButton>
              <span style={{ fontSize: '1.5rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <IonButton
                fill="outline"
                onClick={() => setQuantity(quantity + 1)}
                style={{ '--border-radius': '50%', width: '44px', height: '44px' }}
              >
                <IonIcon icon={add} slot="icon-only" />
              </IonButton>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Add-ons
            </h3>
            <IonList>
              {AVAILABLE_ADDONS.map((addOn) => (
                <IonItem
                  key={addOn.id}
                  button
                  onClick={() => handleAddOnToggle(addOn, !selectedAddOns.some((a) => a.id === addOn.id))}
                  detail={false}
                >
                  {selectedAddOns.some((a) => a.id === addOn.id) && (
                    <IonIcon
                      icon={checkmark}
                      slot="start"
                      color="primary"
                      style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                    />
                  )}
                  {!selectedAddOns.some((a) => a.id === addOn.id) && (
                    <div slot="start" style={{ width: '20px', marginRight: '16px' }} />
                  )}
                  <IonLabel>
                    <h2>{addOn.name}</h2>
                    <p>+${formatCurrency(addOn.price)}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            <div style={{ marginTop: '2rem' }}>
              <IonButton
                expand="block"
                onClick={handleConfirmAddToCart}
                style={{
                  '--border-radius': '12px',
                  fontWeight: '600'
                }}
              >
                Add to Cart
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};
