import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return (
    <div>
      <h1>Chattermon</h1>
      <Link to='/game'><button>Start new game</button></Link>
    </div>
  )
}

export default Home;