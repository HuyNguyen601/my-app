import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import ImportData from './ImportData'
import {
  PagingState,
  IntegratedPaging,
  RowDetailState,
} from '@devexpress/dx-react-grid';
import {Grid, Table, TableHeaderRow, PagingPanel,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';

const RowDetail = ({ row }) => (
  <Grid rows={[row]} columns={[
      {
        name: 'RMA_DOA_No',
        title: 'RMA_No'
      }, {
        name: 'serial_no',
        title: 'Serial_No'
      }, {
        name: 'problem_description',
        title: 'Problem Description'
      }, {
        name: 'status',
        title: 'Status'
      },]}>
    <Table/>
    <TableHeaderRow/>
  </Grid>
);

export default class MyTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      columns: [
        {
          name: 'RMA_DOA_No',
          title: 'RMA_No'
        }, {
          name: 'serial_no',
          title: 'Serial_No'
        }, {
          name: 'model_name',
          title: 'Model Name'
        }, {
          name: 'issued_date',
          title: 'Issued'
        }, {
          name: 'problem_cause',
          title: 'Cause'
        }, {
          name: 'problem_description',
          title: 'Problem Description'
        }
      ],
      rows: [
        {
          'RMA_DOA_No': 'North America'
        }
      ]
    };
  }

  handleChange(data) {
    this.setState({rows: data});
  }

  render() {
    const {rows, columns} = this.state;

    return (<React.Fragment>
      <ImportData onDataChange={this.handleChange}/>
      <Paper>
        <Grid rows={rows} columns={columns}>
          <RowDetailState />
          <PagingState defaultCurrentPage={0} pageSize={10}/>
          <IntegratedPaging/>
          <Table/>
          <TableHeaderRow/>
          <TableRowDetail contentComponent = {RowDetail} />
          <PagingPanel/>
        </Grid>
      </Paper>
    </React.Fragment>);
  }
}
