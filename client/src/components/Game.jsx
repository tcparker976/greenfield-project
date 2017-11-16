import React, { Component } from 'react';
import io from 'socket.io-client';

import PlayerContainer from './PlayerContainer.jsx';

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageArray: [],
      playerArray: [],
      opponent: null, 
      spectators: [],
      activePlayerId: '',
      gameOver: false,
      text: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    var socket = io();
    socket.emit('newgame', this.props.match.params.gameid);
    socket.on('chat message', (message) => {
      console.log(message);
      this.setState(prevState => {
        return {
          messageArray: prevState.messageArray.concat(message)
        }
      })
    });
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    if (e.keyCode === 13) {
      var socket = io();
      socket.emit('chat message', {id: this.props.match.params.gameid, text: e.target.value});
      this.setState({
        text: ''
      });
    }
  }
  


  render() {
    const { players, spectators, gameOver } = this.state; 
    console.log(this.state.messageArray);
    return (
      <div>
        <h2>You are playing pokemon and chatting with someone, whoa!!!!</h2>
        <input type="text" value={this.state.text} onKeyDown={this.handleSubmit} onChange={this.handleChange} />
      </div>
    )
  }
}

