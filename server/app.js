const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PokeApi = require('pokeapi');
const api = PokeApi.v1();

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

io.on('connection', (socket) => {
  console.log('Connection Established');
  // console.log('Socket:', socket);
  socket.on('chat message', (message) => {
    console.log('Message posted:', message);
    io.emit('chat message', message);
  });
});

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

// app.listen(process.env.PORT || 3000)
// console.log('listening on port ' + (process.env.PORT || 3000));

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;
