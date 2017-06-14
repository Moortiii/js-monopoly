//TO:DO Add community chests
//TO:DO Add jail system
  //TO:DO RE: JAIL - Keep track of how many times the user has tried to get out of jail
  //TO:DO RE: JAIL - Make sure the user can get out of jail either by paying or using a card
  //TO:DO RE: JAIL - Jail the player if they roll snake eyes three times in a row. Maybe a turn system makes sense after all?

//TO:DO Make snake eyes function in a way that actually makes sense e.g. not pay twice..

// 14.06.2017 An overly complex function I created that in essence does the exact same thing as buyUnsoldProperty()
// which I created earlier today. I was sleep deprived when I created the other and am unsure why I decided to do it in
// such a complicated way. However, I feel like there must be some reason and that if I keep if for future reference
// I will most certainly end up thanking myself religiously later.

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

// Returns an array with the indices of all properties that aren't free parking, jail, start, community chest, taxes or chance cards.
function generateStreetPositions() {
  var property = Object.values(properties);
  var streetPositions = [];
  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if(property[i][j].type == ["Street"] || property[i][j].type == ["Utility"]  || property[i][j].type == ["Station"]) {
        streetPositions.push(property[i][j].position);
      }
    }
  }
  return streetPositions;
}

// TO:DO Ensure the player can roll again if they get snake eyes
function rollDice() {
  var dice_1 = rollSingleDice();
  var dice_2 = rollSingleDice();
  console.log("Dice 1: " + dice_1 + "\nDice 2: " + dice_2);
  var sum = dice_1 + dice_2;
  var snakeEyes = dice_1 == dice_2;
  var diceOutcome = [];
  diceOutcome.push(sum, snakeEyes);
  return diceOutcome;
}

// Used in utilities when you only roll a single dice
function rollSingleDice() {
  var dice = Math.floor((Math.random() * 6) + 1);
  return dice;
}

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

function passStart(player) {
  console.log("You pass start, receive $200");
  addCash(player, 200);
}

function landOnStart(player) {
  console.log("You land on start, receive $400");
  addCash(player, 400);
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

function buyUnsoldProperty(player, position) {
  var targetProperty = returnProperty(position);
  var propertyPrice = targetProperty.price;

  if(player.cash >= propertyPrice && targetProperty.sold != true) {
    switch(targetProperty.type) {
      case "Station":
        player.stations.push(targetProperty);
        break;
      case "Utility":
        player.utilities.push(targetProperty);
        break;
      case "Street":
        player.properties.push(targetProperty);
        break;
    }
  }
  targetProperty.owner = player;
  targetProperty.sold = true;
  removeCash(player, propertyPrice);
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

// Get the new position for player when they roll the dice
// This also handles distributing cash if they pass or land on start
// If they land on an owned property, they pay rent.

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
}

function mustPayToLand(position) {
  var properties = generateStreetPositions();
  var count = 0;
  for(var i = 0; i < properties.length; i++) {
    if(properties[i] == position) {
      count += 1;
    }
  }
  return count > 0;
}

function landOnProperty(player) {
  var targetProperty = returnProperty(player.position);
  var isPayableStreet = mustPayToLand(player.position);
  // Get the landing price when you land on a property
  function getLandingPrice() {
    var landingPrice;
    var targetProperty = returnProperty(player.position);
    var owner = targetProperty.owner;
    if(targetProperty.type == "Street") {
      var numHouses = targetProperty.num_houses;
      switch(numHouses) {
        case 0:
          landingPrice = targetProperty.rent;
          break;
        case 1:
          landingPrice = targetProperty.house_1;
          break;
        case 2:
          landingPrice = targetProperty.house_2;
          break;
        case 3:
          landingPrice = targetProperty.house_3;
          break;
        case 4:
          landingPrice = targetProperty.house_4;
          break;
        case 5:
          landingPrice = targetProperty.hotel;
          break;
        default:
          landingPrice = 0;
      }
    } else if(targetProperty.type == "Station") {
      var stationsOwned = owner.stations.length;
      switch(stationsOwned) {
        case 1:
          landingPrice = targetProperty.owns_1;
          break;
        case 2:
          landingPrice = targetProperty.owns_2;
          break;
        case 3:
          landingPrice = targetProperty.owns_3;
          break;
        case 4:
          landingPrice = targetProperty.owns_4;
          break;
        default:
          landingPrice = 0;
      }
    } else if(targetProperty.type == "Utility") {
      var utilitiesOwned = owner.utilities.length;
      var diceRoll = rollSingleDice();
      console.log("You rolled: ");
      switch(utilitiesOwned) {
        case 1:
          landingPrice = diceRoll * targetProperty.owns_1_multiplier;
          break;
        case 2:
          landingPrice = diceRoll * targetProperty.owns_2_multiplier;
          break;
        default:
          landingPrice = 0;
      }
    }
    return landingPrice;
  }

  if(isPayableStreet == true) {
    console.log("This street is named " + targetProperty.name);
    console.log("It is at position " + targetProperty.position);
    console.log("You own this property.")
    var owner = targetProperty.owner;
    if(player != owner) {
      if(targetProperty.mortgaged != true) {
        var price = getLandingPrice();
        removeCash(player, price);
        addCash(owner, price);
        console.log("This street is named " + targetProperty.name);
        console.log("You landed on " + owner.name + "'s property.");
        console.log("You pay: $" + price + " to stay there.");
        console.log("You have: $" + player.cash + " left.");
      }
    }
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

// TO:DO You currently play twice if you get snake-eyes :-)))
function movePlayer(player) {
  getNewPosition(player);
  //payTax(player);
  //drawChanceCard(player);
  landOnProperty(player);
}

// The functions below are for testing purposes only

function buyAllStreets(player) {
  var streets = generateStreetPositions();

  // Sort an array numerically
  // Can't belive this isn't a built in function in JavaScript
  function sortNumber(a,b) {
      return a - b;
  }
  streets.sort(sortNumber);
  for(var i = 0; i < streets.length; i++) {
    // Buy all the properties and a hotel on each
    buyUnsoldProperty(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
    buyHouse(player, streets[i]);
  }
}

function playGame() {
  buyAllStreets(players.player_1);
  movePlayer(players.player_2);
}

playGame();
