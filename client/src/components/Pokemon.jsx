import React, { Component } from 'react';

const Pokemon = (props) => {
  return (
    <div>
      <img src={props.sprite} style={{minWidth: '250px'}} alt="pikachu" />
    </div>
  )
}

export default Pokemon;