import React, { Component } from 'react';
import css from '../styles.css';

const PokemonCard = (props) => {
  return (
    <div>
      <img src={props.sprites.front_default} alt="" />
    </div>
  )
}

export default PokemonCard;