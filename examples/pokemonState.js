gameState = {
  players: [player1, player2], // required two players to start game
  spectators: [player3, player4, player5] // additional players can watch and chat
  gameOver: Boolean // set to false initially, true once pokemon has/have fainted
  activePlayerId: Number // id of active player
}

player1 = {
  id: Number
  name: String, // name of player
  pokemon: {...}, // pokemon object, defined below
}

pokemon = {
  moves: [move, move, move, move] // array of four move objects, defined below
  name: String, // name of Pokemon,
  level: Number || 25, // assume Pokemon is level 25
  initHealth: Number, // initial health for Pokemon, is constant
  currHealth: Number, // tracking based on damage Pokémon has taken
  baseAttack: Number // attack number
  afflictedBy: String || null, // future proofing for when pokemon has been frozen, poisoned, etc.
  defense: Number
}

move = {
  power: Number, // move power number
  effect: String, // future proof effect that attack creates
  accuracy: Number, // number that determines chance of move landing on opponent
  type: String // type of move
}
