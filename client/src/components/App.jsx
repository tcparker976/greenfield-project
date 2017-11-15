import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Game from './Game.jsx';
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

  componentDidMount() {
    var socket = io();
    socket.on('chat message', (message) => {
      this.setState({
        messageArray: this.state.messageArray.concat(message) // antipattern
      })
      console.log('Message Array:', this.state.messageArray);
    })
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
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/game' component={Game} />
        </Switch>
      </div>
    )
  }
}
