
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Bg = function() {
	this.initialize();
	_.extend(this, Backbone.Events);
	this.clr = LG.GraphicsModel.CLRS[LG.GraphicsModel.BG[0]];
	this.listenTo(LG.canvasModel,	"change",	$.proxy(this.performDraw, this));
};

LG.Easel.Bg.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Bg.prototype.constructor = LG.Easel.Bg;

LG.Easel.Bg.prototype.performDraw = function(){
	var g, w, h;
	g = this.graphics;
	w = LG.canvasModel.get("width");
	h = LG.canvasModel.get("height");
	g.clear();
	g.beginFill(this.clr).drawRect(0, 0, w, h);
	this.w = w;
	this.h = h;
};

LG.Easel.Bg.prototype.drawMe = function(clr){
	this.clr = clr;
	this.performDraw();
};

LG.Easel.Bg.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};





