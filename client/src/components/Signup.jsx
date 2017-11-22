import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import css from '../styles.css';
import axios from 'axios';

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      email: '',
      usernameUniqueError: true,
      emailUniqueError: false
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

    axios({
      method: 'post',
      url: '/',
      baseUrl: process.env.baseURL || 'http://localhost:3000',
    })
      .then(function(response) {
        console.log('AXIOS WORKED?')
      // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    });

    
    const username = this.state.username;
    const password = this.state.password;
    const email = this.state.email;
    axios({
      method: 'post',
      url: '/signup',
      baseUrl: process.env.baseURL || 'http://localhost:3000',
      data: { username, password, email }
    });
  }

  render() {
    let usernameField = null;
    let emailField = null;

    if (this.state.usernameUniqueError) {
      usernameField = <div className={css.fieldErrorWrapper}>
        <div className={css.fieldErrorText}>Username already exists</div>
        <input type="text" className={css.fieldErrorInput} placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}></input>
      </div>
    } else {
      usernameField = <input type="text" className={css.signInUpField} placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}></input>
    }

    if (this.state.emailUniqueError) {
      emailField = <div className={css.fieldErrorWrapper}>
        <div className={css.fieldErrorText}>Email has an account already</div>
        <input type="text" className={css.fieldErrorInput} placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}></input>
      </div>
    } else {
      emailField = <input type="text" className={css.signInUpField} placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}></input>
    }

    return (
      <div>
        <div className={css.navBar}>
          <div className={css.logo}>Chattermon</div>
          <div className={css.navBarLinksContainer}>
            <div className={css.navBarLink}><Link to={'/login'} className={css.navBarLinkA}>Log In</Link></div>
          </div>
        </div>

        <div className={css.contentSuperWrapper}>
          <div className={css.welcomeControlPannel}>
            <div className={css.welcomeMessage}>Sign Up</div>
            <div className={css.controlsContainer}>
              <div className={css.joinGameContainer}>
                {usernameField}
                <input type="password" className={css.signInUpField} placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}></input>
                {emailField}
                <button className={css.gameButton} onClick={this.handleSubimt}>Sign Up</button>
              </div>
              <div className={css.seperator}></div>
              <div className={css.altAuthText}>Have an account?</div>
              <Link to='/login' className={css.gameButtonLink}><button className={css.gameButton}>Log In</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
