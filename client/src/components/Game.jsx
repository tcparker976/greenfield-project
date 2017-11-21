import React, { Component } from 'react';
import io from 'socket.io-client';
import Chat from './Chat.jsx';
import Terminal from './Terminal.jsx';
import GameView from './GameView.jsx';
import css from '../styles.css';

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
        initialHealth: 80,
        health: 80,
        attack: 24
      },
      opponent: null,
      isActive: null,
      gameOver: false,
      chatInput: '',
      command: '',
      commandArray: [
        {
          speaker: 'System',
          command:`Let's get ready to battle!`
        },
        {
          speaker: 'System',
          command:`Or something`
        }
      ],
      socket: null,
    }

    this.handleChatInputChange = this.handleChatInputChange.bind(this);
    this.handleChatInputSubmit = this.handleChatInputSubmit.bind(this);
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
    const playerInitializer = {
      gameid: this.props.match.params.gameid,
      name,
      pokemon: this.state.pokemon
    }
    socket.emit('join game', playerInitializer);
    socket.on('gamefull', (message) => {
      console.log(message);
      // alert(message);
    })
    socket.on('chat message', (message) => {
      var messageInstance = {
        name: message.name,
        text: message.text
      }
      console.log(messageInstance);
      this.setState(prevState => {
        return {
          messageArray: prevState.messageArray.concat(messageInstance)
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
    socket.on('attack processed', (data) => {
      this.setState({
        commandArray: this.state.commandArray.concat(data.basicAttackDialog)
      });
    })
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
      if (!this.state.isActive) {
        alert('it is not your turn!')
      } else {
        if (e.target.value === 'attack') {
          this.state.socket.emit('attack', {
            gameid: this.props.match.params.gameid,
            name: this.state.name,
            pokemon: this.state.pokemon
          });
        } else {
          alert('invalid input!')
        }
        this.setState({
          command: ''
        });
      }
    }
  }

  renderGame() {
    if (!this.state.opponent) {
      return (
        <div>
          <h1>Awaiting opponent...</h1>
        </div>
      )
    } else {
      const { pokemon, opponent } = this.state;
      return <GameView opponent={opponent} pokemon={pokemon} />
    }
  }


  render() {
    const { players, spectators, gameOver } = this.state;
    return (
      <div className={css.gamePageContainer}>
        <div className={css.gameContainer}>
          {this.renderGame()}
          <Terminal commandArray={this.state.commandArray} commandInput={this.state.command} handleCommands={this.handleCommands} handleCommandChange={this.handleCommandChange} />
        </div>
        <Chat messageArray={this.state.messageArray} chatInput={this.state.chatInput} handleChatInputSubmit={this.handleChatInputSubmit} handleChatInputChange={this.handleChatInputChange} />
      </div>
    )
  }
}