const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Promise = require('bluebird');
const axios = require('axios');

const { calculateBaseHealth, calculateBaseStat, damageCalculation } = require('../game-logic.js');
const db = require('../database/db.js');
const bodyParser = require('body-parser');

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

const games = {};

const createPokemon = (pokemon) => {
  const { name, sprites } = pokemon; 
  const health = calculateBaseHealth(pokemon.stats[5].base_stat);
  const attack = calculateBaseStat(pokemon.stats[4].base_stat);
  const defense = calculateBaseStat(pokemon.stats[3].base_stat);
  const types = pokemon.types; 
  return {
    name,
    health,
    initialHealth: health,
    attack,
    defense,
    sprites,
    types
  }
}

const createPlayer = (player, number) => {
  const random = Math.ceil(Math.random() * 150); 
  return new Promise((resolve, reject) => {
    axios.get(`http://pokeapi.co/api/v2/pokemon/${random}`)
    .then(results => {
      const pokemon = createPokemon(results.data); 
      resolve({
        player: number,
        name: player.name,
        pokemon
      })
    })
    .catch(err => reject(err));  
  })
}


io.on('connection', (socket) => {

  // on join game, initialize game in games object if it does not exist
  socket.on('join game', (data) => {
    socket.join(data.gameid);
    if (!(data.gameid in games)) {
      createPlayer(data, 'player1')
      .then(player1 => {
        games[data.gameid] = {
          player1,
          player2: null,
          playerTurn: 'player1'
        }
        io.to(socket.id).emit('player', player1);
      })
      } else if (data.gameid in games && !games[data.gameid].player2) {
        createPlayer(data, 'player2')
        .then(player2 => {
          games[data.gameid].player2 = player2; 
          console.log('finished creating player 2');          
          io.to(socket.id).emit('player', player2);
          io.to(data.gameid).emit('ready', games[data.gameid]);
        })
      } else {
        io.to(socket.id).emit('gamefull', 'this game is full!');
      }
    })

  socket.on('chat message', (data) => {
    console.log('chat data:', data);
    io.to(data.gameid).emit('chat message', data)
  });

  socket.on('attack', (data) => {
    // find game to alter (gameid)
    const game = games[data.gameid];
    const player = game.playerTurn;
    const opponent = game.playerTurn === 'player1' ? 'player2' : 'player1'
    const turnResults = damageCalculation(game[player], game[opponent]);
    game[opponent].pokemon.health -= turnResults.damageToBeDone; 
    console.log(turnResults);
    io.to(data.gameid).emit('attack processed', {
      basicAttackDialog: [
        {
          command: `${game[player].pokemon.name} attacked!`
        },
        {
          command: turnResults.logStatement
        },
        {
          command: `${game[opponent].pokemon.name} lost ${turnResults.damageToBeDone} HP`
        }
      ]
    })
    if (game[opponent].pokemon.health <= 0) {
      io.to(data.gameid).emit('gameover', { name: game[player].name });
    } else {
      game.playerTurn = opponent;
      io.to(data.gameid).emit('turn move', games[data.gameid]);
    }
  })

});

app.post('/login', (req, resp) => {
  console.log('post request on /login');
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
  console.log('post request on /signup');
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
