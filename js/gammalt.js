TO:DO Add chests
TO:DO Add chance cards
TO:DO Add punish blocks

The property "owned_by" in the streets is now sometimes a string and other times a player object itself, maybe I should make a bank object?

This function can be used to access the individual properties of a street given it's position
E.g. if var playerPos = 15, you can do: getIndividualProperty(playerPos, "price").
The function will then return the price of the tile the player is standing on.


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

var movePlayer_1 = document.getElementById("movePlayer1");
var buyProperty_1 = document.getElementById("buyProperty1");
var landOnProperty_1 = document.getElementById("landOnProperty1");
var movePlayer_2 = document.getElementById("movePlayer2");
var buyProperty_2 = document.getElementById("buyProperty2");
var landOnProperty_2= document.getElementById("landOnProperty2");

// Extracts an array with the position of every normal street in the game, exlucding utilities, chests, etc.

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
});

landOnProperty_2.addEventListener("click", function() {
  landOnProperty(players.player_2, players.player_1);
});

function getLandingPrice(position) {
  var landingPrice = 0;
  var numHouses = getNumHouses(position);
  var rent = getIndividualProperty(position, "rent");
  var house_1 = getIndividualProperty(position, "house_1");
  var house_2 = getIndividualProperty(position, "house_2");
  var house_3 = getIndividualProperty(position, "house_3");
  var house_4 = getIndividualProperty(position, "house_4");
  var hotel = getIndividualProperty(position, "hotel");

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

function getNumHouses(position) {
  var numHouses = getIndividualProperty(position, "num_houses");
  return numHouses;
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


var nameCount = 0;
for(var i = 0; i < player.properties.length; i++) {
  if(propertyName == player.properties[i]) {
    nameCount += 1;
  }
}
