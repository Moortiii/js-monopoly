// TO:DO Add chests
// TO:DO Add chance cards
// TO:DO Add punish blocks

// This function can be used to access the individual properties of a street given it's position
// E.g. if var playerPos = 15, you can do: getIndividualProperty(playerPos, "price").
// The function will then return the price of the tile the player is standing on.
function getIndividualProperty(position, thing_to_access) {
  this.thing_to_access = thing_to_access;
  this.targetPosition = position;
  var value = undefined;
  var property = Object.values(properties);

  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if (property[i][j].position == targetPosition) {
        value = property[i][j][thing_to_access];
      }
    }
  }
  return value;
}

// This function can be used to modify the individual properties of a street given it's position
// E.g. if var playerPos = 15, you can do: setIndividualProperty(playerPos, "owned_by", "Morten").
// The function will then modify the owner of the current street to be "Morten" instead of "Bank".
function setIndividualProperty(position, thing_to_access, new_value) {
  this.thing_to_access = thing_to_access;
  this.targetPosition = position;
  this.new_value = new_value;
  var property = Object.values(properties);

  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if (property[i][j].position == targetPosition) {
        property[i][j][thing_to_access] = new_value;
      }
    }
  }
}

// Generic function to create a new player with certain properties.
function Player(name, cash, position, properties) {
  this.name = name;
  this.cash = cash;
  this.position = position;
  this.properties = properties;
}

// Functions to create the properties, stations and utilites
function Property(name, position, rent, house_1, house_2, house_3, house_4, hotel, house_price, mortgage_value, num_houses, owned_by, price) {
  this.name = name;
  this.position = position;
  this.rent = rent;
  this.house_1 = house_1;
  this.house_2 = house_2;
  this.house_3 = house_3;
  this.house_4 = house_4;
  this.hotel = hotel;
  this.house_price = house_price;
  this.mortgage_value = mortgage_value;
  this.num_houses = num_houses;
  this.owned_by = owned_by;
  this.price = price;
}

function Station(name, position, owns_1, owns_2, owns_3, owns_4, mortgage_value, owned_by, price) {
  this.name = name;
  this.position = position;
  this.owns_1 = owns_1;
  this.owns_2 = owns_2;
  this.owns_3 = owns_3;
  this.owns_4 = owns_4;
  this.mortgage_value = mortgage_value;
  this.owned_by = owned_by;
  this.price = price;
}

function Utility(name, position, owns_1_multiplier, owns_2_multiplier, mortgage_value, owned_by, price) {
  this.name = name;
  this.position = position;
  this.owns_1_multiplier = owns_1_multiplier;
  this.owns_2_multiplier = owns_2_multiplier;
  this.mortgage_value = mortgage_value;
  this.owned_by = owned_by;
  this.price = price;
}

function Chest(name, description, location, action) {
  this.name = name;
  this.description = description;
  this.location = location;
}

function getPropertyOwner(position) {
  var propertyOwner = getIndividualProperty(position, "owned_by");
  return propertyOwner;
}

function getPropertyPrice(position) {
  var propertyPrice = getIndividualProperty(position, "price");
  return propertyPrice;
}

function getMortgageValue(position) {
  var mortgageValue = getIndividualProperty(position, "mortgage_value");
  return mortgageValue;
}

function getPropertyName(position) {
  var propertyName = getIndividualProperty(position, "name");
  return propertyName;
}

function getNumHouses(position) {
  var numHouses = getIndividualProperty(position, "num_houses");
  return numHouses;
}

function getLandingPrice(position) {
  var numHouses = getNumHouses(position);
  var rent = getIndividualProperty(position, "rent");
  var house_1 = getIndividualProperty(position, "house_1");
  var house_2 = getIndividualProperty(position, "house_2");
  var house_3 = getIndividualProperty(position, "house_3");
  var house_4 = getIndividualProperty(position, "house_4");
  var hotel = getIndividualProperty(position, "hotel");
  var landingPrice = 0;

  if(numHouses == 0) {
    landingPrice = rent;
  } else if(numHouses == 1) {
    landingPrice = house_1;
  } else if(numHouses == 2) {
    landingPrice = house_2;
  } else if(numHouses == 3) {
    landingPrice = house_3;
  } else if(numHouses == 4) {
    landingPrice = house_4;
  } else if(numHouses == 5) {
    landingPrice = hotel;
  }
  return landingPrice;
}

// Generic functions to add, remove or transfer cash from a player's hand
function removeCash(player, amount) {
  player.cash -= amount;
}

function getCash(player, amount) {
  player.cash += amount;
}

function transferCash(player1, player2, amount) {
  removeCash(player1, amount);
  getCash(player2, amount);
}

// Jail a player
function jailPlayer(player) {
  player.position = 10;
}

// Receive $200 if you pass start
function passStart(player) {
  getCash(player, 200);
}

// Receive $400 if you land on start
function landOnStart(player) {
  getCash(player, 400);
}

// Allows a player to buy the property they are currently standing on.
function buyProperty(player) {
  var propertyPrice = getPropertyPrice(player.position);
  var propertyName = getPropertyName(player.position);
  var propertyOwner = getPropertyOwner(player.position);
  // Allow purchase only if the property is buyable and currently owned by the bank.
  if (player.cash >= propertyPrice) {
    removeCash(player, propertyPrice);
    player.properties.push(propertyName);
    setIndividualProperty(player.position, "owned_by", player.name);
    console.log("The property is now owned by " + player.name);
  }
}

function mortgageProperty(player, propertyPosition) {
  this.player = player;
  this.propertyPosition = propertyPosition;
  var propertyOwner = getPropertyOwner(player.position);
  var mortgageValue = getPropertyValue(player.position);
  console.log(propertyOwner);
  if(propertyOwner == this.player.name) {
    getCash(this.player, mortgageValue);
    setIndividualProperty(this.propertyPosition, "mortgaged", true);
  }
}

// Move a given player
// NOTE_TO_SELF: This is currently broken.
function movePlayer(player) {
  var move_distance = rollDice();
  if (player.position + move_distance <= 40) {
    player.position += move_distance;
    if (player.position == 40) {
      landOnStart(player);
    }
  } else {
    passStart(player);
    player.position = move_distance;
  }

  var propertyPrice = getPropertyPrice(player.position);
  var propertyName = getPropertyName(player.position);
  var propertyOwner = getPropertyOwner(player.position);
  console.log("You are currently at position: " + player.position);
  console.log("The current streetname is: " + propertyName);
  console.log("The price for this property is: " + propertyPrice);
  console.log("It is currently owned by: " + propertyOwner);
}

function landOnProperty(player1, player2) {
  var propertyOwner = getPropertyOwner(player1.position);
  var landingPrice = getLandingPrice(player1.position);
  if(propertyOwner != player1.name) {
    transferCash(player1, player2, landingPrice);
  }
}

// TO:DO Ensure the player can roll again if they get snake eyes
function rollDice() {
  var sum;
  var dice_1 = Math.floor((Math.random() * 6) + 1);
  var dice_2 = Math.floor((Math.random() * 6) + 1);
  sum = dice_1 + dice_2;
  console.log("You rolled: " + sum);
  return sum;
}

// Create a player
var players = {
  player_1: new Player("Morten", 5000, 0, []),
  player_2: new Player("Kjetil", 3000, 0, [])
};

// Define each of the properties, stations and utilities explicitly.
var properties = {
  magenta: [
    new Property("Old Kent Road", 1, 2, 10, 30, 90, 160, 250, 30, 50, 0, "bank", 60),
    new Property("Whitechapel Road", 3, 4, 10, 30, 90, 160, 250, 30, 50, 0, "bank", 60)
  ],
  light_blue: [
    new Property("Angel Islington", 6, 6, 30, 90, 270, 400, 550, 50, 50, 0, "bank", 100),
    new Property("Euston Road", 8, 6, 30, 90, 270, 400, 550, 50, 50, 0, "bank", 100),
    new Property("Pentonville Road", 9, 8, 40, 100, 300, 450, 600, 50, 60, 0, "bank", 120)
  ],
  pink: [
    new Property("Pall Mall", 11, 10, 50, 150, 450, 625, 750, 100, 70, 0, "bank", 140),
    new Property("Whitehall", 13, 10, 50, 150, 450, 625, 750, 100, 70, 0, "bank", 140),
    new Property("Pall Mall", 14, 12, 60, 180, 500, 700, 900, 100, 80, 0, "bank", 160)
  ],
  orange: [
    new Property("Bow Street", 16, 14, 70, 200, 550, 750, 950, 100, 90, 0, "bank", 180),
    new Property("Marlborough Street", 18, 14, 70, 200, 550, 750, 950, 100, 90, 0, "bank", 180),
    new Property("Vine Street", 19, 16, 70, 200, 550, 750, 950, 100, 90, 0, "bank", 200)
  ],
  red: [
    new Property("Strand", 21, 18, 90, 250, 700, 875, 1050, 150, 110, 0, "bank", 220),
    new Property("Fleet Street", 23, 18, 90, 250, 700, 875, 1050, 150, 110, 0, "bank", 220),
    new Property("Trafalgar Square", 24, 20, 90, 250, 700, 875, 1050, 150, 110, 0, "bank", 240)
  ],
  yellow: [
    new Property("Leicester Square", 26, 22, 110, 330, 800, 975, 1150, 150, 150, 0, "bank", 260),
    new Property("Coventry Street", 27, 22, 110, 330, 800, 975, 1150, 150, 150, 0, "bank", 260),
    new Property("Picadilly", 29, 24, 120, 360, 850, 1025, 1200, 150, 150, 0, "bank", 280)
  ],
  green: [
    new Property("Regent Street", 31, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, "bank", 300),
    new Property("Oxford Street", 32, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, "bank", 300),
    new Property("Bond Street", 34, 28, 150, 450, 1000, 1200, 1400, 150, 200, 0, "bank", 320)
  ],
  dark_blue: [
    new Property("Park Lane", 37, 35, 175, 500, 1100, 1300, 1500, 200, 175, 0, "bank", 350),
    new Property("Mayfair", 39, 50, 200, 600, 1400, 1700, 2000, 200, 200, 0, "bank", 400)
  ],
  stations: [
    new Station("King's Cross Station", 5, 25, 50, 100, 200, 100, "bank", 200),
    new Station("Marylebone Station", 15, 25, 50, 100, 200, 100, "bank", 200),
    new Station("Fenchurch St. Station", 25, 25, 50, 100, 200, 100, "bank", 200),
    new Station("Liverpool Street Station", 35, 25, 50, 100, 200, 100, "bank", 200)
  ],
  utilities: [
    new Utility("Electric Company", 12, 4, 10, 75, "bank", 150),
    new Utility("Waterworks", 28, 4, 10, 75, "bank", 150),
  ]
};

var movePlayer_1 = document.getElementById("movePlayer1");
var buyProperty_1 = document.getElementById("buyProperty1");
var landOnProperty_1 = document.getElementById("landOnProperty1");
var movePlayer_2 = document.getElementById("movePlayer2");
var buyProperty_2 = document.getElementById("buyProperty2");
var landOnProperty_2= document.getElementById("landOnProperty2");


movePlayer_1.addEventListener("click", function() {
  movePlayer(players.player_1);
});

movePlayer_2.addEventListener("click", function() {
  movePlayer(players.player_2);
});

buyProperty_1.addEventListener("click", function() {
  buyProperty(players.player_1);
});

buyProperty_2.addEventListener("click", function() {
  buyProperty(players.player_2);
});

landOnProperty_1.addEventListener("click", function() {
  landOnProperty(players.player_1, players.player_2);
})

landOnProperty_2.addEventListener("click", function() {
  landOnProperty(players.player_2, players.player_1);
})
