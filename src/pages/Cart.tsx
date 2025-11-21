import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../store';
import { CartItem } from '../components/CartItem';
import { selectCartItemCount } from '../store/cartSlice';

export const CartPage: React.FC = () => {
  const history = useHistory();
  const { items, subtotal } = useAppSelector((state) => state.cart);
  const itemCount = useAppSelector(selectCartItemCount);

  const handleCheckout = () => {
    history.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Cart</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonText color="medium">
            <h2>Your cart is empty</h2>
            <p>Add some items from the menu to get started!</p>
          </IonText>
          <IonButton routerLink="/menu">Browse Menu</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cart ({itemCount} items)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {items.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </IonList>

        <div style={{ padding: '1rem' }}>
          <IonText>
            <h2>Subtotal: ${subtotal.toFixed(2)}</h2>
          </IonText>
          <IonButton expand="block" onClick={handleCheckout}>
            Proceed to Checkout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
