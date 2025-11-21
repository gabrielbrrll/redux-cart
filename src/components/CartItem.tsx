import {
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import { add, remove, trash } from 'ionicons/icons';
import { useAppDispatch } from '../store';
import { updateQuantity, removeItem } from '../store/cartSlice';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleIncreaseQuantity = () => {
    dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity - 1 }));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.cartItemId));
  };

  const itemTotal = (item.price + item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)) * item.quantity;

  return (
    <IonItem>
      <IonLabel>
        <h2>{item.name}</h2>
        {item.addOns.length > 0 && (
          <p>
            Add-ons: {item.addOns.map((addOn) => addOn.name).join(', ')}
          </p>
        )}
        <p>${itemTotal.toFixed(2)}</p>
      </IonLabel>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IonButton size="small" onClick={handleDecreaseQuantity}>
          <IonIcon icon={remove} />
        </IonButton>

        <IonBadge color="primary">{item.quantity}</IonBadge>

        <IonButton size="small" onClick={handleIncreaseQuantity}>
          <IonIcon icon={add} />
        </IonButton>

        <IonButton size="small" color="danger" onClick={handleRemove}>
          <IonIcon icon={trash} />
        </IonButton>
      </div>
    </IonItem>
  );
};
