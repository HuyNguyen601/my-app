import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {database} from '../firebase'

import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering
} from '@devexpress/dx-react-grid';
import {Grid, Table, TableHeaderRow, PagingPanel, Toolbar, SearchPanel
} from '@devexpress/dx-react-grid-material-ui';


export default class MyTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
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
          name: 'date',
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
          name: 'weight',
          title: 'Weight'
        },
        {
          name: 'amount',
          title: 'Amount'
        }
      ],
      rows: [
        {

        }
      ],
      searchValue: '',
      pageSizes: [10,20,30,50,100, 0]
    };
    this.changeRowValue = value => this.setState({rows: value});
    //database.initializeTable(this.changeRowValue);

    this.handleChange = this.handleChange.bind(this);
    this.changeSearchValue = value => this.setState({searchValue: value});
  }
  componentWillMount(){
    database.initializeTable(this.changeRowValue);
  }


  handleChange(data) {

      //Initialize database with initial data, remember to check if data.length >0 for xls read
      //database.initializeDatabase(data);
  }

  render() {
    const {rows, columns,searchValue, pageSizes} = this.state;

    return (<React.Fragment>
      <Paper>
        <Grid rows={rows} columns={columns}>
          <SearchState
            value={searchValue}
            onValueChange={this.changeSearchValue}
          />
          <PagingState defaultCurrentPage={0} pageSize={10}/>
          <IntegratedFiltering/>
          <IntegratedPaging/>
          <Table/>
          <TableHeaderRow/>
          <Toolbar />
          <SearchPanel />
          <PagingPanel pageSizes={pageSizes}/>
        </Grid>
      </Paper>
    </React.Fragment>);
  }
}
