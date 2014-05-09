
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
};

LG.Easel.Turtle.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Turtle.prototype.constructor = LG.Easel.Turtle;

LG.Easel.Turtle.prototype.drawMe = function(clr) {
	if(this.clr != clr){
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







window.LG.Easel = window.LG.Easel || {};

LG.Easel.Commands = function() {
	this.initialize();
};

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







window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
};

LG.Easel.Turtle.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Turtle.prototype.constructor = LG.Easel.Turtle;

LG.Easel.Turtle.prototype.drawMe = function(clr) {
	if(this.clr != clr){
		var g = this.graphics;
		g.clear();
		g.setStrokeStyle(0);
		g.beginStroke(clr);
		g.beginFill(clr);
		g.moveTo(-this.size,-this.size);
		g.lineTo(this.size,0);
		g.lineTo(-this.size,this.size);
		g.lineTo(-this.size,-this.size);
		g.endFill();
		this.clr = clr;
	}
};

LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
	this.drawMe( LG.graphicsModel.getInner() );
};



		var g = this.graphics;
		g.clear();
		g.setStrokeStyle(0);
		g.beginStroke(clr);
		g.beginFill(clr);
		g.moveTo(-this.size,-this.size);
		g.lineTo(this.size,0);
		g.lineTo(-this.size,this.size);
		g.lineTo(-this.size,-this.size);
		g.endFill();
		this.clr = clr;
	}
};

LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
	this.drawMe( LG.graphicsModel.getInner() );
};

