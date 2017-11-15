import React, { Component } from 'react';
import io from 'socket.io-client';

export default class App extends Component {

  render() {
    return (
      <h1>Hello pokemon change</h1>
    )
  }

  componentDidMount() {
    var socket = io();
  }
}
