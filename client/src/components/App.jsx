import React, { Component } from 'react';
import io from 'socket.io-client';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messageArray: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        <h1>Hello Pokémon change</h1>
        <input type='text' onChange={this.handleChange} value={this.state.text} onKeyDown={this.handleSubmit}/>
      </div>
    )
  }

  componentDidMount() {
    var socket = io();
    socket.on('chat message', (message) => {
      this.setState({
        messageArray: this.state.messageArray.concat(message) // antipattern
      })
      console.log('Message Array:', this.state.messageArray);
    })
  }
}
