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
          <Shipment name='ADD SHIPMENT'/>
        </div>
      </Paper>
    );
  }

}

export default AddShipmentPage
