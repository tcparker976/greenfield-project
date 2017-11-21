import React, { Component } from 'react';
import Pokemon from './Pokemon.jsx';
import PokemonStats from './PokemonStats.jsx';
import css from '../styles.css';

const GameView = (props) => {
  return (
    <div className={css.battleField}>
      <div className={css.pokeView}>
        <PokemonStats stats={props.opponent.pokemon} />
        <Pokemon sprite={props.opponent.pokemon.sprites.front_default}/>
      </div>
      <div className={css.pokeView}>
        <Pokemon sprite={props.pokemon.sprites.back_default} />
        <PokemonStats stats={props.pokemon} />
      </div>
    </div>
  )
}

export default GameView; 