import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      email: ''
    };
  
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
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

  handleEmailChange(e) {
    console.log('Email changed to', e.target.value);

    this.setState({
      email: e.target.value
    });
  }

  handleSubimt() {
    console.log('click\'d');
    axios.post('/signup'
    , {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    });
  }

  render() {
    return (
      <div>
        <h1>Signup Page</h1>

        <p>Username</p>
        <input type="text" value={this.state.username} 
        onChange={this.handleUsernameChange}/>

        <p>Password</p>
        <input type="password" value={this.state.password} 
        onChange={this.handlePasswordChange}/>

        <p>Email</p>
        <input type="text" value={this.state.email} 
        onChange={this.handleEmailChange}/>

        <br/>
        <button onClick={this.handleSubimt}>Signup</button>
      </div>
    )
  }
}