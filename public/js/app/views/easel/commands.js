
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Commands = function() {
	this.initialize();
	this.snapToPixel = true;
};

LG.Easel.Commands.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Commands.prototype.constructor = LG.Easel.Commands;

LG.Easel.Commands.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};

LG.Easel.Commands.prototype.toBitmap = function(canvas) {
	this.draw(canvas.getContext("2d"));
	this.graphics.clear();
};




