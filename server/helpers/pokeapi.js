const axios = require('axios');
const Promise = require('bluebird');
const db = '../../database/db.js';


//Use this function to fill up the database with any number of pokemon from the pokeapi
//Things to consider:
//  -More than 10 requests to the pokeapi with result in a 504 timeout error (per my experience).
//  -I filled the DB by manually calling this function, each time making only 10 requests (refactor to recursive or setTimeout).
//  -You should only need to fill up your DB with all the pokemon you plan to incorporate once. 
//  -The api is free to use but only 300 requests per resource per day are permitted e.g. bulbasaur can be requested 300 times per day.
const fetchFirst150Pokemon = (pokesExist, callback) => {  
  if(!pokesExist) {
    let arrayOfRequests = []
    //you WILL get a 504 error if you try and request a large chunk. I did increments of 10.
    for(let i = 1; i <= 10; i++) {
      arrayOfRequests.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}/`));
      console.log('A REQUEST WITH ID: ', i);
    }
    console.log('IN FETCH, FETCHING POKES!');
    Promise.all(arrayOfRequests)
      .then((arrOfPromises) => {
        arrOfPromises.forEach((promise) => {
          console.log('FETCHING POKEMON WITH ID: ', promise.data.id);
          let pokemonObj = {};
          pokemonObj.types = [];

          promise.data.types.forEach((typeObj) => {
            pokemonObj.types[typeObj.slot - 1] = typeObj.type.name
          });
          
          pokemonObj.name = promise.data.name;
          pokemonObj.id = promise.data.id;
          pokemonObj.baseHealth = promise.data.stats[5].base_stat;
          pokemonObj.baseAttack = promise.data.stats[4].base_stat;
          pokemonObj.baseDefense = promise.data.stats[3].base_stat;
          pokemonObj.backSprite = promise.data.sprites.back_default;
          pokemonObj.frontSprite = promise.data.sprites.front_default;
          console.log('POKEOBJ: ', pokemonObj);
          callback(pokemonObj);

        });
      })
      .catch((err) => {
        console.log('POKEMON FETCH ERROR: ', err);
      });  
  } else {
    console.log('IN FETCH, NOT FETCHING!');
  }    
}

module.exports = {
  fetchFirst150Pokemon: fetchFirst150Pokemon
}