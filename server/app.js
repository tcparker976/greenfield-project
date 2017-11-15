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

io.on('connection', (socket) => {
  console.log('Connection Established');
  // console.log('Socket:', socket);
  socket.on('chat message', (message) => {
    console.log('Message posted:', message);
    io.emit('chat message', message);
  });
});

// app.listen(process.env.PORT || 3000)
// console.log('listening on port ' + (process.env.PORT || 3000));

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});
