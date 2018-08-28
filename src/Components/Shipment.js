import React from 'react';
import moment from 'moment-timezone';
//import Paper from '@material-ui/core/Paper';

//DATE PICKER
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//GRID
import {EditingState} from '@devexpress/dx-react-grid';
import {Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn} from '@devexpress/dx-react-grid-material-ui';

//FIREBASE database
import {database} from '../firebase'
const getRowId = row => row.id;

class Shipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment(),
      shipment_date: moment(),
      sName: '',
      sPhone: '',
      sAddress: '',
      rName: '',
      rPhone: '',
      rAddress: '',
      description: '',
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
        { columnName: 'weight', width: 100},
        { columnName: 'wprice', width: 100},
        { columnName: 'unit', width: 100},
        { columnName: 'uprice', width: 100},
        { columnName: 'total', width: 100}
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
    //submit shipment data to database
    this.submitData = this.submitData.bind(this);
  }
  validateInput(e,sender)
  {
    let result = '';
    const str = e.target.value;
    for (let c of str)
    {
      result += /[0-9]/.test(c) ? c : '';
    }
    sender ? this.setState({sPhone: result}) : this.setState({rPhone: result});
  }

  //function for input
  getUserInfo(e,sender) {
    if(e.target.value === '') return 0;
    database.getUser(e.target.value,function(data){
      if (sender === true){
        this.setState({sName: data.name, sAddress: data.address});
      }
      else {
        this.setState({rName: data.name, rAddress: data.address})
      }
    }.bind(this));
  }

  submitData(){
    const {sPhone, sName, sAddress, rPhone, rName, rAddress, shipment_date, description, rows} = this.state;
    if(sPhone.length === 0)
    {
      alert("Please Enter Sender's Phone Number!");
      return 0;
    }
    if(rPhone.length === 0)
    {
      alert("Please Enter Receiver's Phone Number!");
      return 0;
    }
    const sender = {phone: sPhone, name: sName, address: sAddress};
    const receiver = {phone: rPhone, name: rName, address: rAddress};
    database.addUser(sender);
    database.addUser(receiver);
    const shipment = {};
    shipment.sPhone = sPhone;
    shipment.sName = sName;
    shipment.sAddress = sAddress;
    shipment.rPhone = rPhone;
    shipment.rName = rName;
    shipment.rAddress = rAddress;
    shipment.date = shipment_date.format('MM-DD-YYYY');
    shipment.items = rows;
    shipment.description = description;
    database.addShipment(shipment);
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
    rows.forEach(row=>{
      row.total = row.weight*row.wprice + row.unit*row.uprice;
      console.log(row.weight,row.wprice,row.unit,row.uprice);
    });
    this.setState({rows});
  }

  render() {
    const {
      date,
      shipment_date,
      sPhone,
      sName,
      sAddress,
      rPhone,
      rName,
      rAddress,
      rows,
      columns,
      tableColumnExtensions,
      editingRowIds,
      addedRows,
      rowChanges
    } = this.state; // moment type
    const us_date = date.tz('America/Los_Angeles').format('MM-DD-YYYY');
    const us_time = date.tz('America/Los_Angeles').format('hh:mm a');
    const vn_date = date.tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY');
    const vn_time = date.tz('Asia/Ho_Chi_Minh').format('hh:mm a');

    return (
      <React.Fragment>
        <div className='container'>
          <h1> {this.props.name} </h1> <br/> <br/>
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
                  <input className='form-control' type='text' placeholder='Sender Phone Number' value={sPhone} onChange={e=>this.validateInput(e,true)} onBlur={event=>this.getUserInfo(event,true)} /><br/>
                  <input className='form-control' type='text' placeholder='Sender Name' value={sName} onChange={e=>this.setState({sName: e.target.value})} /><br/>
                  <input className='form-control' type='text' placeholder='Sender Address' value={sAddress} onChange={e=>this.setState({sAddress: e.target.value})} />
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='card'>
                <div className='card-header'>
                  Receiver Information
                </div>
                <div className='card-body'>
                  <input className='form-control' type='text' placeholder='Receiver Phone Number' value={rPhone} onChange={e => this.validateInput(e,false)} onBlur={e=>this.getUserInfo(e,false)} /><br/>
                  <input className='form-control' type='text' placeholder='Receiver Name' value={rName} onChange={e=>this.setState({rName: e.target.value})}  /><br/>
                  <input className='form-control' type='text' placeholder='Receiver Address' value={rAddress} onChange={e=>this.setState({rAddress: e.target.value})} />
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
                  <label> Date: <DatePicker selected={shipment_date} onChange={value => this.setState({shipment_date: value})}/></label> <br />
                  <input type='file' className='form-control'/>
                </div>
                <div className='col-sm-8'>
                  <textarea className='form-control' rows='7' placeholder='Shipment Description' onChange={e=>this.setState({description: e.target.value})}/>
                </div>
              </div>
                <div className='row'>
                  <Grid rows={rows} columns={columns} getRowId={getRowId}>
                    <EditingState
                      editingRowIds={editingRowIds}
                      onEditingRowIdsChange={this.changeEditingRowIds}
                      rowChanges={rowChanges}
                      onRowChangesChange={this.changeRowChanges}
                      addedRows={addedRows} onAddedRowsChange={this.changeAddedRows}
                      onCommitChanges={this.commitChanges}
                      columnExtensions={[{columnName: 'total', editingEnabled: false}]}/>
                    <Table columnExtensions={tableColumnExtensions}/>
                    <TableHeaderRow/>
                    <TableEditRow/>
                    <TableEditColumn showAddCommand={!addedRows.length} showEditCommand showDeleteCommand/>
                  </Grid>
                </div><br/><br/><br/><br/>
                <button className= "btn btn-success form-control" onClick={this.submitData}> {this.props.name} </button>
              </div>
            </div>
          </div>
        </React.Fragment>
    );
  }
}

export default Shipment
