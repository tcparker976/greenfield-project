const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const dist = path.join(__dirname, '/../client/dist');

app.use(express.static(dist));

const games = []


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


// TODO - setup this flow 

// app.post('/create', (req, res) => {
//   // creates entry in database for new game
//   // -- then, grabs that games ID 
//   // -- then, use that game id, to generate a new socket connection
//   // -- at the same time, send that game id down to the client, to click as a link 
// })

io.on('connection', (socket) => {

  // var nsp = io.of('/my-namespace');
  // nsp.on('connection', function(socket){
  //   console.log('someone connected');
  // });
  // nsp.emit('hi', 'everyone!');
  // console.log('Socket:', socket);
  socket.on('newgame', (gameid) => {
    socket.join(gameid); 
  });
  socket.on('chat message', (obj) => {
    io.to(obj.id).emit('chat message', obj.text)
  });

});


// a catch-all route for BrowserRouter - enables direct linking to this point.
app.get('/*', (req, res) => {
  res.sendFile(dist + '/index.html');
});
// app.listen(process.env.PORT || 3000)
// console.log('listening on port ' + (process.env.PORT || 3000));

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});

module.exports = app;
