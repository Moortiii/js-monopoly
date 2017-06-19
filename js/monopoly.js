// 14.06.2017 An overly complex function I created eariler today that in essence does the exact same thing as buyUnsoldProperty().
// I was sleep deprived when I created it and am unsure why I decided to do it in such a complicated way. However, I feel like
// there must be some reasoning behind it and that if I keep if for future reference I will most certainly end up thanking myself later.

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

function isAllMortgaged(player) {
  var mortgagedCount = 0;
  var propertyCount = player.properties.length;
  for(var i = 0; i < propertyCount; i++) {
    var targetProperty = returnProperty(player.properties[i].position);
    if(targetProperty.mortgaged == true) {
      mortgagedCount += 1;
    }
  }
  console.log("Property count: " + propertyCount);
  console.log("Mortgage count: " + mortgagedCount);
  return mortgagedCount == propertyCount;
}

function declareBankrupcy(player) {
  //TO:DO Allow the player too choose what properties they want to sell
  // For every property the player has:
  var count = 0;
  while(count < player.properties.length) {
    // If their cash is below zero:
    if(player.cash < 0) {
      // First sell all houses on the property for cash
      var targetProperty = returnProperty(player.properties[count].position);
      var numHouses = targetProperty.num_houses;
      for(var i = 0; i < numHouses; i++) {
        sellHouse(player, targetProperty.position);
      }
      // If their cash is still below zero:
      if(player.cash < 0) {
      // Then mortgage the property for cash:
        mortgageProperty(player, targetProperty.position);
        console.log("You mortgage this property " + player.properties[count].name);
        count += 1;
      }
    }
    // Finally after going through every property
    // Check to make sure they've mortgaged them all
    var hasMortgagedAll = isAllMortgaged(player);
    // console.log(hasMortgagedAll);
    // If their cash is still below zero and all of them are mortgaged:
    if(player.cash < 0 && hasMortgagedAll == true) {
      // Transfer all of their properties to the bank
      for(var i = 0; i < player.properties.length; i++) {
        player.properties[i].owner = bank;
      }
      // Then finally inform everyone that they have declared bankrupcy
      console.log(player.name + " has declared bankrupcy. All his properties go to the bank.");
      // I could do players.remove(player) here, but that doesn't actually fully remove
      // the player from the players object, it just leaves their entry as undefined
      // Which gives me a whole new world of trouble when I try to loop over each player
      // In the event of a turn-based system.
    }
  }
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

function generateOnlyStreets() {
  var property = Object.values(properties);
  var streetPositions = [];
  for (var i = 0; i < Object.keys(properties).length; i++) {
    for (var j = 0; j < property[i].length; j++) {
      if(property[i][j].type == ["Street"]) {
        streetPositions.push(property[i][j].position);
      }
    }
  }
  return streetPositions;
}

// Used in utilities when you only roll a single dice
// 03:22 - Also comes in handy when you roll two dice
function rollSingleDice() {
  var dice = Math.floor((Math.random() * 6) + 1);
  return dice;
}

// TO:DO Ensure the player can roll again if they get snake eyes.
// The ability to see if they did so is there, just not sure how to use the information.
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
  player.position = 0;
  addCash(player, 400);
}

// This seems like an incredibly ineloquent way to do this but it works for now
function landOnFreeParking() {
  console.log("You land on free parking, nothing good (or bad) happens");
}

// This seems like an incredibly ineloquent way to do this but it works for now
function visitJail() {
  console.log("You're visiting jail. The gives you a grumpy look.");
}

// Allows the player to use their get out of jail free card if they have one.
function getOutOfJailFree(player) {
  if(player.jail_cards > 0) {
    player.jail_cards -= 1;
    player.jailed = false;
    completeActions(player);
  } else {
    console.log("You don't have any get out of jail free cards.");
  }
}

// This function checks if a player owns all streets of a given color
function checkOwnsEntireColor(player, position) {
  var targetProperty = returnProperty(position);
  var color = targetProperty.color;
  var streetCount = 0;
  var maxStreets = properties[color].length;
  // Check how many of a given street a player has
  for(var i = 0; i < properties[color].length; i++) {
    if(properties[color][i].owner == player) {
      streetCount += 1;
    }
  }
  return streetCount == maxStreets;
}

function buyHouse(player, position) {
  var targetProperty = returnProperty(position);
  var housePrice = targetProperty.house_price;
  var numHouses = targetProperty.num_houses;
  var owner = targetProperty.owner;
  var ownsAll = checkOwnsEntireColor(player, position);
  // I could in truth drop the == true, but I like to keep it there for clarity.
  if(ownsAll == true) {
    if(owner == player && player.cash >= housePrice) {
      if(numHouses < 5) {
        numHouses += 1;
        console.log(player.name + " buys a house on " + targetProperty.name);
        if(numHouses == 5) {
          console.log(player.name + " buys a hotel on " + targetProperty.name);
        } else {
          console.log(player.name + " has " + numHouses + " houses on " + targetProperty.name);
        }
      }
    }
  } else {
    console.log("Sorry, you don't own all properties of that street yet.");
  }
  targetProperty.num_houses = numHouses;
}

function sellHouse(player, position) {
  var targetProperty = returnProperty(position);
  var housePrice = targetProperty.house_price;
  var numHouses = targetProperty.num_houses;
  var owner = targetProperty.owner;
  if(owner == player) {
    if(numHouses > 0) {
      numHouses -= 1;
      addCash(player, housePrice/2);
      targetProperty.num_houses = numHouses;
      console.log("You sell a house on " + targetProperty.name);
      console.log("You have " + numHouses + " houses left on this street.");
    }
  }
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

function askToBuy() {
  var wantsToBuy = prompt("Do you want to buy this property?").toLowerCase();
  return wantsToBuy == "y" || wantsToBuy == "yes";

  //!IMPORTANT Return true for testing purposes, uncomment above code and remove this when finished
  // return true;
}

function buyUnsoldProperty(player, position) {
  var targetProperty = returnProperty(position);
  var propertyPrice = targetProperty.price;
  if(player.cash >= propertyPrice && targetProperty.owner == bank) {
    var wantsToBuy = askToBuy();
    if(wantsToBuy) {
      switch(targetProperty.type) {
        case "Station":
          player.stations.push(targetProperty);
          break;
        case "Utility":
          player.utilities.push(targetProperty);
          break;
        case "Street":
          player.properties.push(targetProperty);
          targetProperty.num_houses = 0;
          break;
        }
        targetProperty.owner = player;
        targetProperty.sold = true;
        removeCash(player, propertyPrice);
        console.log(player.name + " buys the property");
      } else {
      console.log(player.name + " chooses not to buy the property.");
    }
  }
}

function mortgageProperty(player, position) {
  var targetProperty = returnProperty(position);
  var mortgagePrice = targetProperty.mortgage_value;
  var numHouses = targetProperty.num_houses;
  console.log("Num houses: " + numHouses);
  if(targetProperty.owner == player && targetProperty.mortgaged != true) {
    if(numHouses > 0) {
      console.log("You have houses left on this property, you need to sell them first before you can mortgage it.");
    } else {
      addCash(player, mortgagePrice);
      targetProperty.mortgaged = true;
      console.log("You mortgage " + targetProperty.name);
    }
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

function goToJail(player) {
  player.position = 10;
  player.jailed = true;
  player.jailedRounds = 0;
  console.log("You're in jail");
}

// Corner Case Function: If the player has to be moved manually, make sure he/she still completes his actions as normal
function completeActions(player) {
  getNewPosition(player);
  landOnProperty(player, player.position);
  payTax(player);
  drawChanceOrChest(player);
  buyUnsoldProperty(player, player.position);
}

function jailCompleteActions(player) {
  landOnProperty(player, player.position);
  payTax(player);
  drawChanceOrChest(player);
  buyUnsoldProperty(player, player.position);
}

function jailRoll(player) {
  var triesAllowed = 3;
  var tryCount = 0;

  while(player.jailed == true && tryCount < 3) {
    console.log("You're in jail.");
    console.log("TryCount: " + tryCount);
    var diceRoll = rollDice();
    var diceSum = diceRoll[0];
    var snakeEyes = diceRoll[1];

    // Keep track of how many rounds a player has tried to get out of jail
    if(player.jailed == true && tryCount == 2) {
      player.jailedRounds += 1;
    }

    // If the player rolls snake eyes they get out of jail and move the distance rolled
    if(player.jailed == true && snakeEyes == true) {
      player.jailed = false;
      player.position += diceSum;
      console.log("You rolled snake eyes! You are no longer jailed and move forward");
      jailCompleteActions(player);
    } else {
      tryCount += 1;
    }

    // If the player is jailed for three rounds they are forced to pay out and move the diceSum
    if(player.jailed == true && player.jailedRounds == 2 && tryCount == 2) {
      player.jailed = false;
      removeCash(player, 50)
      player.position += diceSum;
      console.log("You failed to get out of jail in three tries, pay $50 and move forward");
      jailCompleteActions(player);
    }
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
  switch(newPosition) {
    case 40:
      landOnStart(player);
      break;
    case 30:
      goToJail(player);
      break;
    case 20:
      landOnFreeParking();
      break;
    case 10:
      visitJail();
      break;
  }

  //TO:DO Since I can't use logic inside a switch statement, consider if the entire thing should be an if-else chain for clarity.
  if(newPosition > 40) {
    var squaresLeft = 40 - currentPosition;
    player.position = -squaresLeft + moveDistance;
    passStart(player);
  } else {
    player.position = newPosition;
  }
  console.log("New position: " + player.position);
  return snakeEyes;
}

//TO:DO What does this one do??
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
      console.log("You rolled: " + diceRoll);
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
    var owner = targetProperty.owner;
    console.log("This street is named " + targetProperty.name);
    console.log("It is at position " + targetProperty.position);
    console.log("Owner: " + owner.name);
    if(owner == bank) {
      console.log("The bank currently owns this property");
      console.log("This property costs $" + targetProperty.price);
      buyUnsoldProperty(player, player.position);
    } else if(player == owner) {
      console.log("You own this property.")
    } else if(player != owner) {
      if(targetProperty.mortgaged != true) {
        var pos = player.position;
        // There should be a more eloquent way to do this, but since getNewPosition()
        // already return snake eyes I think this is the best approach.
        if(pos != 40 && pos != 30 && pos != 20 && pos != 10) {
          var price = getLandingPrice();
          removeCash(player, price);
          addCash(owner, price);
          console.log("You landed on " + owner.name + "'s property.");
          console.log("You pay: $" + price + " to stay there.");
          console.log("You have: $" + player.cash + " left.");
        }
      }
    }
  }
}

//TO:DO This is broken, always draws a card
function drawChanceOrChest(player) {
  var cardType;
  switch(player.position) {
    case 7:
    case 22:
    case 36:
      cardType = chanceCards;
      break;
    case 2:
    case 17:
    case 33:
      cardType = communityChests;
      break;
    default:
      cardType = blankCards;
  }

  // Shuffle any pile of cards given its card type
  function shuffleCardPile(cardType) {
    for(var i = 0; i < cardType.cards.length; i++) {
      cardType.cards[i].used = false;
    }
  }

  // Check if there are community chests left to be used
  function checkChanceCards(cardType_1) {
    var cardArray = cardType.cards;
    // Check if there are any cards left that can be used
    var cardUnusedCount = 0;
    for(var i = 0; i < cardType.cards.length; i++) {
      if(cardArray[i].used == false) {
        cardUnusedCount += 1;
      }
    }
    // If there aren't any cards left to be use, shuffle the cards
    // We use <= in case we somehow accidentally manage to draw twice on a snake eyes roll
    if(cardUnusedCount <= 0) {
      shuffleCardPile(cardType_1);
    }
  }

  // Grab a random chance card until you get one that is unused
  function getChanceCard() {
    var randomCardIndex = Math.floor(Math.random() * cardType.cards.length);
    var chanceCard = cardType.cards[randomCardIndex];
    if(chanceCard.used == true) {
      chanceCard = getChanceCard();
    }
    return chanceCard;
  }

  // Handle what happens when the user finally draws a chance card
  checkChanceCards(communityChests);
  checkChanceCards(chanceCards);
  var position = player.position;
  var chanceCard = getChanceCard();
  if(cardType == communityChests || cardType == chanceCards) {
    console.log("You drew: " + chanceCard.name);
    console.log("Description: " + chanceCard.description);
    chanceCard.action(player);
    chanceCard.used = true;
  }
}

function movePlayer(player) {
  console.log("It is " + player.name + "'s turn.");
  var snakeEyes;
  if(player.jailed != true) {
    snakeEyes = getNewPosition(player);
    payTax(player);
    drawChanceOrChest(player);
    landOnProperty(player);
    buyUnsoldProperty(player, player.position);
  } else {
    jailRoll(player);
  }
  if(snakeEyes == true) {
    console.log("You rolled snake eyes and get to roll again");
    movePlayer(player);
  }
}

// //The functions below are for testing purposes only
//
// function buyAllStreets(player) {
//   var streets = generateOnlyStreets();
//
//   // Sort an array numerically
//   // Can't belive this isn't a built in function in JavaScript
//   function sortNumber(a,b) {
//       return a - b;
//   }
//   streets.sort(sortNumber);
//   for(var i = 0; i < streets.length; i++) {
//     // Buy all the properties and a hotel on each
//     buyUnsoldProperty(player, streets[i]);
//   }
//   for(var i = 0; i < streets.length; i++) {
//     buyHouse(player, streets[i]);
//     buyHouse(player, streets[i]);
//     buyHouse(player, streets[i]);
//     buyHouse(player, streets[i]);
//     buyHouse(player, streets[i]);
//   }
//
//   players.player_2.cash = -50000;
// }
//
// function playGame() {
//   buyAllStreets(players.player_2);
// }
//
// playGame();

$(document).ready(function() {
  $("#move-player-1").on("click", function() {
    movePlayer(players.player_1);
    $("#move-player-2").prop("disabled", false);
    $("#move-player-1").prop("disabled", true);
  })
  $("#move-player-2").on("click", function() {
    movePlayer(players.player_2);
    $("#move-player-1").prop("disabled", false);
    $("#move-player-2").prop("disabled", true);
  })
});
