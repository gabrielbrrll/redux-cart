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
import { formatCurrency } from '../utils/format';

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
            <p>Add some items to get started!</p>
          </IonText>
          <IonButton routerLink="/menu">Browse Products</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '0 1rem',
          paddingBottom: '140px'
        }}>
          <IonList style={{ background: 'transparent' }}>
            {items.map((item) => (
              <CartItem key={item.cartItemId} item={item} />
            ))}
          </IonList>
        </div>

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #e0e0e0',
          padding: '1rem',
          paddingBottom: '1rem',
          zIndex: 10,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <IonText color="medium" style={{
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Subtotal
              </IonText>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#000'
              }}>
                ${formatCurrency(subtotal)}
              </div>
            </div>
            <IonButton
              expand="block"
              onClick={handleCheckout}
              style={{
                '--border-radius': '12px',
                fontWeight: '600',
                height: '50px'
              }}
            >
              Proceed to Checkout
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
