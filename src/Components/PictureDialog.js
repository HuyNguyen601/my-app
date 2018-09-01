import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

class PictureDialog extends React.Component{

  render(){
    return(
      <Dialog aria-labelledby="simple-dialog-title" open={this.props.isOpen} >
        <DialogTitle id="simple-dialog-title"> Picture </DialogTitle>
        <img src={this.props.URL} alt="Click below to download file" />
        <a href={this.props.URL}> Download</a>
      </Dialog>
    );
  }
}

export default PictureDialog
