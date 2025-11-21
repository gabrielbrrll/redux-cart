import { useState } from 'react';
import {
  IonItem,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonLabel,
} from '@ionic/react';
import { add, remove, pencil, close, checkmark } from 'ionicons/icons';
import { useAppDispatch } from '../store';
import { updateQuantity, updateItem } from '../store/cartSlice';
import type { CartItem as CartItemType, AddOn } from '../types';
import { formatCurrency } from '../utils/format';

const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'gift-wrap', name: 'Gift Wrapping', price: 3 },
  { id: 'express-ship', name: 'Express Shipping', price: 5 },
  { id: 'warranty', name: 'Extended Warranty', price: 10 },
  { id: 'gift-card', name: 'Gift Card Message', price: 1 },
  { id: 'premium-pack', name: 'Premium Packaging', price: 2.5 },
];

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editAddOns, setEditAddOns] = useState<AddOn[]>(item.addOns);

  const handleIncreaseQuantity = () => {
    dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity - 1 }));
  };

  const handleEdit = () => {
    setEditQuantity(item.quantity);
    setEditAddOns(item.addOns);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateItem({
      cartItemId: item.cartItemId,
      addOns: editAddOns,
      quantity: editQuantity
    }));
    setShowEditModal(false);
  };

  const handleAddOnToggle = (addOn: AddOn, checked: boolean) => {
    if (checked) {
      setEditAddOns([...editAddOns, addOn]);
    } else {
      setEditAddOns(editAddOns.filter((a) => a.id !== addOn.id));
    }
  };

  const itemTotal = (item.price + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity;

  return (
    <IonItem lines="none" style={{ '--padding-start': '0', '--inner-padding-end': '0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{
        display: 'flex',
        width: '100%',
        gap: '1rem',
        padding: '1rem 0'
      }}>
        {item.image && (
          <div style={{
            flex: '0 0 100px',
            width: '100px',
            alignSelf: 'stretch',
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

        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#999',
              marginBottom: '0.25rem'
            }}>
              {item.category}
            </div>
            <h3 style={{
              fontSize: '0.9375rem',
              fontWeight: '600',
              margin: '0 0 0.25rem 0',
              lineHeight: '1.3'
            }}>
              {item.name}
            </h3>
            {item.addOns.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: '#666',
                margin: '0 0 0.5rem 0'
              }}>
                <span>Add-ons: {item.addOns.map((addOn) => addOn.name).join(', ')}</span>
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={handleEdit}
                  style={{ '--padding-start': '4px', '--padding-end': '4px', height: '20px', margin: '0' }}
                >
                  <IonIcon icon={pencil} slot="icon-only" style={{ fontSize: '0.875rem' }} />
                </IonButton>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <strong style={{
              fontSize: '1rem',
              color: 'var(--ion-color-primary)'
            }}>
              ${formatCurrency(itemTotal)}
            </strong>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IonButton
                fill="outline"
                size="small"
                onClick={handleDecreaseQuantity}
                style={{ '--border-radius': '50%', width: '28px', height: '28px', fontSize: '0.75rem' }}
              >
                <IonIcon icon={remove} slot="icon-only" style={{ fontSize: '1rem' }} />
              </IonButton>

              <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                {item.quantity}
              </span>

              <IonButton
                fill="outline"
                size="small"
                onClick={handleIncreaseQuantity}
                style={{ '--border-radius': '50%', width: '28px', height: '28px', fontSize: '0.75rem' }}
              >
                <IonIcon icon={add} slot="icon-only" style={{ fontSize: '1rem' }} />
              </IonButton>
            </div>
          </div>
        </div>
      </div>

      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit {item.name}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEditModal(false)}>
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
                onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                disabled={editQuantity <= 1}
                style={{ '--border-radius': '50%', width: '44px', height: '44px' }}
              >
                <IonIcon icon={remove} slot="icon-only" />
              </IonButton>
              <span style={{ fontSize: '1.5rem', fontWeight: '600', minWidth: '40px', textAlign: 'center' }}>
                {editQuantity}
              </span>
              <IonButton
                fill="outline"
                onClick={() => setEditQuantity(editQuantity + 1)}
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
                  onClick={() => handleAddOnToggle(addOn, !editAddOns.some((a) => a.id === addOn.id))}
                  detail={false}
                >
                  {editAddOns.some((a) => a.id === addOn.id) && (
                    <IonIcon
                      icon={checkmark}
                      slot="start"
                      color="primary"
                      style={{ fontSize: '1.25rem', marginRight: '16px', minWidth: '20px' }}
                    />
                  )}
                  {!editAddOns.some((a) => a.id === addOn.id) && (
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
                onClick={handleSaveEdit}
                style={{
                  '--border-radius': '12px',
                  fontWeight: '600'
                }}
              >
                Save Changes
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonItem>
  );
};
