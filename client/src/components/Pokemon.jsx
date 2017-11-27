import React from 'react';

const Pokemon = (props) => {
  return (
    <div>
      <img src={props.sprite} style={{minWidth: '200px'}} alt="pikachu" />
    </div>
  )
}

export default Pokemon;