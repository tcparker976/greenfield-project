const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const dist = path.join(__dirname, '/../client/dist');

app.use(express.static(dist));


if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPathdist
  }));
}

/*
=== GAME STATE === 

uniquegame1: {
  player1: {} --- { name, pokemon: { name, attack, health }}
  player2: {}
  spectators: [],
  playerTurn: player1 || player2
}

*/ 

const games = {}; 

const createPlayer = (player) => {
  return {
    name: player.name,
    pokemon: player.pokemon 
  }
}


io.on('connection', (socket) => {

  // on join game, initialize game in games object if it does not exist
  socket.on('join game', (data) => {
    socket.join(data.gameid); 
    if (!(data.gameid in games)) {
      games[data.gameid] = {
        player1: createPlayer(data),
        player2: null,
        playerTurn: 'player1'
        }
        io.to(socket.id).emit('player', 'player1'); 
      } else if (data.gameid in games && !games[data.gameid].player2) {
        games[data.gameid].player2 = createPlayer(data);
        io.to(socket.id).emit('player', 'player2');
        io.to(data.gameid).emit('ready', games[data.gameid]); 
      } else {
        io.to(socket.id).emit('gamefull', 'this game is full!');
      }
    })

  socket.on('chat message', (data) => {
    io.to(data.id).emit('chat message', data.text)
  });

  socket.on('attack', (data) => {
    console.log(data.pokemon.name + ' has attacked!');
    // find game to alter (gameid)
    const game = games[data.gameid];
    const player = game.playerTurn;
    const attackPower = game[player].pokemon.attack;
    const opponent = game.playerTurn === 'player1' ? 'player2' : 'player1'
    console.log(game);
    game[opponent].pokemon.health -= attackPower; 
    if (game[opponent].pokemon.health <= 0) {
      io.to(data.gameid).emit('gameover', { name: game[player].name });
    } else {
      game.playerTurn = opponent; 
      io.to(data.gameid).emit('turn move', games[data.gameid]); 
    }
  })

});


// a catch-all route for BrowserRouter - enables direct linking. 
app.get('/*', (req, res) => {
  res.sendFile(dist + '/index.html');
});


var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;
