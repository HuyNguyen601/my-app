import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Label, Input, FormGroup, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};


class Navigation extends React.Component  {
  constructor(props){
    super(props);
    this.state = {
      modal: false
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick()
  {
    this.setState({
      modal: !this.state.modal
    });
  }


  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link to={routes.HOME}> Home </Link>
            </Typography>
            <Button color="inherit" onClick = {this.handleOnClick}>Login</Button>
          </Toolbar>
        </AppBar>
        <Modal isOpen={this.state.modal}>
          <ModalHeader toggle={this.handleOnClick}>Login</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Form>
                <Label for="e_mail">Email</Label>
                <Input id="e_mail" type="email" placeholder="abc@gmail.com" />
                <Label for="pass_word">Password</Label>
                <Input id="pass_word" type="password" placeholder="Password" />
              </Form>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Login</Button>{' '}
            <Button color="secondary" onClick={this.handleOnClick}>Cancel</Button>
          </ModalFooter>
        </Modal>

      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
