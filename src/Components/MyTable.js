import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {database} from '../firebase'

import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  SelectionState
} from '@devexpress/dx-react-grid';
import {Grid, Table, TableHeaderRow, PagingPanel, Toolbar, SearchPanel, TableSelection
} from '@devexpress/dx-react-grid-material-ui';

//material ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
//react router
//import {Redirect} from 'react-router-dom'


const getRowId = row => row.link;

export default class MyTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableColumnExtensions: [
      //  { columnName: 'description', width: 100 },
        { columnName: 'id', width: 80},
        { columnName: 'sName', width: 150},
        { columnName: 'sPhone', width: 120},
        { columnName: 'rName', width: 150},
        { columnName: 'rPhone', width: 120},
        { columnName: 'sAddress', wordWrapEnabled: true},
        { columnName: 'rAddress', wordWrapEnabled: true},
        { columnName: 'total_weight', width: 100},
        { columnName: 'total_amount', width: 100},
        { columnName: 'shipment_date', width: 100},
        { columnName: 'status', width: 100}
      ],
      columns: [
        {
          name: 'id',
          title: 'ID'
        },
        {
          name: 'sName',
          title: 'Sender Name'
        }, {
          name: 'sPhone',
          title: 'Sender Phone'
        }, {
          name: 'sAddress',
          title: 'Sender Address'
        },
        {
          name: 'shipment_date',
          title: 'Order Date'
        },
        {
          name: 'rName',
          title: 'Receiver Name'
        },
        {
          name: 'rPhone',
          title: 'Recerver Phone'
        },
        {
          name: 'rAddress',
          title: 'Receiver Address'
        },
        {
          name: 'total_weight',
          title: 'Weight(lbs)'
        },
        {
          name: 'total_amount',
          title: 'Amount($)'
        }
      ],
      rows: [
        {

        }
      ],
      searchValue: '',
      sorting: [{columnName: 'status', direction: 'asc'}],
      fullRows: [],
      status: 'Processing',
      pageSizes: [10,20,30,50,100, 0]
    };
    this.changeSorting = sorting => this.setState({sorting});
    //database.initializeTable(this.changeRowValue);

    this.changeSearchValue = value => this.setState({searchValue: value});
    this.toShipMentPage = this.toShipMentPage.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }
  componentDidMount(){
    database.initializeTable(function(value){
      this.setState({fullRows: value});
      const fullRows = this.state.fullRows;
      this.state.status === 'All' ? this.setState({rows: fullRows})
                                  : this.setState({rows: fullRows.filter(row=>row.status === this.state.status) });
    }.bind(this));
  }

  toShipMentPage(id){
    const path = '/shipments/' + id;
    console.log(path);
    window.location.href= path;
  }

  changeTab(value) {
    this.setState({status: value});
    const {fullRows, columns} = this.state;
    value === 'All' ? this.setState({rows: fullRows, columns: [...columns,{name:'status', title: 'Status'}]})
                                : this.setState({rows: fullRows.filter(row=>row.status === value)});
  }

  render() {
    const {rows, columns,searchValue,sorting, pageSizes, status} = this.state;
    return (<React.Fragment>
      <Paper>
        <Tabs value={status} onChange={(e,value)=>this.changeTab(value)} indicatorColor ='primary'>
          <Tab value='Processing' label="Processing" />
          <Tab value='Shipped' label="Shipped" />
          <Tab value='All' label="All" />
        </Tabs>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SearchState
            value={searchValue}
            onValueChange={this.changeSearchValue}
          />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <PagingState defaultCurrentPage={0} pageSize={10}/>
          <IntegratedFiltering/>
          <IntegratedPaging/>
          <SelectionState onSelectionChange= {id=>this.toShipMentPage(id)}/>
          <Table columnExtensions={this.state.tableColumnExtensions}/>
          <TableHeaderRow showSortingControls/>
          <TableSelection selectByRowClick showSelectionColumn={false} />
          <Toolbar />
          <SearchPanel />
          <PagingPanel pageSizes={pageSizes}/>
        </Grid>
      </Paper>
    </React.Fragment>);
  }
}
