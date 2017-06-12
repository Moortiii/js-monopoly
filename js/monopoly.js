// Returns a property object given an arbitrary position
function returnProperty(position) {
  var property = Object.values(properties);
  var propertyObject;
  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if (property[i][j].position == position) {
        propertyObject = property[i][j];
      }
    }
  }
  return propertyObject;
}

// This function is for testing purposes only
function buyAllStreets(player) {
  function generateStreetPositions() {
    var property = Object.values(properties);
    var streetPositions = [];
    for (var i = 0; i < Object.keys(properties).length; i++) {
      for (var j = 0; j < property[i].length; j++) {
        if (  property[i][j]["house_1"] != "") {
          streetPositions.push(property[i][j].position);
        }
      }
    }
    return streetPositions;
  }
  var streets = generateStreetPositions();
  for(var i = 0; i < streets.length; i++) {
    // Buy all the properties
    buyUnsoldProperty(player, streets[i]);

    // Buy three houses on all of them
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
  }
}

// Lets the user buy property and then marks it as sold and adds the user as the owner
function buyUnsoldProperty(player, position) {
  var targetProperty = returnProperty(position);
  var propertyName = targetProperty.name;
  var propertyPrice = targetProperty.price;

  for(key in properties) {
    for(var i = 0; i < properties[key].length; i++) {
      if(properties[key][i].name == propertyName) {
        if(player.cash >= propertyPrice && properties[key][i].sold != true) {
          removeCash(player, propertyPrice);
          player.properties.push(properties[key][i]);
          properties[key][i].sold = true;
          properties[key][i].owner = player;
        }
      }
    }
  }
}

function getLandingPrice(player) {
  var targetProperty = returnProperty(player.position);
  var rent = targetProperty.rent;
  var house_1 = targetProperty.house_1;
  var house_2 = targetProperty.house_2;
  var house_3 = targetProperty.house_3;
  var house_4 = targetProperty.house_4;
  var hotel = targetProperty.hotel;
  var numHouses = targetProperty.num_houses;
  console.log(numHouses);
  var landingPrice;

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

function landOnProperty(player, owner) {
  if(player != owner) {
    console.log("You landed on: " + owner.name + "'s property");
    var targetProperty = returnProperty(player.position);
    var owner = targetProperty.owner;
    var price = getLandingPrice(player);
    console.log("You pay : " + price + " to stay there");
    removeCash(player, price);
    addCash(owner, price);
  }

}

// Note-to-self: Make sure the player can't buy more than "5 houses" or 1 hotel.
function buyHouse(player, position) {
  var targetProperty = returnProperty(position);
  var housePrice = targetProperty.house_price;
  var numHouses = targetProperty.num_houses;
  var owner = targetProperty.owner;
  if(owner == player && player.cash >= housePrice) {
    if(numHouses < 5) {
      numHouses += 1;
    }
  }
  targetProperty.num_houses = numHouses;
}
// TO:DO Ensure the player can roll again if they get snake eyes
function rollDice() {
  var dice_1 = Math.floor((Math.random() * 6) + 1);
  var dice_2 = Math.floor((Math.random() * 6) + 1);
  console.log("1: " + dice_1 + "\n2: " + dice_2);
  var sum = dice_1 + dice_2;
  var snakeEyes = dice_1 == dice_2;
  var diceOutcome = [];
  diceOutcome.push(sum, snakeEyes);
  return diceOutcome;
}

// Get the new position for player when they roll the dice
// This also handles distributing cash if they pass or land on start
// If they land on an owned property, they pay rent.

// TO:DO You currently play twice if you get snake-eyes :-)))
function getNewPosition(player) {
  var diceRoll = rollDice();
  var moveDistance = diceRoll[0];
  var snakeEyes = diceRoll[1];

  var currentPosition = player.position;
  var newPosition = currentPosition + moveDistance;
  if(newPosition == 40) {
    player.position = 0;
    landOnStart(player);
  } else if(newPosition > 40) {
    var squaresLeft = 40 - currentPosition;
    player.position = -squaresLeft + moveDistance;
    passStart(player);
  } else {
    player.position = newPosition;
  }

  if(snakeEyes) {
    console.log("Snake eyes!");
    getNewPosition(player);
  }
  console.log("You are at position: " + player.position);

  var targetProperty = returnProperty(player.position);
  var owner = targetProperty.owner;
  landOnProperty(player, owner);
  return player.position;
}

// Generic functions to add, remove or transfer cash from a player's hand
function removeCash(player, amount) {
  player.cash -= amount;
}

function addCash(player, amount) {
  player.cash += amount;
}

function transferCash(player1, player2, amount) {
  removeCash(player1, amount);
  addCash(player2, amount);
}

// Receive $200 if you pass start
function passStart(player) {
  addCash(player, 200);
}

// Receive $400 if you land on start
function landOnStart(player) {
  addCash(player, 400);
}

function playGame() {
  buyAllStreets(players.player_1);
  getNewPosition(players.player_2);
}

playGame();
