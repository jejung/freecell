"use strict";

var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 640;

var CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var CARD_SUITS = ["D", "H", "S", "C"];

var BACKGROUND_COLOR = "#008000";

function drawCardCell(context, x, y) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + CARD_WIDTH - 1, y);
  context.moveTo(x, y);
  context.lineTo(x, y + CARD_HEIGHT - 1);
  context.lineWidth = 1;
  context.strokeStyle = '#000000';
  context.stroke();

  context.beginPath();
  context.moveTo(x + CARD_WIDTH - 1, y);
  context.lineTo(x + CARD_WIDTH - 1, y + CARD_HEIGHT - 1);
  context.moveTo(x + CARD_WIDTH - 1, y + CARD_HEIGHT - 1);
  context.lineTo(x, y + CARD_HEIGHT - 1);
  context.lineWidth = 1;
  context.strokeStyle = '#00F000';
  context.stroke();
}

function AssetLoader() {
  var sources = {
    "cards": "./images/freecell_cards.png",
    "selected_cards": "./images/freecell_cards.png",
    "king": "./images/freecell_king.png"
  };
  var sourceCount = Object.keys(sources).length;
  var loadedImages = 0;
  var _callback;

  this.images = {};

  var imageLoaded = function() {
    loadedImages++;
    if (loadedImages == sourceCount) {
      _callback();
    }
  }

  this.loadAll = function(callback) {
    _callback = callback;
    for (var key in sources) {
      var image = new Image();
      image.src = sources[key];
      image.onload = imageLoaded;
      this.images[key] = image;
    }
  }
}

function Stack(x, y) {
  this.cards = [];

  this.draw = function(context) {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(x, y, CARD_WIDTH, CANVAS_HEIGHT);

    for (var i = 0; i < this.cards.length; i++) {
      this.cards[i].draw(context, x, y + i * 18);
    }
  }

  this.push = function(card) {
    this.cards.push(card);
  }
}

function CellSet(x, y) {
  this.layout = {
    width: CARD_WIDTH * 4,
    height: CARD_HEIGHT
  }

  this.cards = [null, null, null, null];

  this.draw = function(context) {
    drawCardCell(context, x, y);
    if (this.cards[0]) {
      this.cards[0].draw(context, x, y);
    }

    drawCardCell(context, x + CARD_WIDTH, y);
    if (this.cards[1]) {
      this.cards[1].draw(context, x + CARD_WIDTH, y);
    }

    drawCardCell(context, x + CARD_WIDTH * 2, y);
    if (this.cards[2] !== null) {
      this.cards[2].draw(context, x + CARD_WIDTH * 2, y);
    }

    drawCardCell(context, x + CARD_WIDTH * 3, y);
    if (this.cards[3]) {
      this.cards[3].draw(context, x + CARD_WIDTH * 3, y);
    }
  }
}

function KingIcon(assets, context, x, y) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 38, y);
  context.moveTo(x, y);
  context.lineTo(x, y + 38);
  context.lineWidth = 1;
  context.strokeStyle = '#00F000';
  context.stroke();

  context.beginPath();
  context.moveTo(x + 38, y);
  context.lineTo(x + 38, y + 38);
  context.moveTo(x + 38, y + 38);
  context.lineTo(x, y + 38);
  context.lineWidth = 1;
  context.strokeStyle = '#000000';
  context.stroke();

  var image = assets.images["king"];

  this.update = function(type) {
    var pos = 0;
    if (type == "left") {
      pos = 32;
    }
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(x + 3, y + 3, 32, 32);
    context.drawImage(image, pos, 0, 32, 32, x + 3, y + 3, 32, 32);
  }
}

function init(canvasId, width, height) {
  var canvas = $(canvasId)[0];
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, width, height);

  canvas.onmousemove = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    if (y <= 95) {
      canvas.style.cursor = 'crosshair';
      if (x < 285) {
        king.update("left");
      } else if (x > 339) {
        king.update("right");
      }
    } else {
      canvas.style.cursor = 'default';
    }
  }

  canvas.onclick = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    console.log(x, y);
  }

  return context;
}

function Card(assets, number, suit) {
  var getHorizontalPositionGrid = function(number) {
    switch (number) {
      case "A":
        return 0;
      case "J":
        return 10;
      case "Q":
        return 11;
      case "K":
        return 12;
      default:
        return parseInt(number) - 1;
    }
  }
  var getVerticalPositionGrid = function(suit) {
    switch (suit) {
      case "D":
        return 0;
      case "H":
        return 1;
      case "S":
        return 2;
      case "C":
        return 3;
    }
  }
  var image = assets.images["cards"];

  this.draw = function(context, x, y) {
    var spriteX = getHorizontalPositionGrid(number);
    var spriteY = getVerticalPositionGrid(suit);

    spriteX = spriteX * CARD_WIDTH;
    spriteY = spriteY * CARD_HEIGHT;

    context.drawImage(image, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
  }
}

var king;
var assets = new AssetLoader();
assets.loadAll(function() {
  var context = init("#cardgame", CANVAS_WIDTH, CANVAS_HEIGHT);

  var freeCell = new CellSet(0, 0);
  var homeCell = new CellSet(339, 0);

  king = new KingIcon(assets, context, 292, 20);

  freeCell.cards[2] = new Card(assets, "K", "C");
  freeCell.cards[1] = new Card(assets, "Q", "H");
  freeCell.cards[3] = new Card(assets, "J", "D");
  freeCell.cards[0] = new Card(assets, "10", "S");

  homeCell.cards[0] = new Card(assets, "A", "C");

  king.update();
  freeCell.draw(context);
  homeCell.draw(context);

  var stack = new Stack(120, 120);
  stack.push(new Card(assets, "A", "D"));
  stack.push(new Card(assets, "A", "H"));
  stack.push(new Card(assets, "Q", "C"));
  stack.draw(context);
});
