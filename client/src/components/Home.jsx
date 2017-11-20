import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  // TODO: Creates a new game instance, with a new id, appends to DB, and sends it back. 
  return (
    <div>
      <h1>Chattermon</h1>
      <Link to='/game/blah'><button>Start new game</button></Link>
    </div>
  )
}

export default Home;