import React, { Component } from 'react';
import io from 'socket.io-client';
import Chat from './Chat.jsx';
import PlayerContainer from './PlayerContainer.jsx';
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
    this.setState({
      chatInput: e.target.value
    });
  }

  handleChatInputSubmit(e) {
    if (e.keyCode === 13) {
      var socket = io();
      this.state.socket.emit('chat message', {id: this.props.match.params.gameid, name: this.state.name, text: e.target.value});
      this.setState({
        chatInput: ''
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
          })
        } else {
          alert('invalid input!')
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

  renderGame() {
    if (!this.state.opponent) {
      return (
        <div>
          <h1>Awaiting opponent...</h1>
        </div>
      )
    } else {
      const { name, initialHealth, health } = this.state.pokemon;
      const { opponent } = this.state;
      return (
        <div>
          <h1>Your pokemon</h1>
          <h4>{name}: {health}/{initialHealth} </h4>
          <h1 style={{marginTop: '50px'}}>{opponent.name}'s pokemon</h1>
          <h4>{opponent.pokemon.name}: {opponent.pokemon.health}/{opponent.pokemon.initialHealth} </h4>
        </div>
      )
    }
  }


  render() {
    const { players, spectators, gameOver } = this.state;
    return (
      <div className={css.gamePageContainer}>
        <div className={css.gameContainer}>
          <h2>You are playing pokemon and chatting with someone, whoa!!!!</h2>
          <h2>Terminal Command Bar</h2>
          <input type="text" value={this.state.command} onKeyDown={this.handleCommands} onChange={this.handleCommandChange} />
          {this.renderGame()}
        </div>
        <Chat messageArray={this.state.messageArray} chatInput={this.state.chatInput} handleChatInputSubmit={this.handleChatInputSubmit} handleChatInputChange={this.handleChatInputChange}></Chat>
      </div>
    )
  }
}


// import Chat from './Chat.jsx';
//
// const Game = (props) => {
//   return (
//     <div className="game-page-container">
//       <div className="game-container">
//         <h2>You are playing pokemon and chatting with someone, whoa!!!!</h2>
//       </div>
//       <Chat></Chat>
//     </div>
//   )
// }
