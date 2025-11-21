import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Theme variables */
import './App.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <Redirect to="/menu" />
          </Route>
          <Route exact path="/menu">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Menu Page</h1>
              <p>Menu will be implemented here</p>
            </div>
          </Route>
          <Route exact path="/cart">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Cart Page</h1>
              <p>Cart will be implemented here</p>
            </div>
          </Route>
          <Route exact path="/checkout">
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Checkout Page</h1>
              <p>Checkout will be implemented here</p>
            </div>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
