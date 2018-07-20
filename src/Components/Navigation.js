import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';

import SignInModal from './SignInModal';

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
    }
   this.toggle = this.toggle.bind(this);
  }

  toggle(){
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
            <Button color="inherit" onClick={this.toggle}>Login</Button>
          </Toolbar>
        </AppBar>
        <SignInModal isOpen = {this.state.modal} toggle={this.toggle}/>

      </div>
    );
  }
}

export default withStyles(styles)(Navigation);
