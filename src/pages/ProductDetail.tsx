import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { heart, heartOutline, add, remove, close, checkmark } from 'ionicons/icons';
import { useAppSelector, useAppDispatch } from '../store';
import { addItem } from '../store/cartSlice';
import type { AddOn } from '../types';
import { formatCurrency } from '../utils/format';

const AVAILABLE_ADDONS: AddOn[] = [
  { id: 'gift-wrap', name: 'Gift Wrapping', price: 3 },
  { id: 'express-ship', name: 'Express Shipping', price: 5 },
  { id: 'warranty', name: 'Extended Warranty', price: 10 },
  { id: 'gift-card', name: 'Gift Card Message', price: 1 },
  { id: 'premium-pack', name: 'Premium Packaging', price: 2.5 },
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) =>
    state.menu.items.find((item) => item.id === parseInt(id))
  );

  const [showAddOnsModal, setShowAddOnsModal] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!item) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/menu" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <IonText color="medium">
            <h2>Item not found</h2>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  const handleAddToCart = () => {
    setShowAddOnsModal(true);
  };

  const handleConfirmAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addItem({ item, addOns: selectedAddOns }));
    }
    setShowAddOnsModal(false);
    setSelectedAddOns([]);
    setQuantity(1);
    history.push('/cart');
  };

  const handleAddOnToggle = (addOn: AddOn, checked: boolean) => {
    if (checked) {
      setSelectedAddOns([...selectedAddOns, addOn]);
    } else {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/menu" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '1rem',
          paddingBottom: '140px',
          background: '#fff'
        }}>
          {/* Product Image */}
          <div style={{
            background: '#f8f8f8',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          {/* Product Info */}
          <div style={{ padding: '0 0.5rem' }}>
            <IonText style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#999',
              fontWeight: '500'
            }}>
              <div>{item.category}</div>
            </IonText>

            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0.5rem 0 1.5rem 0',
              lineHeight: '1.3',
              color: '#000'
            }}>
              {item.name}
            </h1>

            {/* Description */}
            {item.description && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: '#000'
                }}>
                  Description
                </h3>
                <IonText color="medium">
                  <p style={{
                    fontSize: '0.9375rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </IonText>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Section - Price and Add to Cart */}
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
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ flex: '0 0 auto' }}>
              <IonText color="medium" style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block'
              }}>
                PRICE
              </IonText>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#000',
                marginTop: '0.25rem'
              }}>
                ${formatCurrency(item.price)}
              </div>
            </div>

            <IonButton
              fill="clear"
              onClick={() => setIsFavorite(!isFavorite)}
              style={{
                '--padding-start': '8px',
                '--padding-end': '8px',
                margin: 0,
                flex: '0 0 auto'
              }}
            >
              <IonIcon
                icon={isFavorite ? heart : heartOutline}
                style={{ fontSize: '1.5rem' }}
                color={isFavorite ? 'danger' : 'medium'}
              />
            </IonButton>

            <IonButton
              expand="block"
              size="large"
              onClick={handleAddToCart}
              style={{
                '--border-radius': '12px',
                '--background': '#000',
                '--background-activated': '#333',
                '--background-hover': '#222',
                fontWeight: '600',
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                height: '50px',
                flex: '1 1 auto',
                margin: 0
              }}
            >
              ADD TO CART
            </IonButton>
          </div>
        </div>

        {/* Add-ons Modal */}
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
      </IonContent>
    </IonPage>
  );
};
