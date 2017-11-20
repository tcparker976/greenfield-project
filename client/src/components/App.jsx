import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Game from './Game.jsx';
import io from 'socket.io-client';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/game/:gameid' component={Game} />
      </Switch>
    </div>
  );
}

export default App;
