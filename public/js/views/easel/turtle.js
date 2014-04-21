
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
}

LG.Easel.Turtle.prototype = new createjs.Shape();

LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
	var g = this.graphics;
	g.setStrokeStyle(0);
	g.beginStroke(LG.graphicsModel.get("color"));
	g.beginFill(LG.graphicsModel.get("color"));
	g.moveTo(-this.size,-this.size);
	g.lineTo(this.size,0);
	g.lineTo(-this.size,this.size);
	g.lineTo(-this.size,-this.size);
	g.endFill();
};

