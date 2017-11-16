import React, { Component } from 'react';
import io from 'socket.io-client';

import Player from './Player.jsx';

export default class PlayerContainer extends Component {
  constructor(props) {
    super(props);


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      text: ''
    }
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    if (e.keyCode === 13) {
      var socket = io();
      socket.emit('chat message', this.state.text);
      this.setState({
        text: ''
      });
    }
  }
  


  render() {
    return (       
      <div>
        <h1>I am a player</h1>
      </div>
    )
  }
}

