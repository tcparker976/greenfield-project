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
    return (


      <div>
        <div className={css.navBar}>
          <div className={css.logo}>Chattermon</div>
          <div className={css.navBarLinksContainer}>
            <Link to={'/login'} className={css.navBarLinkA}><div className={css.navBarLink}>Log In</div></Link>
          </div>
        </div>

        <div className={css.contentSuperWrapper}>
          <div className={css.welcomeControlPannel}>
            <div className={css.welcomeMessage}>Sign Up</div>
            <div className={css.controlsContainer}>
              <div className={css.joinGameContainer}>
                <input type="text" className={css.signInUpField} placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}></input>
                <input type="password" className={css.signInUpField} placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}></input>
                <input type="text" className={css.signInUpField} placeholder="Email" value={this.state.email} onChange={this.handleEmailChange}></input>
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
