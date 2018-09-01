import React from 'react';
import moment from 'moment-timezone';
//import Paper from '@material-ui/core/Paper';

//DATE PICKER
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//local
import PictureDialog from './PictureDialog'

//GRID
import {EditingState} from '@devexpress/dx-react-grid';
import {Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn} from '@devexpress/dx-react-grid-material-ui';

//material ui
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//FIREBASE database
import {database} from '../firebase'
const getRowId = row => row.id;

class Shipment extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      date: moment(),
      shipment_date: moment(),
      id: 0,
      sName: '',
      sPhone: '',
      sAddress: '',
      rName: '',
      rPhone: '',
      rAddress: '',
      file: false,
      dialog: false,
      URL: '',
      description: '',
      total_amount: 0,
      total_weight: 0,
      total_unit: 0,
      status: 'Processing',
      rows: [],
      columns: [
        {
          name: 'description',
          title: 'Description'
        }, {
          name: 'weight',
          title: 'Weight(lbs)'
        }, {
          name: 'wprice',
          title: 'Price'
        }, {
          name: 'unit',
          title: 'Unit'
        }, {
          name: 'uprice',
          title: 'Price'
        }, {
          name: 'total',
          title: 'Total'
        }
      ],
      tableColumnExtensions: [
        //  { columnName: 'description', width: 100 },
        {
          columnName: 'weight',
          width: 100
        }, {
          columnName: 'wprice',
          width: 100
        }, {
          columnName: 'unit',
          width: 100
        }, {
          columnName: 'uprice',
          width: 100
        }, {
          columnName: 'total',
          width: 100
        }
      ],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {}
    };
    //function for Grid
    this.changeAddedRows = this.changeAddedRows.bind(this);
    this.changeEditingRowIds = this.changeEditingRowIds.bind(this);
    this.changeRowChanges = this.changeRowChanges.bind(this);
    this.commitChanges = this.commitChanges.bind(this);

    //function for input
    this.validateInput = this.validateInput.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    //submit shipment data to database
    this.submitData = this.submitData.bind(this);
    //get shipment details
    this.getShipmentDetails = this.getShipmentDetails.bind(this);
  }

  componentDidMount() {
    if(this.props.shipment)
      this.getShipmentDetails(this.props.id);
  }


  uploadFile(e)
  {
    if(this.fileInput.current.files.length !== 0)
    {
      this.setState({file: true});
      database.uploadFile(this.fileInput.current.files[0], this.props.id);
    }
  }
  downloadFile(e)
  {
  database.downloadFile(this.props.id, function(url){
      this.setState({dialog: true, URL: url});
    }.bind(this));
  }

  //read data
  getShipmentDetails(id) {
    database.getShipment(id, data => this.setState({
      ...data
    }));

  }

  validateInput(e, sender) {
    let result = '';
    const str = e.target.value;
    for (let c of str) {
      result += /[0-9]/.test(c)
        ? c
        : '';
    }
    sender
      ? this.setState({sPhone: result})
      : this.setState({rPhone: result});
  }

  //function for input
  getUserInfo(e, sender) {
    if (e.target.value === '')
      return 0;
    database.getUser(e.target.value, function(data) {
      if (sender === true) {
        this.setState({sName: data.name, sAddress: data.address});
      } else {
        this.setState({rName: data.name, rAddress: data.address})
      }
    }.bind(this));
  }

  submitData() {
    const {
      id,
      sPhone,
      sName,
      sAddress,
      rPhone,
      rName,
      rAddress,
      shipment_date,
      file,
      description,
      status,
      rows,
      total_unit,
      total_weight,
      total_amount
    } = this.state;
    if (sPhone.length === 0) {
      alert("Please Enter Sender's Phone Number!");
      return 0;
    }
    if (rPhone.length === 0) {
      alert("Please Enter Receiver's Phone Number!");
      return 0;
    }
    const sender = {
      phone: sPhone,
      name: sName,
      address: sAddress
    };
    const receiver = {
      phone: rPhone,
      name: rName,
      address: rAddress
    };
    database.addUser(sender);
    database.addUser(receiver);
    const shipment = {};
    shipment.id = id;
    shipment.sPhone = sPhone;
    shipment.sName = sName;
    shipment.sAddress = sAddress;
    shipment.rPhone = rPhone;
    shipment.rName = rName;
    shipment.rAddress = rAddress;
    shipment.shipment_date = typeof shipment_date === 'string'
      ? shipment_date
      : shipment_date.format('MM-DD-YYYY');
    shipment.status = status;
    shipment.rows = rows;
    shipment.description = description;
    shipment.file = file;
    shipment.total_unit = total_unit;
    shipment.total_weight = total_weight;
    shipment.total_amount = total_amount;
    this.props.shipment
      ? database.updateShipment(shipment, this.props.id)
      : database.addShipment(shipment);
    window.location.href = '/';
  }

  //function for GRID
  changeAddedRows(addedRows) {
    const initialized = addedRows.map(row => (
      Object.keys(row).length
      ? row
      : {
        'weight': 0,
        'wprice': 0,
        'unit': 0,
        'uprice': 0
      }));
    this.setState({addedRows: initialized});
  }

  changeEditingRowIds(editingRowIds) {
    this.setState({editingRowIds});
  }

  changeRowChanges(rowChanges) {
    this.setState({rowChanges});
  }

  commitChanges({added, changed, deleted}) {
    let total_amount = 0;
    let total_weight = 0;
    let total_unit = 0;
    let {rows} = this.state;
    if (added) {
      const startingAddedId = rows.length > 0
        ? rows[rows.length - 1].id + 1
        : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row
        }))
      ];
    }
    if (changed) {
      rows = rows.map(row => (
        changed[row.id]
        ? {
          ...row,
          ...changed[row.id]
        }
        : row));
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    rows.forEach(row => {
      row.weight = parseFloat(row.weight).toFixed(2);
      row.wprice = parseFloat(row.wprice).toFixed(2);
      row.unit = parseFloat(row.unit).toFixed(2);
      row.uprice = parseFloat(row.uprice).toFixed(2);
      row.total = (row.weight * row.wprice + row.unit * row.uprice).toFixed(2);
      total_unit = (parseFloat(row.unit) + parseFloat(total_unit)).toFixed(2);
      total_weight = (parseFloat(row.weight) + parseFloat(total_weight)).toFixed(2);
      total_amount = (parseFloat(row.total) + parseFloat(total_amount)).toFixed(2);
    });
    this.setState({rows, total_unit, total_weight, total_amount});
  }

  render() {
    const {
      date,
      id,
      sPhone,
      sName,
      sAddress,
      rPhone,
      rName,
      rAddress,
      description,
      status,
      total_weight,
      total_unit,
      total_amount,
      rows,
      columns,
      tableColumnExtensions,
      editingRowIds,
      addedRows,
      rowChanges
    } = this.state; // moment type

    const name = this.props.shipment
      ? ("SHIPMENT DETAIL - SHIPMENT ID: " + id)
      : "ADD SHIPMENT";

    const shipment_date = (typeof this.state.shipment_date === 'string')
      ? moment(this.state.shipment_date, 'MM-DD-YYYY')
      : this.state.shipment_date;
    const us_date = date.tz('America/Los_Angeles').format('MM-DD-YYYY');
    const us_time = date.tz('America/Los_Angeles').format('hh:mm a');
    const vn_date = date.tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY');
    const vn_time = date.tz('Asia/Ho_Chi_Minh').format('hh:mm a');

    return (<React.Fragment>
      <div className='container'>
        <h1>
          {name}
        </h1>
        <br/>
        <br/>
        <p>Date(US): {us_date}
          - Time: {us_time}</p>
        <p>Date(Vietnam): {vn_date}
          - Time: {vn_time}</p>
      </div>
      <div className='container'>
        {/* Sender and Receiver */}
        <div className='row'>
          <div className='col-sm-6'>
            <div className='card'>
              <div className='card-header'>
                Sender Information
              </div>
              <div className='card-body'>
                <input className='form-control' type='text' placeholder='Sender Phone Number' value={sPhone} onChange={e => this.validateInput(e, true)} onBlur={event => this.getUserInfo(event, true)}/><br/>
                <input className='form-control' type='text' placeholder='Sender Name' value={sName} onChange={e => this.setState({sName: e.target.value})}/><br/>
                <input className='form-control' type='text' placeholder='Sender Address' value={sAddress} onChange={e => this.setState({sAddress: e.target.value})}/>
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <div className='card'>
              <div className='card-header'>
                Receiver Information
              </div>
              <div className='card-body'>
                <input className='form-control' type='text' placeholder='Receiver Phone Number' value={rPhone} onChange={e => this.validateInput(e, false)} onBlur={e => this.getUserInfo(e, false)}/><br/>
                <input className='form-control' type='text' placeholder='Receiver Name' value={rName} onChange={e => this.setState({rName: e.target.value})}/><br/>
                <input className='form-control' type='text' placeholder='Receiver Address' value={rAddress} onChange={e => this.setState({rAddress: e.target.value})}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sender and Receiver */}
      <br/>
      <div className='container'>
        <div className='card'>
          <div className='card-header'>
            Shipment Information
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-sm-4'>
                Date:
                <DatePicker selected={shipment_date} onChange={value => this.setState({shipment_date: value})}/>
                <br/>
                  <input type='file' className='form-control' ref={this.fileInput}/>
                  <button className= 'form-control btn-secondary' onClick={e=>this.uploadFile(e)}>Upload picture</button>
                  <button className= "form-control btn-primary"
                    onClick ={e=>this.downloadFile(e)}
                    style={{display: this.state.file ? 'block' : 'none'}}>Download picture</button>
              </div>
              <div className='col-sm-8'>
                <textarea className='form-control' rows='7' placeholder='Shipment Description' value={description} onChange={e => this.setState({description: e.target.value})}/>
              </div>
            </div>
            <div className='row'>
              <FormControlLabel label={status} control={<Switch
                color = 'primary'
                onChange = {
                  (event, checked) => {
                    checked
                      ? this.setState({status: 'Shipped'})
                      : this.setState({status: 'Processing'})
                  }
                }
                />}/>
            </div>
            <div className='row'>
              <Grid rows={rows} columns={columns} getRowId={getRowId}>
                <EditingState editingRowIds={editingRowIds} onEditingRowIdsChange={this.changeEditingRowIds} rowChanges={rowChanges} onRowChangesChange={this.changeRowChanges} addedRows={addedRows} onAddedRowsChange={this.changeAddedRows} onCommitChanges={this.commitChanges} columnExtensions={[{
                      columnName: 'total',
                      editingEnabled: false
                    }
                  ]}/>
                <Table columnExtensions={tableColumnExtensions}/>
                <TableHeaderRow/>
                <TableEditRow/>
                <TableEditColumn showAddCommand={!addedRows.length} showEditCommand showDeleteCommand/>
              </Grid>
            </div>
            <div className='row'>
              <div className='col-sm-3'>
                <p style={{
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}>Total:
                </p>
              </div>
              <div className='col-sm-3'>
                <p>Weight:
                  <span>{total_weight}
                    lbs</span>
                </p>
              </div>
              <div className='col-sm-3'>
                <p>Units :
                  <span>{total_unit}
                  </span>
                </p>
              </div>
              <div className='col-sm-3'>
                <p>Amount:
                  <span>${total_amount}</span>
                </p>
              </div>
            </div>
            <br/><br/><br/><br/>

            <div className='row'>
              <button className="btn btn-success form-control" onClick={this.submitData} style={{
                  display: this.props.shipment
                    ? 'none'
                    : 'block'
                }}>
                Add Shipment
              </button>
            </div>
            <div className='row'>
              <div className='col-sm-6'>
                <button className="btn btn-primary form-control" onClick={this.submitData} style={{
                    display: this.props.shipment
                      ? 'block'
                      : 'none'
                  }}>Update Shipment
                </button>
              </div>
              <div className='col-sm-6'>
                <button className="btn btn-secondary form-control" style={{
                    display: this.props.shipment
                      ? 'block'
                      : 'none'
                  }}>Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PictureDialog isOpen={this.state.dialog} URL={this.state.URL}/>
    </React.Fragment>);
  }
}

export default Shipment
