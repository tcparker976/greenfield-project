import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';

import axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      registered: undefined
    };
  
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubimt = this.handleSubimt.bind(this);
  }

  handleUsernameChange(e) {
    console.log('Username changed to', e.target.value);

    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e) {
    console.log('Password changed to', e.target.value);

    this.setState({
      password: e.target.value
    });
  }

  handleSubimt() {
    console.log('click\'d');
    axios
      .post('/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(resp => {
        if (resp.data.match('Not Found')) {
          console.log("user not found");
          this.setState({
            registered: false
          });
        } else {
          console.log("user found");
          this.setState({
            registered: true
          });
        }
      })
  }

  render() {
    if (this.state.registered === false) {
      return (
        <Redirect to="/signup"/>
      )
    } 
    else if (this.state.registered === true) {
      return (
        <Redirect to="/home"/>
      )
    }
    else {
      return (
        <div>
          <h1>Login Page</h1>

          <p>Username</p>
          <input type="text" value={this.state.username} 
          onChange={this.handleUsernameChange}/>

          <p>Password</p>
          <input type="password" value={this.state.password} 
          onChange={this.handlePasswordChange}/>

          <br/>
          <Link to='/signup'><span>Sign up</span></Link>
          <button onClick={this.handleSubimt}>Login</button>
        </div>
      )
    }
  }
}