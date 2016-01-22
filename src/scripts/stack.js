'use strict';

function Stack(context, x, y) {
	this._CARD_OFFSET_Y = 18;
	this._selected = false;

	this.streakSize = 0;

	this.x = x;
	this.y = y;

	this.cards = [];

	this._context = context;
	this._x = x;
	this._y = y;
}

Stack.prototype.draw = function() {
	var x = this._x;
	var y = this._y;

	this._context.fillStyle = BACKGROUND_COLOR;
	this._context.fillRect(x, y, CARD_WIDTH, CANVAS_HEIGHT);

	for (var i = 0; i < this.cards.length; i++) {
		this.cards[i].draw(x, y + i * this._CARD_OFFSET_Y);
	}
};

Stack.prototype.select = function() {
	var index = this.cards.length - 1;
	if (index >= 0) {
		this.cards[index].select();
		this._selected = true;
		return this.cards[index];
	}
};

Stack.prototype.deselect = function() {
	var index = this.cards.length - 1;
	if (index >= 0) {
		this.cards[index].deselect();
		this._selected = false;
	}
};

Stack.prototype.isSelected = function() {
	return this._selected;
};

Stack.prototype.howManyAcceptables = function(origin, max) {
	var cards = origin.cards;
	if (this.cards.length === 0) {
		return Math.min(cards.length, max);
	}
	
	var last = this.cards.length - 1;	
	for (var i = cards.length - 1; i >= cards.length - max; i--) {
		if (isPreviousInvertedSuit(this.cards[last], cards[i])) {
			return cards.length - i;
		}
	}
	return 0;
};

Stack.prototype.isInside = function(x, y) {
	var height = this._CARD_OFFSET_Y * (this.cards.length - 1) + CARD_HEIGHT;
	return (
		x >= this.x &&
		x <= this.x + CARD_WIDTH &&
		y >= this.y &&
		y <= this.y + height
	);
};