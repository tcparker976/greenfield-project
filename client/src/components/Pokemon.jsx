import React, { Component } from 'react';

const Pokemon = (props) => {
  return (
    <div>
      <img src={props.sprite} style={{minWidth: '200px'}} alt="http://pokeapi.co/media/sprites/pokemon/back/413.png" />
    </div>
  )
}

export default Pokemon;