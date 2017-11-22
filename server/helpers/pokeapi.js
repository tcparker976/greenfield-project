const axios = require('axios');



const fetchFirst150Pokemon = (pokesExist, callback) => {  
  if(!pokesExist) {
    let arrayOfRequests = []
    for(let i = 1; i <= 1; i++) {
      arrayOfRequests.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}/`));
      console.log('A REQUEST WITH ID: ', i);
    }
    console.log('IN FETCH, FETCHING POKES!');
    axios.all(arrayOfRequests)
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