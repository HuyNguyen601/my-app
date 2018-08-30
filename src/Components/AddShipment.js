import React from 'react';
import Paper from '@material-ui/core/Paper';
import Shipment from './Shipment'

class AddShipmentPage extends React.Component {

  render(){
    return(
      <Paper>
        <div className = 'container-fluid'>
          <Shipment />
        </div>
      </Paper>
    );
  }

}

export default AddShipmentPage
