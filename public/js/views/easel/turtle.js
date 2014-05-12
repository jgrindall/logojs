window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
	this.cache(-25, -25, 50, 50);
	this.drawMe( LG.graphicsModel.getInner() );
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
		this.updateCache();
	}
};


LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
};

