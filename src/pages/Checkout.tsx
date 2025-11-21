import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { generateReceipt, clearReceipt } from '../store/checkoutSlice';
import { clearCart } from '../store/cartSlice';

export const CheckoutPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);
  const receipt = useAppSelector((state) => state.checkout.receipt);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleCompleteOrder = () => {
    dispatch(generateReceipt(cartState));
    dispatch(clearCart());
    setOrderCompleted(true);
  };

  const handleNewOrder = () => {
    dispatch(clearReceipt());
    setOrderCompleted(false);
    history.push('/menu');
  };

  if (cartState.items.length === 0 && !orderCompleted) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Checkout</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonText color="medium">
            <h2>No items to checkout</h2>
            <p>Add some items to your cart first!</p>
          </IonText>
          <IonButton routerLink="/menu">Browse Menu</IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (orderCompleted && receipt) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Order Complete!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonCard>
            <IonCardContent>
              <IonText color="success">
                <h2>Thank you for your order!</h2>
              </IonText>

              <h3>Receipt</h3>
              <p>
                <small>
                  {new Date(receipt.timestamp).toLocaleString()}
                </small>
              </p>

              <IonList>
                {receipt.items.map((item) => (
                  <IonItem key={item.cartItemId}>
                    <IonLabel>
                      <h3>{item.name} x{item.quantity}</h3>
                      {item.addOns.length > 0 && (
                        <p>Add-ons: {item.addOns.map((a) => a.name).join(', ')}</p>
                      )}
                    </IonLabel>
                    <IonText slot="end">
                      $
                      {(
                        (item.price + item.addOns.reduce((sum, a) => sum + a.price, 0)) *
                        item.quantity
                      ).toFixed(2)}
                    </IonText>
                  </IonItem>
                ))}
              </IonList>

              <IonItem lines="none">
                <IonLabel>Subtotal</IonLabel>
                <IonText slot="end">${receipt.subtotal.toFixed(2)}</IonText>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>Service Charge (10%)</IonLabel>
                <IonText slot="end">${receipt.serviceCharge.toFixed(2)}</IonText>
              </IonItem>
              <IonItem lines="none">
                <IonLabel>
                  <strong>Total</strong>
                </IonLabel>
                <IonText slot="end">
                  <strong>${receipt.total.toFixed(2)}</strong>
                </IonText>
              </IonItem>

              <IonButton expand="block" onClick={handleNewOrder}>
                Start New Order
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  const serviceCharge = cartState.subtotal * 0.1;
  const total = cartState.subtotal + serviceCharge;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Order Summary</h2>

        <IonList>
          {cartState.items.map((item) => (
            <IonItem key={item.cartItemId}>
              <IonLabel>
                <h3>{item.name} x{item.quantity}</h3>
                {item.addOns.length > 0 && (
                  <p>Add-ons: {item.addOns.map((a) => a.name).join(', ')}</p>
                )}
              </IonLabel>
              <IonText slot="end">
                $
                {(
                  (item.price + item.addOns.reduce((sum, a) => sum + a.price, 0)) *
                  item.quantity
                ).toFixed(2)}
              </IonText>
            </IonItem>
          ))}
        </IonList>

        <IonItem lines="none">
          <IonLabel>Subtotal</IonLabel>
          <IonText slot="end">${cartState.subtotal.toFixed(2)}</IonText>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Service Charge (10%)</IonLabel>
          <IonText slot="end">${serviceCharge.toFixed(2)}</IonText>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <strong>Total</strong>
          </IonLabel>
          <IonText slot="end">
            <strong>${total.toFixed(2)}</strong>
          </IonText>
        </IonItem>

        <div style={{ marginTop: '2rem' }}>
          <IonButton expand="block" onClick={handleCompleteOrder}>
            Complete Order
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
