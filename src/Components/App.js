import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import {auth} from '../firebase'
import LoginPage from './Login'
import Navigation from './Navigation';
import AddShipmentPage from './AddShipment';
import HomePage from './Home';
import ShipmentDetailPage from './ShipmentDetailPage';

import * as routes from '../constants/routes';


class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {loggedIn: false};
    this.changeAuth = ()=>{this.setState({loggedIn: !this.state.loggedIn})}
  }

  componentDidMount(){
    console.log(auth.getUser(), this.state.loggedIn);
    /*auth.watchChange(function(user){
      if(user)
        this.setState({loggedIn: true});
      else
        this.setState({loggedIn: false});
    }.bind(this));*/
  }

  render() {
    const loggedIn = this.state.loggedIn;
    return (<Router>
      <div>
        <Navigation/>
        <Route exact path={routes.LOGIN} render={() => (
            loggedIn
            ? (<Redirect to={routes.HOME} />)
            : (<LoginPage auth={this.changeAuth} />)
          )}/>
        <Route exact path={routes.ADD_SHIPMENT} render={() => (
            loggedIn
            ? (<AddShipmentPage/>)
            : (<Redirect to={routes.LOGIN}/>)
          )}/>
        <Route exact path={routes.HOME} render={() => (
            loggedIn
            ? (<HomePage />)
            : (<Redirect to={routes.LOGIN}/>)
          )}/>
        <Route path={routes.SHIPMENTS} render={({match}) => (
            loggedIn
            ? (<ShipmentDetailPage id={match.params.id}/>)
            : (<Redirect to={routes.LOGIN}/>)
          )}/>
      </div>
    </Router>);
  }
}

export default App;
