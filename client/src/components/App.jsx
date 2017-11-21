import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home.jsx';
import Game from './Game.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import io from 'socket.io-client';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/home' component={Home} />
        <Route path='/game/:gameid' component={Game} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
      </Switch>
    </div>
  );
}

export default App;
