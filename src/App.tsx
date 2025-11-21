import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { cube, cart, checkmarkCircle } from 'ionicons/icons';
import { MenuPage } from './pages/Menu';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/Cart';
import { CheckoutPage } from './pages/Checkout';

import './App.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to="/menu" />
            </Route>
            <Route exact path="/menu">
              <MenuPage />
            </Route>
            <Route exact path="/menu/:id">
              <ProductDetail />
            </Route>
            <Route exact path="/cart">
              <CartPage />
            </Route>
            <Route exact path="/checkout">
              <CheckoutPage />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="menu" href="/menu">
              <IonIcon icon={cube} />
              <IonLabel>Products</IonLabel>
            </IonTabButton>

            <IonTabButton tab="cart" href="/cart">
              <IonIcon icon={cart} />
              <IonLabel>Cart</IonLabel>
            </IonTabButton>

            <IonTabButton tab="checkout" href="/checkout">
              <IonIcon icon={checkmarkCircle} />
              <IonLabel>Checkout</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
