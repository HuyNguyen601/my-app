import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from './Navigation';
import AddShipmentPage from './AddShipment';
import HomePage from './Home';

import * as routes from '../constants/routes';

const App = () =>
  <Router>
    <div>
      <Navigation />
      <Route
        exact path={routes.ADD_SHIPMENT}
        component={() => <AddShipmentPage />}
      />
      <Route
        exact path={routes.HOME}
        component={() => <HomePage />}
      />
    </div>
  </Router>

  export default App;
