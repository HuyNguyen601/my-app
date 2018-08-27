import React from 'react';
import Paper from '@material-ui/core/Paper';
import Shipment from './Shipment'

class AddShipmentPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <Paper>
        <div className = 'container-fluid'>
          <h1> ADD SHIPMENT </h1> <br/> <br/>
          <Shipment />
        </div>
      </Paper>
    );
  }

}

export default AddShipmentPage
