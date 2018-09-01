import React from 'react'
import {auth} from '../firebase'
import {Redirect} from 'react-router-dom'



class LoginPage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      error: {},
      email: '',
      password: ''
    }
    this.email = React.createRef();
    this.checkAuth = this.checkAuth.bind(this);
    this.changeAuth = this.changeAuth.bind(this);
  }

  changeAuth(){
    this.setState({loggedIn: true});
    this.props.auth();
  }


  checkAuth(e)
  {
    const {email, password} = this.state;
    if(email === '')
    {
      alert("Please enter your email!");
      return 0;
    }
    if(password === '')
    {
      alert("Please enter your password");
      return 0;
    }
    if(this.email.current.validity.valid || email === 'khoa')
    {
      e.preventDefault();
      const username = email === 'khoa' ? 'abc@gmail.com' : email;
      auth.checkAuthentication(username, password, this.changeAuth() ,function(error){
        this.setState({error: error});
      }.bind(this));
    }
  }

  render(){
    //const { from } = this.props.location.state || { from: { pathname: "/" } };
    const {email, password, error, loggedIn} = this.state;
    error.warning = '';
    if(error.code === 'auth/user-not-found')
      error.warning = "Please check your email/username";
    else if(error.code === 'auth/wrong-password')
      error.warning = "Wrong password, please try again";
    if(loggedIn === true){
      console.log('YES');
      return <Redirect to='/'/>
    }
    return(
    <div className = 'container-fluid'>
    <div className='row'><h1> Welcome! Please Login</h1></div>
    <div className='row'>
      <div className='card col-sm-6 mx-auto bg-success-outline'>
        <div className='card-header'>
          Login
        </div>
        <div className='card-body'>
          <p>{error.warning}</p>
          <form>
            <input ref={this.email} className='form-control' type='email' placeholder='Email' value={email} onChange={e => this.setState({email: e.target.value})} required/><br/>
            <input className='form-control' type='password' placeholder='Password' value={password} onChange={e => this.setState({password: e.target.value})} required autoComplete='on'/><br/>
            <button type='submit' className = 'btn btn-success' onClick={e=>this.checkAuth(e)}>Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>

    );
  }
}

export default LoginPage;
