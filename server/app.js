const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('../database/db.js');
const bodyParser = require('body-parser');
const PokeApi = require('pokeapi');
const api = PokeApi.v1();

const dist = path.join(__dirname, '/../client/dist');

app.use(bodyParser());
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
    console.log('chat data:', data);
    io.to(data.id).emit('chat message', data)
  });

  socket.on('attack', (data) => {
    // find game to alter (gameid)
    const game = games[data.gameid];
    const player = game.playerTurn;
    const attackPower = game[player].pokemon.attack;
    const opponent = game.playerTurn === 'player1' ? 'player2' : 'player1'
    game[opponent].pokemon.health -= attackPower;
    if (game[opponent].pokemon.health <= 0) {
      io.to(data.gameid).emit('gameover', { name: game[player].name });
    } else {
      game.playerTurn = opponent;
      io.to(data.gameid).emit('turn move', games[data.gameid]);
    }
  })

});

app.post('/login', (req, resp) => {
  console.log('get request on /login');
  const username = req.body.username;
  const password = req.body.password;
  console.log('username', username);
  console.log('password', password);
  db.Users
    .findOne({where: { username, password } })
    .then(user => {
      console.log('SERVER: /login found user =', user);
      // console.log('use')
      if (!user) {
        console.log("redirecting to signup");
        resp.writeHead(201, {'Content-Type': 'text/plain'});
        resp.end('Not Found');
      }
      
      else {
        console.log("redirecting to home");
        resp.redirect('/');
      }
    })
})

app.post('/signup', (req, resp) => {
  console.log('get request on /signup');
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  db.save(username, password, email)
    .then(newuser => {
      resp.writeHead(201, {'Content-Type': 'text/plain'});
      resp.end('User Created');
    })
    .catch(err => {
      throw new Error(err)
    });
  console.log(req.body);
})

// a catch-all route for BrowserRouter - enables direct linking to this point.
app.get('/*', (req, res) => {
  res.sendFile(dist + '/index.html');
});


// The following is an example case of using the pokeapi module
// REF: https://www.npmjs.com/package/pokeapi

// api.get('pokemon', 1).then(function(bulbasaur) {
//     console.log("Here's Bulbasaur:", bulbasaur);
//   api.get(bulbasaur.moves).then(function(moves) {
//       console.log("Full move list:" + moves);
//     })
// }, function(err) {
//     console.log('ERROR', err);
// });


var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;