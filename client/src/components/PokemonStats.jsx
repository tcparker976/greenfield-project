import React, { Component } from 'react';
import css from '../styles.css';

const PokemonStats = (props) => {
  console.log(props);
  return (
    <div className={css.stats}>
      <h2>{props.stats.name.charAt(0).toUpperCase() + props.stats.name.slice(1)}</h2>
      <h5>{props.stats.health} / {props.stats.initialHealth}</h5>
    </div>
  )
}

export default PokemonStats; 