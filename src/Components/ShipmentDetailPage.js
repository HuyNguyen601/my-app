import React from 'react';
import Paper from '@material-ui/core/Paper';
import Shipment from './Shipment';


class ShipmentDetailPage extends React.Component {

  render(){

    return(
      <Paper>
        <div className = 'container-fluid'>
          <Shipment shipment id={this.props.id}/>
        </div>
      </Paper>
    );
  }

}

export default ShipmentDetailPage
