
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Bg = function() {
	this.initialize();
};

LG.Easel.Bg.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Bg.prototype.constructor = LG.Easel.Bg;

LG.Easel.Bg.prototype.drawMe = function(clr){
	var g, w, h;
	g = this.graphics;
	w = LG.canvasModel.get("width");
	h = LG.canvasModel.get("height");
	g.clear();
	g.beginFill(clr).drawRect(0, 0, w, h);
};

LG.Easel.Bg.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};





