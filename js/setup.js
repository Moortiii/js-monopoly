/* - - - Constructor Functions - - - */

function Player(name, cash, position, properties, stations, utilities, has_turned, jail_cards) {
  this.name = name;
  this.cash = cash;
  this.position = position;
  this.properties = properties;
  this.stations = stations;
  this.utilities = utilities;
  this.has_turned = has_turned;
  this.jail_cards = jail_cards;
}

function Bank(name, cash, properties, utilities, stations) {
  this.name = name;
  this.cash = cash;
  this.properties = properties;
  this.utilities = utilities;
  this.stations = stations;
}

function Tax(name, price, position) {
  this.name = name;
  this.price = price;
  this.position = position;
}

function ChanceProperty(name, position) {
  this.name = name;
  this.position = position;
}

function ChestProperty(name, position) {
  this.name = name;
  this.position = position;
}

function Property(name, position, rent, house_1, house_2, house_3, house_4, hotel, house_price, mortgage_value, num_houses, price, type, owner, color) {
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
  this.price = price;
  this.type = type;
  this.owner = owner;
  this.color = color;
}

function Station(name, position, owns_1, owns_2, owns_3, owns_4, mortgage_value, price, type, owner) {
  this.name = name;
  this.position = position;
  this.owns_1 = owns_1;
  this.owns_2 = owns_2;
  this.owns_3 = owns_3;
  this.owns_4 = owns_4;
  this.mortgage_value = mortgage_value;
  this.price = price;
  this.type = type;
  this.owner = owner;
}

function Utility(name, position, owns_1_multiplier, owns_2_multiplier, mortgage_value, price, type, owner) {
  this.name = name;
  this.position = position;
  this.owns_1_multiplier = owns_1_multiplier;
  this.owns_2_multiplier = owns_2_multiplier;
  this.mortgage_value = mortgage_value;
  this.price = price;
  this.type = type;
  this.owner = owner;
}

// Not sure if this function is neccessary, time will show
function FreeParking(name, position, price) {
  this.name = name;
  this.position = position;
  this.price = price;
}

function Jail(name, position, price, action) {
  this.name = name;
  this.position = position;
  this.price = price;
  this.action = action;
}

function ChanceCard(name, description, action) {
  this.name = name;
  this.description = description;
  this.action = action;
}

function CommunityChest(name, description, action) {
  this.name = name;
  this.description = description;
  this.action = action;
}

function BlankCard(name, description, action) {
  this.name = name;
  this.description = description;
  this.action = action;
}

/* - - - Community Chest and Chance Card Functions - - - */

function chanceMoveToProperty(propertyPosition, player) {
  var targetProperty = returnProperty(propertyPosition);
  if(player.position > targetProperty.position) {
    passStart(player);
  }
  player.position = targetProperty.position;
}

function chanceMoveUtility(player) {
  var position = player.position;
  var targetProperty;
  if(position < 22) {
    targetProperty = returnProperty(28);
  } else {
    targetProperty = returnProperty(12);
  }
  var propertyOwner = targetProperty.owner;
  if(propertyOwner != player && propertyOwner != bank) {
    var dice = Math.floor((Math.random() * 6) + 1);
    var amountToPay = dice * 10;
    removeCash(player, amountToPay);
    addCash(propertyOwner, amountToPay);
    console.log("You rolled: " + dice);
    console.log("You pay " + propertyOwner.name + " $" + amountToPay);
  }
}

// Allows you to collect an arbitrary amount of cash from an arbitrary amount of players
function collectSum(player, amount) {
  var you = player;
  var sum = 0;
  for(person in players) {
    if(players[person] != you) {
      sum += 50;
      removeCash(players[person], amount);
      addCash(you, amount);
    }
  }
  console.log("Sum " + sum);
}

// Function to handle the property repair communityChest or chanceCard
function propertyRepairs(player, pricePerHouse, pricePerHotel) {
  this.pricePerHouse = pricePerHouse;
  this.pricePerHotel = pricePerHotel;
  var numberOfHouses = 0;
  var numberOfHotels = 0;
  var houseSum = 0;
  var hotelSum = 0;
  for(var i = 0; i < player.properties.length; i++) {
    var numHouses = player.properties[i].num_houses;
    // This may seem strange, but for simplicitys sake, 1 hotel is just a property with 5 houses
    if(numHouses < 5) {
      numberOfHouses += numHouses;
    } else {
      numberOfHotels += 1;
    }
  }
  houseSum = numberOfHouses * pricePerHouse;
  hotelSum = numberOfHotels * pricePerHotel;
  console.log("House sum: " + houseSum);
  console.log("Hotel sum: " + hotelSum);
  removeCash(player, houseSum);
  removeCash(player, hotelSum);
}

// Create the players for the game
var players = {
  player_1: new Player("Morten", 500000, 0, [], [], [], false, 0),
  player_2: new Player("Kjetil", 50000, 0, [], [], [], false, 0)
};

var bank = new Bank("bank", 500000, [], [], []);

// Create blank cards
var blankCards = {
  cards: [
    new BlankCard("Blank Card", "This is a blank card used to make drawChanceOrChest function", function(player) {
      // Nothing happens
    })
  ]
}
// Create the community chests
var communityChests = {
  cards: [
    new CommunityChest("Head Start", "Advance to start and collect $400", function(player) {
      landOnStart(player);
    }),
    new CommunityChest("Lousy Banker", "Bank error in your favor, collect $200", function(player) {
      addCash(player, 200);
    }),
    new CommunityChest("An apple a day", "You crash your bike and have to get checked out at the hospital. Pay $50 in medical fees", function(player) {
      removeCash(player, 50);
    }),
    new CommunityChest("Investment Banker", "Your stocks rise and you sell on a high, collect $300", function(player) {
      addCash(player, 300);
    }),
    new CommunityChest("Shawshank Redemption", "Get out of jail free. This card can be kept until needed or traded with other players", function(player) {
      player.jail_cards += 1;
    }),
    new CommunityChest("Not so smooth criminal", "Go directly to jail. Do not pass start or collect $200", function(player) {
      goToJail(player);
    }),
    new CommunityChest("Sharing is caring", "Collect $50 from all other players for opening tickets to tonight's game", function(player) {
      collectSum(player, 50);
    }),
    new CommunityChest("Boxing Day!", "You empty your Holiday Fund for the upcoming celebration, collect $100", function(player) {
      addCash(player, 100);
    }),
    new CommunityChest("Are you 60 yet?", "It's your birthday! Collect $10 from each player", function(player) {
      collectSum(player, 10);
    }),
    new CommunityChest("Set for life", "Life insurance matters, collect $100", function(player) {
      addCash(player, 100);
    }),
    new CommunityChest("That's sick", "Pay hospital fees of $100", function(player) {
      removeCash(player, 100);
    }),
    new CommunityChest("You're still not in Norway", "Pay $150 in school fees for next semester's books", function(player) {
      removeCash(player, 150);
    }),
    new CommunityChest("Live to serve", "You serve as a consultant for a client, receive $25", function(player) {
      addCash(player, 25);
    }),
    new CommunityChest("Beautiful, but not gorgeus", "You come second place in a beauty competetion, collect $10", function(player) {
      addCash(player, 10);
    }),
    new CommunityChest("Bob's your uncle", "Your uncle in America sends you a check, receive $100", function(player) {
      addCash(player, 100);
    }),
    new CommunityChest("I'd rather just move", "Your streets are being repaired. Pay $40 per house and $115 per hotel on all your properties", function(player) {
      propertyRepairs(player, 40, 115);
    })
  ]
};

// Create the chance cards
var chanceCards = {
  cards: [
    new ChanceCard("Up-up and away we go", "Advance to start and collect $400", function(player) {
      landOnStart(player);
    }),
    new ChanceCard("The girl with the matches", "Your houses and hotels are burning. Pay $40 per house and $115 per hotel on all your properties in damage costs", function(player) {
      propertyRepairs(player, 40, 115);
    }),
    new ChanceCard("Moving on..", "Advance to Trafalgar Square. - If you pass start, collect $200", function(player) {
      chanceMoveToProperty(24, player);
    }),
    new ChanceCard("Moving on..", "Advance to Northumberland Road. - If you pass start, collect $200", function(player) {
      chanceMoveToProperty(14, player);
    }),
    new ChanceCard("Pedal to the metal", "Take a trip to Marylebone Station. - If you pass start, collect $200", function(player) {
      chanceMoveToProperty(15, player);
    }),
    new ChanceCard("Locked up", "Go directly to jail. Do not pass start or collect $200", function(player) {
      goToJail(player);
    }),
    new ChanceCard("Sweet Freedom", "Get out of jail free. Use this card to get out of jail at any time. This card can be stored for later or traded to other players", function(player) {
      player.jail_cards += 1;
    }),
    new ChanceCard("Hold up!", "Go back three spaces", function(player) {
      player.position -= 3;
      completeActions(player);
    }),
    new ChanceCard("You're not in Norway", "Pay $150 in school fees", function(player) {
      removeCash(player, 150);
    }),
    new ChanceCard("Not so fast", "You receive a speeding ticked, pay $15", function(player) {
      removeCash(player, 15);
    }),
    new ChanceCard("Too Drunk to Care", "You're fined for drunken disorderly conduct, pay $20 fine", function(player) {
      removeCash(player, 20);
    }),
    new ChanceCard("It's your lucky day", "Bank pays you dividend of $50", function(player) {
      addCash(player, 50);
    }),
    new ChanceCard("Quite the (s)wordsman", "You win a crossword competition, collect $100", function(player) {
      addCash(player, 100);
    }),
    new ChanceCard("Economist", "Your building and loan matures, collect $150", function(player) {
      addCash(player, 150);
    }),
    new ChanceCard("Goddamn Electricity", "Advance to the nearest Utility. If unowned you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown", function(player) {
      chanceMoveUtility(player);
    })
  ]
};

// Define each of the properties, stations and utilities explicitly.
var properties = {
  magenta: [
    new Property("Old Kent Road", 1, 2, 10, 30, 90, 160, 250, 30, 50, 0, 60, "Street", bank, "magenta"),
    new Property("Whitechapel Road", 3, 4, 10, 30, 90, 160, 250, 30, 50, 0, 60, "Street", bank, "magenta")
  ],
  light_blue: [
    new Property("Angel Islington", 6, 6, 30, 90, 270, 400, 550, 50, 50, 0, 100, "Street", bank, "light_blue"),
    new Property("Euston Road", 8, 6, 30, 90, 270, 400, 550, 50, 50, 0, 100, "Street", bank, "light_blue"),
    new Property("Pentonville Road", 9, 8, 40, 100, 300, 450, 600, 50, 60, 0, 120, "Street", bank, "light_blue")
  ],
  pink: [
    new Property("Pall Mall", 11, 10, 50, 150, 450, 625, 750, 100, 70, 0, 140, "Street", bank, "pink"),
    new Property("Whitehall", 13, 10, 50, 150, 450, 625, 750, 100, 70, 0, 140, "Street", bank, "pink"),
    new Property("Northumberland Road", 14, 12, 60, 180, 500, 700, 900, 100, 80, 0, 160, "Street", bank, "pink")
  ],
  orange: [
    new Property("Bow Street", 16, 14, 70, 200, 550, 750, 950, 100, 90, 0, 180, "Street", bank, "orange"),
    new Property("Marlborough Street", 18, 14, 70, 200, 550, 750, 950, 100, 90, 0, 180, "Street", bank, "orange"),
    new Property("Vine Street", 19, 16, 70, 200, 550, 750, 950, 100, 90, 0, 200, "Street", bank, "orange")
  ],
  red: [
    new Property("Strand", 21, 18, 90, 250, 700, 875, 1050, 150, 110, 0, 220, "Street", bank, "red"),
    new Property("Fleet Street", 23, 18, 90, 250, 700, 875, 1050, 150, 110, 0, 220, "Street", bank, "red"),
    new Property("Trafalgar Square", 24, 20, 90, 250, 700, 875, 1050, 150, 110, 0, 240, "Street", bank, "red")
  ],
  yellow: [
    new Property("Leicester Square", 26, 22, 110, 330, 800, 975, 1150, 150, 150, 0, 260, "Street", bank, "yellow"),
    new Property("Coventry Street", 27, 22, 110, 330, 800, 975, 1150, 150, 150, 0, 260, "Street", bank, "yellow"),
    new Property("Picadilly", 29, 24, 120, 360, 850, 1025, 1200, 150, 150, 0, 280, "Street", bank, "yellow")
  ],
  green: [
    new Property("Regent Street", 31, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, 300, "Street", bank, "green"),
    new Property("Oxford Street", 32, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, 300, "Street", bank, "green"),
    new Property("Bond Street", 34, 28, 150, 450, 1000, 1200, 1400, 150, 200, 0, 320, "Street", bank, "green")
  ],
  dark_blue: [
    new Property("Park Lane", 37, 35, 175, 500, 1100, 1300, 1500, 200, 175, 0, 350, "Street", bank, "dark_blue"),
    new Property("Mayfair", 39, 50, 200, 600, 1400, 1700, 2000, 200, 200, 0, 400, "Street", bank, "dark_blue")
  ],
  stations: [
    new Station("King's Cross Station", 5, 25, 50, 100, 200, 100, 200, "Station", bank),
    new Station("Marylebone Station", 15, 25, 50, 100, 200, 100, 200, "Station", bank),
    new Station("Fenchurch St. Station", 25, 25, 50, 100, 200, 100, 200, "Station", bank),
    new Station("Liverpool Street Station", 35, 25, 50, 100, 200, 100, 200, "Station", bank)
  ],
  utilities: [
    new Utility("Electric Company", 12, 4, 10, 75, 150, "Utility", bank),
    new Utility("Waterworks", 28, 4, 10, 75, 150, "Utility", bank)
  ],
  tax: [
    new Tax("Super Tax", 200, 38),
    new Tax("Income Tax", 100, 4)
  ],
  free_parking: [
    new FreeParking("Free Parking", 0, 20)
  ],
  jail: [
    new Jail("Jail", 30, 0, function(player) {
      goToJail(player);
    })//,
    // new Jail("Jail Visit", 10, 0, function(player) {
    //   console.log("You are visiting jail, however you are not actually jailed");
    // })
  ],
  chance: [
    new ChanceProperty("Chance Red", 7),
    new ChanceProperty("Chance Blue", 22),
    new ChanceProperty("Chance Yellow", 36)
  ],
  chest: [
    new ChestProperty("Chest Blue", 2),
    new ChestProperty("Chest Blue", 17),
    new ChestProperty("Chest Blue", 33)
  ]
};
