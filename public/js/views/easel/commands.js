
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Commands = function() {
	this.initialize();
}

LG.Easel.Commands.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Commands.prototype.constructor = LG.Easel.Commands;

LG.Easel.Commands.prototype.drawMe = function(clr){
	var g, w, h;
	g = this.graphics;
	w = LG.canvasModel.get("width");
	h = LG.canvasModel.get("height");
	g.clear();
	g.beginFill(clr).drawRect(0, 0, w, h);
};

LG.Easel.Commands.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};





