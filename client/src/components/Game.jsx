import React, { Component } from 'react';
import io from 'socket.io-client';

import PlayerContainer from './PlayerContainer.jsx';

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player1: false,
      player2: false,
      messageArray: [],
      name: null,
      pokemon: {
        name: 'pikachu',
        health: 80,
        attack: 24
      },      
      opponent: null, 
      isActive: null,
      gameOver: false,
      text: '',
      command: '',
      socket: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommandChange = this.handleCommandChange.bind(this);
    this.handleCommands = this.handleCommands.bind(this);    
  }

  componentDidMount() {
    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
      return text;
    }
    const name = makeid();
    var socket = io();
    this.setState({
      name,
      socket
    })
    const playerInitializer = {
      gameid: this.props.match.params.gameid,
      name,
      pokemon: this.state.pokemon
    }
    socket.emit('join game', playerInitializer);
    socket.on('gamefull', (message) => {
      alert(message); 
    })
    socket.on('chat message', (message) => {
      console.log(message);
      this.setState(prevState => {
        return {
          messageArray: prevState.messageArray.concat(message)
        }
      })
    });
    socket.on('player', (data) => {
      this.setState({
        [data]: true
      })
    });
    socket.on('ready', (data) => {
      if (this.state.player1) {
        this.setState({
          isActive: true,
          opponent: data.player2
        })
      } else {
        this.setState({
          isActive: false,
          opponent: data.player1
        })
      }
    });
    socket.on('turn move', (data) => {    
      if (this.state.player1) {
        this.setState(prevState => {
          return {
            pokemon: data.player1.pokemon,
            opponent: data.player2,
            isActive: !prevState.isActive
          }
        });
      } else {
        this.setState(prevState => {
          return {
          pokemon: data.player2.pokemon,
          opponent: data.player1,
          isActive: !prevState.isActive
          }
        })
      }
    }); 
    socket.on('gameover', (data) => {
      alert(data.name + ' wins!!');
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
      this.state.socket.emit('chat message', {id: this.props.match.params.gameid, text: e.target.value});
      this.setState({
        text: ''
      });
    }
  }

  handleCommands(e) {
    if (e.keyCode === 13) {
      if (!this.state.isActive) {
        console.log('it is not your turn!')
      } else {
        console.log('Your pokemon: ', this.state.pokemon);
        console.log('Opponent pokemon ', this.state.opponent.pokemon);
        if (e.target.value === 'attack') {
          this.state.socket.emit('attack', {
            gameid: this.props.match.params.gameid,
            name: this.state.name,
            pokemon: this.state.pokemon
          })
        } else {
          console.log('invalid input!')
        }
        this.setState({
          command: ''
        });
      }
    }
  }

  handleCommandChange(e) {
    this.setState({
      command: e.target.value
    });
  }


  render() {
    const { players, spectators, gameOver } = this.state; 
    return (
      <div>
        <h2>You are playing pokemon and chatting with someone, whoa!!!!</h2>
        <input type="text" value={this.state.text} onKeyDown={this.handleSubmit} onChange={this.handleChange} />
        <h2>Terminal Command Bar</h2>
        <input type="text" value={this.state.command} onKeyDown={this.handleCommands} onChange={this.handleCommandChange} />
      </div>
    )
  }
}

