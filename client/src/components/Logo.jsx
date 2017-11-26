import React from 'react';
import css from '../styles.css';

const Logo = (props) => {
  return (
    <div className={css.logoContainer}>
      <h2><span><img src={'https://art.ngfiles.com/images/386000/386577_stardoge_8-bit-pokeball.png?f1446737358'} style={{maxWidth: '50px'}} /></span>Chattermon</h2>
      <h4>Username v. Username</h4>
      <h4>Username's turn</h4>
    </div>
  )
}

export default Logo; 