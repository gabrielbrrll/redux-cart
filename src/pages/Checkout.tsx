import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { generateReceipt, clearReceipt } from '../store/checkoutSlice';
import { clearCart } from '../store/cartSlice';
import { formatCurrency } from '../utils/format';

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
          <IonButton routerLink="/menu">Browse Products</IonButton>
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
        <IonContent>
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '1rem'
          }}>
            {/* Receipt Ticket Style */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '1.5rem'
            }}>
              {/* Success Icon and Message */}
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  🎉
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  Thank you!
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#666'
                }}>
                  Your order has been placed successfully
                </div>
              </div>

              {/* Dashed Separator */}
              <div style={{
                borderTop: '2px dashed #e0e0e0',
                margin: '1.25rem 0'
              }} />

              {/* Order ID and Amount */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#999',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Order ID
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: '600'
                  }}>
                    {receipt.orderId}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#999',
                    marginBottom: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Amount
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold'
                  }}>
                    ${formatCurrency(receipt.total)}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#999',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Date & Time
                </div>
                <div style={{
                  fontSize: '0.9375rem',
                  fontWeight: '600'
                }}>
                  {new Date(receipt.timestamp).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Items Section */}
              <div style={{
                background: '#f8f8f8',
                borderRadius: '12px',
                padding: '0.875rem',
                marginBottom: '1rem'
              }}>
                {receipt.items.map((item, index) => (
                  <div
                    key={item.cartItemId}
                    style={{
                      paddingBottom: index < receipt.items.length - 1 ? '0.625rem' : '0',
                      marginBottom: index < receipt.items.length - 1 ? '0.625rem' : '0',
                      borderBottom: index < receipt.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.125rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {item.name} <span style={{ color: '#999', fontWeight: '400' }}>×{item.quantity}</span>
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        ${formatCurrency(
                          (item.price + item.addOns.reduce((sum, a) => sum + a.price, 0)) *
                          item.quantity
                        )}
                      </span>
                    </div>
                    {item.addOns.length > 0 && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#666'
                      }}>
                        + {item.addOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Subtotal and Service Charge */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                  color: '#666',
                  marginBottom: '0.375rem'
                }}>
                  <span>Subtotal</span>
                  <span>${formatCurrency(receipt.subtotal)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                  color: '#666'
                }}>
                  <span>Service Charge (10%)</span>
                  <span>${formatCurrency(receipt.serviceCharge)}</span>
                </div>
              </div>

              {/* Dashed Separator */}
              <div style={{
                borderTop: '2px dashed #e0e0e0',
                margin: '0.75rem 0 1rem 0'
              }} />

              {/* Thank you message */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: '#666'
              }}>
                Thank you for shopping with us!
              </div>
            </div>

            <IonButton
              expand="block"
              onClick={handleNewOrder}
              style={{
                '--border-radius': '12px',
                fontWeight: '600',
                height: '48px'
              }}
            >
              Start New Order
            </IonButton>
          </div>
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
      <IonContent>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            margin: '0 0 1.5rem 0'
          }}>
            Order Summary
          </h2>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid #e0e0e0'
          }}>
            {cartState.items.map((item, index) => (
              <div
                key={item.cartItemId}
                style={{
                  padding: '1rem 0',
                  borderBottom: index < cartState.items.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.25rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {item.name} <span style={{ color: '#666', fontWeight: '500' }}>x{item.quantity}</span>
                    </div>
                    {item.addOns.length > 0 && (
                      <div style={{
                        fontSize: '0.8125rem',
                        color: '#666'
                      }}>
                        Add-ons: {item.addOns.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#000',
                    marginLeft: '1rem'
                  }}>
                    ${formatCurrency(
                      (item.price + item.addOns.reduce((sum, a) => sum + a.price, 0)) *
                      item.quantity
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0'
            }}>
              <span style={{ fontSize: '0.9375rem', color: '#666' }}>Subtotal</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>${formatCurrency(cartState.subtotal)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderTop: '1px solid #f0f0f0'
            }}>
              <span style={{ fontSize: '0.9375rem', color: '#666' }}>Service Charge (10%)</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: '500' }}>${formatCurrency(serviceCharge)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 0 0.5rem 0',
              borderTop: '2px solid #e0e0e0',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                ${formatCurrency(total)}
              </span>
            </div>
          </div>

          <IonButton
            expand="block"
            onClick={handleCompleteOrder}
            style={{
              '--border-radius': '12px',
              fontWeight: '600',
              height: '50px'
            }}
          >
            Complete Order
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
