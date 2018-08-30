import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from './Navigation';
import AddShipmentPage from './AddShipment';
import HomePage from './Home';
import ShipmentDetailPage from './ShipmentDetailPage';

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
      <Route path={routes.SHIPMENTS} render={({match})=><ShipmentDetailPage id={match.params.id}/>}/>
    </div>
  </Router>

  export default App;
