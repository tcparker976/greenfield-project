import React, { Component } from 'react';
import Pokemon from './Pokemon.jsx';
import PokemonStats from './PokemonStats.jsx';
import css from '../styles.css';

const GameView = (props) => {
  return (
    <div className={css.battleField}>
      <div className={css.pokeView}>
        <PokemonStats stats={props.opponent.pokemon} />
        <Pokemon sprite={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'}/>
      </div>
      <div className={css.pokeView}>
        <Pokemon sprite={'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png'} />
        <PokemonStats stats={props.pokemon} />
      </div>
    </div>
  )
}

export default GameView; 