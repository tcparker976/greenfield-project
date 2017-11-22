import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import css from '../styles.css';

export default class Welcome extends Component {
  constructor(props) {
    super (props);
    this.state = {
      newGameId: '',
      roomInput: '',
    }
    this.handleRoomInputReturn = this.handleRoomInputReturn.bind(this);
    this.handleRoomInputChange = this.handleRoomInputChange.bind(this);
  }

  componentDidMount() {
    function makeGameId() {
      var newGameId = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      for (var i = 0; i < 5; i++)
        newGameId += possible.charAt(Math.floor(Math.random() * possible.length));
      return newGameId;
    }

    this.setState({
      newGameId: makeGameId()
    })
  }

  makeGameId() {
    var newGameId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      newGameRoomId += possible.charAt(Math.floor(Math.random() * possible.length));
    return newGameId;
  }

  handleRoomInputReturn(e) {
    if (e.keyCode === 13) {
      console.log('This should be sending you to the proper room, but I dont know how without Redirect, which I dont want to use as it elimates history');
      console.log('So use the button instead');
    }
  }

  handleRoomInputChange(e) {
    this.setState({
      roomInput: e.target.value.toUpperCase()
    });
  }

  render() {
    let joinGameButton = null
    if (this.state.roomInput.length) {
      joinGameButton = <button className={css.gameButton}><Link to={'game/' + this.state.roomInput} className={css.gameButtonLink}>Join Game</Link></button>
    } else {
      joinGameButton = <button className={css.gameButton} onClick={() => {alert('You need to enter a Room ID')}}>Join Game</button>
    }

    return (
      <div>
        <div className={css.navBar}>
          <div className={css.logo}>Chattermon</div>
          <div className={css.navBarLinksContainer}>
            <div className={css.navBarLink}><Link to={'/'} className={css.navBarLinkA}>Sample Link</Link></div>
            <div className={css.navBarLink}><Link to={'/'} className={css.navBarLinkA}>Logout</Link></div>
          </div>
        </div>
        <div className={css.contentSuperWrapper}>
          <div className={css.welcomeControlPannel}>
            <div className={css.welcomeMessage}>Welcome back James!</div>
            <div className={css.controlsContainer}>
              <button className={css.gameButton}><Link to={'game/' + this.state.newGameId} className={css.gameButtonLink}>New Game</Link></button>
              <div className={css.seperator}></div>
              <div className={css.joinGameContainer}>
                <input className={css.roomIdField} placeholder="Room ID" value={this.state.roomInput} onKeyDown={this.handleRoomInputReturn} onChange={this.handleRoomInputChange}></input>
                {joinGameButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
