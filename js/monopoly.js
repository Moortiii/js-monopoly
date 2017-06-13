//TO:DO Mortgage properties
//TO:DO Add community chests
//TO:DO Add chance cards
//TO:DO Add jail system

// This function is overtly complex and in essence does the exact same thing as buyUnsoldProperty()
// I have no idea why I decided to it this way, but I feel like there must be some reason why I spent
// ALl that time crafting it, which is why I've decided to keep it around for future reference.
// It Lets the user buy property and then marks it as sold and adds the user as the owner

// function buyPropertyOld(player, position) {
//   var targetProperty = returnProperty(position);
//   var propertyName = targetProperty.name;
//   var propertyPrice = targetProperty.price;
//
//   for(key in properties) {
//     for(var i = 0; i < properties[key].length; i++) {
//       if(properties[key][i].name == propertyName) {
//         if(player.cash >= propertyPrice && properties[key][i].sold != true) {
//           removeCash(player, propertyPrice);
//           player.properties.push(properties[key][i]);
//           properties[key][i].sold = true;
//           properties[key][i].owner = player;
//         }
//       }
//     }
//   }
// }

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

function buyUnsoldProperty(player, position) {
  var targetProperty = returnProperty(position);
  var propertyName = targetProperty.name;
  var propertyPrice = targetProperty.price;

  if(player.cash >= propertyPrice && targetProperty.sold != true) {
    removeCash(player, propertyPrice);
    player.properties.push(targetProperty);
    targetProperty.sold = true;
    targetProperty.owner = player;
  }
}

function mortgageProperty(player, position) {
  var targetProperty = returnProperty(position);
  var mortgagePrice = targetProperty.mortgage_value;

  if(targetProperty.owner == player && targetProperty.mortgaged != true) {
    addCash(player, mortgagePrice);
    targetProperty.mortgaged = true;
  }
}

function unMortgageProperty(player, position) {
  var targetProperty = returnProperty(position);
  var mortgagePrice = targetProperty.mortgage_value;

  if(targetProperty.owner == player && targetProperty.mortgaged == true) {
    removeCash(player, mortgagePrice);
    targetProperty.mortgaged = false;
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
  var targetProperty = returnProperty(player.position);
  if(player != owner && targetProperty.mortgaged != true) {
    var owner = targetProperty.owner;
    var price = getLandingPrice(player);
    removeCash(player, price);
    addCash(owner, price);
    console.log("You landed on: " + owner.name + "'s property");
    console.log("You pay: $" + price + " to stay there");
    console.log("You have: $" + player.cash + " left.");
  }
}

function drawChanceCard(player) {
  // Check if there are unused chance cards left
  function checkChanceCards() {
    var chanceCardArray = chanceCards.cards;
    // Check if there are any cards left that can be used
    var unusedCount = 0;
    for(var i = 0; i < chanceCardArray.length; i++) {
      if(chanceCardArray[i].used == false) {
        unusedCount += 1;
      }
    }
    // If there aren't any cards left to be use, shuffle the cards
    // We use <= in case we somehow accidentally manage to draw twice on a snake eyes roll
    if(unusedCount <= 0) {
      shuffleChanceCards();
    }
  }
  // Function to shuffle the chance cards
  function shuffleChanceCards() {
    for(var i = 0; i < chanceCards.cards.length; i++) {
      chanceCards.cards[i].used = false;
    }
  }
  // Grab a random chance card until you get one that is unused
  function getChanceCard() {
    var randomCardIndex = Math.floor(Math.random() * chanceCards.cards.length);
    var chanceCard = chanceCards.cards[randomCardIndex];
    if(chanceCard.used == true) {
      chanceCard = getChanceCard();
    }
    return chanceCard;
  }

  // Handle what happens when the user finally draws a chance card
  checkChanceCards();
  var position = player.position;
  var chanceCard = getChanceCard();
  if(position == 7 || position == 22 || position == 36) {
    console.log("You drew: " + chanceCard.name);
    console.log("Description: " + chanceCard.description);
    chanceCard.action(player);
    chanceCard.used = true;
  }
}

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

  var targetProperty = returnProperty(player.position);
  console.log("You are at street number: " + player.position);
  console.log("This street is named: " + targetProperty.name);
  var normalStreet = isNormalStreet(player.position);
  if(normalStreet == true) {
    var owner = targetProperty.owner;
    landOnProperty(player, owner);
  }
  payTax(player);
  drawChanceCard(player);
  // if(snakeEyes) {
  //   console.log("Snake eyes!");
  //   getNewPosition(player);
  // }
}

function payTax(player) {
  var superTax = returnProperty(38);
  var incomeTax = returnProperty(4);
  if(player.position == superTax.position) {
    removeCash(player, superTax.price)
    console.log("You pay $" + superTax.price + " in tax.");
  }
  else if(player.position == incomeTax.position) {
    removeCash(player, incomeTax.price);
    console.log("You pay $" + incomeTax.price + " in tax.");
  }
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
  console.log("You pass start, receive $200");
  addCash(player, 200);
}

// Receive $400 if you land on start
function landOnStart(player) {
  console.log("You land on start, receive $400");
  addCash(player, 400);
}

function generateStreetPositions() {
  var property = Object.values(properties);
  var streetPositions = [];
  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if (property[i][j]["house_1"]) {
        streetPositions.push(property[i][j].position);
      }
    }
  }
  return streetPositions;
}

function isNormalStreet(position) {
  var streets = generateStreetPositions();
  var count = 0;
  for(var i = 0; i < streets.length; i++) {
    if(streets[i] == position) {
      count += 1;
    }
  }
  return count > 0;
}

// The functions below are for testing purposes only
function buyAllStreets(player) {
  var streets = generateStreetPositions();
  for(var i = 0; i < streets.length; i++) {
    // Buy all the properties
    buyUnsoldProperty(player, streets[i]);
    buyUnsoldProperty(player, 12);
    buyUnsoldProperty(player, 28);

    // Buy three houses on all of them
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    mortgageProperty(player, streets[i]);
  }
}

function playGame() {
  buyAllStreets(players.player_1);
  getNewPosition(players.player_2);
}

playGame();
