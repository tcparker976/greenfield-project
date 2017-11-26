const TYPES = {
  normal: {
      SUPER_EFFECT: [],
      NOT_VERY_EFFECTIVE: ['steel', 'rock'],
      NOT_EFFECTIVE: ['ghost']
    },
  fighting: {
      SUPER_EFFECT: ['normal', 'rock', 'steel', 'ice', 'dark'],
      NOT_VERY_EFFECTIVE: ['flying', 'poison', 'bug', 'psychic', 'fairy'],
      NOT_EFFECTIVE: ['ghost']
    },
  flying: {
      SUPER_EFFECT: ['fighting', 'bug', 'grass'],
      NOT_VERY_EFFECTIVE: ['rock', 'steel', 'electric'],
      NOT_EFFECTIVE: []
    },
  poison: {
      SUPER_EFFECT: ['grass'],
      NOT_VERY_EFFECTIVE: ['poison', 'ground', 'rock', 'ghost'],
      NOT_EFFECTIVE: ['steel']
    },
  ground: {
      SUPER_EFFECT: ['poison', 'rock', 'steel', 'fire'],
      NOT_VERY_EFFECTIVE: ['bug', 'grass'],
      NOT_EFFECTIVE: ['flying']
    },
  rock: {
      SUPER_EFFECT: ['flying', 'bug', 'fire'],
      NOT_VERY_EFFECTIVE: ['fighting', 'ground', 'steel'],
      NOT_EFFECTIVE: ['fighting', 'ground']
    },
  bug: {
      SUPER_EFFECT: ['grass', 'psychic', 'dark'],
      NOT_VERY_EFFECTIVE: ['fighting', 'flying', 'poison', 'ghost', 'steel', 'fire', 'fairy'],
      NOT_EFFECTIVE: []
    },
  ghost: {
      SUPER_EFFECT: ['ghost', 'psychic'],
      NOT_VERY_EFFECTIVE: ['dark'],
      NOT_EFFECTIVE: ['normal']
    },
  steel: {
      SUPER_EFFECT: ['rock', 'ice', 'fairy'],
      NOT_VERY_EFFECTIVE: ['steel', 'fire', 'water', 'electric'],
      NOT_EFFECTIVE: []
    },
  fire: {
      SUPER_EFFECT: ['bug', 'steel', 'grass', 'ice'],
      NOT_VERY_EFFECTIVE: ['rock', 'fire', 'water', 'dragon'],
      NOT_EFFECTIVE: []
    },
  water: {
      SUPER_EFFECT: ['ground', 'rock', 'fire'],
      NOT_VERY_EFFECTIVE: ['water', 'grass', 'dragon'],
      NOT_EFFECTIVE: []
    },
  grass: {
      SUPER_EFFECT: ['ground', 'rock', 'water'],
      NOT_VERY_EFFECTIVE: ['flying', 'poison', 'bug', 'steel', 'fire', 'dragon'],
      NOT_EFFECTIVE: []
    },
  electric: {
      SUPER_EFFECT: ['flying', 'water'],
      NOT_VERY_EFFECTIVE: ['grass', 'electric', 'dragon'],
      NOT_EFFECTIVE: ['ground']
    },
  psychic: {
      SUPER_EFFECT: ['fighting', 'poison'],
      NOT_VERY_EFFECTIVE: ['steel', 'psychic'],
      NOT_EFFECTIVE: ['dark']
    },
  ice: {
      SUPER_EFFECT: ['flying', 'ground', 'grass', 'dragon'],
      NOT_VERY_EFFECTIVE: ['steel', 'fire', 'water', 'ice'],
      NOT_EFFECTIVE: []
    },
  dragon: {
      SUPER_EFFECT: ['steel'],
      NOT_VERY_EFFECTIVE: ['steel'],
      NOT_EFFECTIVE: ['fairy']
    },
  dark: {
      SUPER_EFFECT: ['ghost', 'psychic'],
      NOT_VERY_EFFECTIVE: ['fighting', 'dark', 'fairy'],
      NOT_EFFECTIVE: []
    },
  fairy: {
      SUPER_EFFECT: ['fighting'],
      NOT_VERY_EFFECTIVE: ['poison', 'steel', 'fire'],
      NOT_EFFECTIVE: []
    }
}




// Used to generate stats for pokemon

const findRandomIV = () => {
  return Math.floor(Math.random() * 16);
  // adds an element of randomness so that stats for the same pokemon species are not
  // always the same
}

// All pokemon will have stats as if there were level 25
// I've hard coded this into the formula and simplified the equations.

const calculateBaseHealth = (baseHP) => {
   return Math.round(((baseHP + findRandomIV()) / 2) + 35);
   // reference https://bulbapedia.bulbagarden.net/wiki/Individual_values 
}

const calculateBaseStat = (baseStat) => {
  return Math.round(((baseStat + findRandomIV()) / 2) + 5);
  // reference https://bulbapedia.bulbagarden.net/wiki/Individual_values 
}

// Modifiers EXPLAINED: https://bulbapedia.bulbagarden.net/wiki/Damage
// STAB - same-type attack bonus, equal to 1.5 if user's type and move type match.
// Type - either 0, 0.25, 0.5, 1, 2 or 4 depending on opposing pokemon's type.
// Burn - either 0.5 or 1 depending on if the pokemon is burned.
// Critical - 6.25% chance to do 1.5x damage.
// Weather - different move types do more damage depending on weather state
const criticalChance = () => {
  let chance = Math.random() * 100
  if (chance <= 6.25) {
    return 1.5;
  } else {
    return 1;
  }
}

const modifierCalculation = (attackerTypes, moveType, opponentTypes) => {
  //pokemon can have at most two types
  let STAB = 1;
  let Type = 1;
  // let Burn = 1;  extra complexity we can add after MVP
  // let Weather = 1; extra EXTRA complexity, possibly after MVP
  let Critical = criticalChance();
  let logStatement = '';

  if (Critical > 1) {
    logStatement += 'A critical hit! '
  }

  if (attackerTypes.indexOf(moveType) !== -1) {
    STAB = 1.5; 
  }

  for (let i = 0; i < opponentTypes.length; i++) {
    if (TYPES[moveType].SUPER_EFFECT.indexOf(opponentTypes[i]) !== -1) {
      Type = 2;
      logStatement += 'It\'s super effective!';
      break;
    }
  
    if (TYPES[moveType].NOT_VERY_EFFECTIVE.indexOf(opponentTypes[i]) !== -1) {
      Type = 0.5;
      logStatement += 'It\'s not very effective...'
      break;
    }
  
    if(TYPES[moveType].NOT_EFFECTIVE.indexOf(opponentTypes[i]) !== -1) {
      Type = 0
      logStatement += 'It had no effect.'
      break; 
    }
  }

  return {
    modifierDamage: STAB * Type * Critical,
    logStatement
  }
}

// again, hardcoding level 25
// reference: https://bulbapedia.bulbagarden.net/wiki/Damage 
const damageCalculation = (activePlayer, opponent) => {
  
  const attackerTypes = activePlayer.pokemon[0].types; 
  let moveType; 
  attackerTypes.forEach(type => {
    if (type.slot == 1) {
      moveType = type.type.name 
    }
  }); 
  const opponentTypes = opponent.pokemon[0].types.map(type => type.type.name);
  let modifier = modifierCalculation(attackerTypes, moveType, opponentTypes) 

  const userAttackStat = activePlayer.pokemon[0].attack; 
  const opponentDefenseStat = opponent.pokemon[0].defense;
  return {
    damageToBeDone: Math.round((((12 * 60 * (userAttackStat / opponentDefenseStat)) / 50) + 2) * modifier.modifierDamage),
    logStatement: modifier.logStatement
  };
  
}


module.exports = {
  calculateBaseHealth, 
  calculateBaseStat,
  damageCalculation
}

