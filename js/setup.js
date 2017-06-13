// Generic function to create a new player with certain properties.
function Player(name, cash, position, properties) {
  this.name = name;
  this.cash = cash;
  this.position = position;
  this.properties = properties;
}

// Constructor for the tax-properties
function Tax(name, price, position) {
  this.name = name;
  this.price = price;
  this.position = position;
}

function chanceProperty(name, position) {
  this.name = name;
  this.position = position;
}

// Functions to create the properties, stations and utilites
function Property(name, position, rent, house_1, house_2, house_3, house_4, hotel, house_price, mortgage_value, num_houses, price) {
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
}

function Station(name, position, owns_1, owns_2, owns_3, owns_4, mortgage_value, price) {
  this.name = name;
  this.position = position;
  this.owns_1 = owns_1;
  this.owns_2 = owns_2;
  this.owns_3 = owns_3;
  this.owns_4 = owns_4;
  this.mortgage_value = mortgage_value;
  this.price = price;
}

function Utility(name, position, owns_1_multiplier, owns_2_multiplier, mortgage_value, price) {
  this.name = name;
  this.position = position;
  this.owns_1_multiplier = owns_1_multiplier;
  this.owns_2_multiplier = owns_2_multiplier;
  this.mortgage_value = mortgage_value;
  this.price = price;
}

function ChanceCard(name, description, action) {
  this.name = name;
  this.description = description;
  this.action = action;
}

// Create the players for the game
var players = {
  player_1: new Player("Morten", 4190, 0, []),
  player_2: new Player("Kjetil", 3000, 0, [])
};

var chanceCards = {
  cards: [
    new ChanceCard("Up-up and away we go", "Advance to start and collect $400", function(player) {
      player.position = 0
      landOnStart(player);
    }),
    new ChanceCard("Moving on...", "Advance to Trafalgar Square. - If you pass start, collect $200", function(player) {
      var targetProperty = returnProperty(24); // Trafalgar Square is at position 24
      if(player.position > targetProperty.position) {
        passStart(player);
      }
      player.position = targetProperty.position;
    }),
    new ChanceCard("Moving on...", "Advance to Northumberland Road. - If you pass start, collect $200", function(player) {
      var targetProperty = returnProperty(14); // Trafalgar Square is at position 24
      if(player.position > targetProperty.position) {
        passStart(player);
      }
      player.position = targetProperty.position;
    }),
    new ChanceCard("Goddamn Electricity", "Advance to the nearest Utility. If unowned you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown", function(player) {
      var position = player.position;
      var targetProperty;
      if(position < 22) {
        targetProperty = returnProperty(28);
      } else {
        targetProperty = returnProperty(12);
      }
      var propertyOwner = targetProperty.owner;
      if(propertyOwner != player) {
        var dice = Math.floor((Math.random() * 6) + 1);
        var amountToPay = dice * 10;
        removeCash(player, amountToPay);
        addCash(propertyOwner, amountToPay);
        console.log("You rolled: " + dice);
        console.log("You pay " + propertyOwner.name + " $" + amountToPay);
      }
    })
  ]
};

// Define each of the properties, stations and utilities explicitly.
var properties = {
  magenta: [
    new Property("Old Kent Road", 1, 2, 10, 30, 90, 160, 250, 30, 50, 0, 60),
    new Property("Whitechapel Road", 3, 4, 10, 30, 90, 160, 250, 30, 50, 0, 60)
  ],
  light_blue: [
    new Property("Angel Islington", 6, 6, 30, 90, 270, 400, 550, 50, 50, 0, 100),
    new Property("Euston Road", 8, 6, 30, 90, 270, 400, 550, 50, 50, 0, 100),
    new Property("Pentonville Road", 9, 8, 40, 100, 300, 450, 600, 50, 60, 0, 120)
  ],
  pink: [
    new Property("Pall Mall", 11, 10, 50, 150, 450, 625, 750, 100, 70, 0, 140),
    new Property("Whitehall", 13, 10, 50, 150, 450, 625, 750, 100, 70, 0, 140),
    new Property("Northumberland Road", 14, 12, 60, 180, 500, 700, 900, 100, 80, 0, 160)
  ],
  orange: [
    new Property("Bow Street", 16, 14, 70, 200, 550, 750, 950, 100, 90, 0, 180),
    new Property("Marlborough Street", 18, 14, 70, 200, 550, 750, 950, 100, 90, 0, 180),
    new Property("Vine Street", 19, 16, 70, 200, 550, 750, 950, 100, 90, 0, 200)
  ],
  red: [
    new Property("Strand", 21, 18, 90, 250, 700, 875, 1050, 150, 110, 0, 220),
    new Property("Fleet Street", 23, 18, 90, 250, 700, 875, 1050, 150, 110, 0, 220),
    new Property("Trafalgar Square", 24, 20, 90, 250, 700, 875, 1050, 150, 110, 0, 240)
  ],
  yellow: [
    new Property("Leicester Square", 26, 22, 110, 330, 800, 975, 1150, 150, 150, 0, 260),
    new Property("Coventry Street", 27, 22, 110, 330, 800, 975, 1150, 150, 150, 0, 260),
    new Property("Picadilly", 29, 24, 120, 360, 850, 1025, 1200, 150, 150, 0, 280)
  ],
  green: [
    new Property("Regent Street", 31, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, 300),
    new Property("Oxford Street", 32, 22, 130, 390, 900, 1100, 1276, 150, 200, 0, 300),
    new Property("Bond Street", 34, 28, 150, 450, 1000, 1200, 1400, 150, 200, 0, 320)
  ],
  dark_blue: [
    new Property("Park Lane", 37, 35, 175, 500, 1100, 1300, 1500, 200, 175, 0, 350),
    new Property("Mayfair", 39, 50, 200, 600, 1400, 1700, 2000, 200, 200, 0, 400)
  ],
  stations: [
    new Station("King's Cross Station", 5, 25, 50, 100, 200, 100, 200),
    new Station("Marylebone Station", 15, 25, 50, 100, 200, 100, 200),
    new Station("Fenchurch St. Station", 25, 25, 50, 100, 200, 100, 200),
    new Station("Liverpool Street Station", 35, 25, 50, 100, 200, 100, 200)
  ],
  utilities: [
    new Utility("Electric Company", 12, 4, 10, 75, 150),
    new Utility("Waterworks", 28, 4, 10, 75, 150)
  ],
  tax: [
    new Tax("Super Tax", 200, 38),
    new Tax("Income Tax", 100, 4)
  ],
  chance: [
    new chanceProperty("Chance Red", 7),
    new chanceProperty("Chance Blue", 22),
    new chanceProperty("Chance Yellow", 36)
  ]
};
