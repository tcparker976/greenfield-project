import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Chat from './Chat.jsx';
import Terminal from './Terminal.jsx';
import GameView from './GameView.jsx';
import GameState from './GameState.jsx';
import Logo from './Logo.jsx';
import css from '../styles.css';

import help from './../../../utils/helpers.js'

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player1: false,
      player2: false,
      messageArray: [],
      name: null,
      pokemon: [],
      opponent: null,
      isActive: null,
      gameOver: false,
      chatInput: '',
      command: '',
      commandArray: [{command: `The game will begin shortly...type 'help' to learn how to play`}],
      socket: null
    }

    this.handleChatInputChange = this.handleChatInputChange.bind(this);
    this.handleChatInputSubmit = this.handleChatInputSubmit.bind(this);
    this.handleCommandChange = this.handleCommandChange.bind(this);
    this.handleCommands = this.handleCommands.bind(this);
  }

  socketHandlers() {
    return {
      handleChat: (message) => {
      var messageInstance = {
          name: message.name,
          text: message.text
        }
        this.setState(prevState => {
          return {
            messageArray: prevState.messageArray.concat(messageInstance)
          }
        })
      },
      playerInitialized: (data) => {
        this.setState({
          [data.player]: true,
          pokemon: data.pokemon
        });
      },
      handleReady: (data) => {
        if (this.state.player1) {
          this.setState({
            isActive: true,
            opponent: data.player2
          });
        } else {
          this.setState({
            isActive: false,
            opponent: data.player1
          });
        }
        this.setState({
          commandArray: [{command: 'Let the battle begin!'}]
        });
      },
      attackProcess: (data) => {
        this.setState(prevState => {
          return {
            commandArray: prevState.commandArray.concat(data.basicAttackDialog)
          }
        });
      },
      turnMove: (data) => {
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
      },

    }
  }

  componentDidMount() {
    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

  // it's just a little more readable during testing
    function makeHumanId() {
      var text = "";
      var names = ['chris-', 'david-', 'james-', 'thomas-', 'anthony-', 'fred-']
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 3; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return names[Math.floor(Math.random() * names.length)] + text;
    }

    const name = makeHumanId();
    var socket = io();
    this.setState({
      name,
      socket
    })
    const playerInit = {
      gameid: this.props.match.params.gameid,
      name,
      pokemon: this.state.pokemon
    }
    socket.emit('join game', playerInit);
    socket.on('gamefull', message => alert(message)); 
    socket.on('chat message', this.socketHandlers().handleChat); 
    socket.on('player', this.socketHandlers().playerInitialized); 
    socket.on('ready', this.socketHandlers().handleReady); 
    socket.on('attack processed', this.socketHandlers().attackProcess); 
    socket.on('turn move', this.socketHandlers().turnMove);
    socket.on('gameover', data => alert(data.name + ' wins!!')); 
  }

  handleChatInputChange(e) {
    // this if statement prevents the chat text area from expanding on submit (keyCode 13)
    if (e.target.value !== '\n') {
      this.setState({
        chatInput: e.target.value
      });
    }
  }

  handleChatInputSubmit(e) {
    if (e.keyCode === 13) {
      var socket = io();
      this.state.socket.emit('chat message', {gameid: this.props.match.params.gameid, name: this.state.name, text: e.target.value});
      this.setState({
        chatInput: ''
      });
    }
  }

  handleCommandChange(e) {
    // this if statement prevents the chat text area from expanding on submit (keyCode 13)
    if (e.target.value !== '\n') {
      this.setState({
        command: e.target.value
      });
    }
  }

  handleCommands(e) {
    if (e.keyCode === 13) {
      if (e.target.value === 'help') {
        this.setState(prevState => {
          return {
            commandArray: prevState.commandArray.concat(help),
            command: ''
          }
        });
      } else {
        if (!this.state.isActive) {
          alert('it is not your turn!')
        } else {
        if (e.target.value === 'attack') {
          this.state.socket.emit('attack', {
            gameid: this.props.match.params.gameid,
            name: this.state.name,
            pokemon: this.state.pokemon
          });
        } else if (e.target.value.split(' ')[0].toLowerCase() === "choose") {
          let swap = e.target.value.split(' ')[1];
          let isAvailable = false;
          let index;
          this.state.pokemon.forEach((poke, i) => {
            if (poke.name === swap) {
              isAvailable = true;
              index = i;
            }
          });
          if (isAvailable) {
            this.state.socket.emit('switch', {
              gameid: this.props.match.params.gameid,
              pokemon: this.state.pokemon,
              index
            })
          } else {
            alert('you dont have that pokemon!');
          }
        } else {
          alert('invalid input!')
        }
          this.setState({
            command: ''
          });
        }
      }
    }
  }

  renderGame() {
    if (!this.state.opponent) {
      return (
        <div className={css.loading}>
          <h1>Awaiting opponent...</h1>
        </div>
      )
    } else {
      const { pokemon, opponent } = this.state;
      return <GameView opponent={opponent} pokemon={pokemon} />
    }
  }

  renderSideBar() {
    return (
      <div className={css.stateContainer}>
        <Logo name={this.state.name} isActive={this.state.isActive} opponent={this.state.opponent} />
        <GameState pokemon={this.state.pokemon} />
        <Chat messageArray={this.state.messageArray} chatInput={this.state.chatInput} handleChatInputSubmit={this.handleChatInputSubmit} handleChatInputChange={this.handleChatInputChange} /> 
      </div>
    );
  }


  render() {
    const { players, spectators, gameOver, pokemon } = this.state;
    return (
      <div className={css.gamePageContainer}>
        <div className={css.gameContainer}>
          {this.renderGame()}
          <Terminal commandArray={this.state.commandArray} commandInput={this.state.command} handleCommands={this.handleCommands} handleCommandChange={this.handleCommandChange} />
        </div>
        {this.renderSideBar()}
      </div>
    )
  }
}

