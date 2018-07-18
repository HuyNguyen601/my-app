import React, {Component} from 'react';
import XLS from 'xlsx'
class ImportData extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) =>this.handleOnload(e);
    reader.readAsBinaryString(file);
  };

  handleOnload(event){
      const data = event.target.result;
      const workbook = XLS.read(data, {type: 'binary'});
      const sheet_name_list = workbook.SheetNames;
      sheet_name_list.forEach( function(y) {
        const exceljson = XLS.utils.sheet_to_json(workbook.Sheets[y]);
        this.props.onDataChange(exceljson);
      }, this);
  };


  render() {
    return (
      <form>
      <label htmlFor='excelFile'>
        Please choose an excel file.</label>
      <input type='file' id='excelFile' onChange={(e) => this.handleChange(e)}/>
    </form>);
  }
}

export default ImportData;
