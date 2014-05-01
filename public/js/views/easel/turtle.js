
window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
	_.extend(this, Backbone.Events);
	this.listenTo(LG.graphicsModel, "change:inner", $.proxy(this.drawMe, this));
}

LG.Easel.Turtle.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Turtle.prototype.constructor = LG.Easel.Turtle;

LG.Easel.Turtle.prototype.drawMe = function() {
	var g = this.graphics, clr = LG.graphicsModel.getInner();
	g.clear();
	g.setStrokeStyle(0);
	g.beginStroke(clr);
	g.beginFill(clr);
	g.moveTo(-this.size,-this.size);
	g.lineTo(this.size,0);
	g.lineTo(-this.size,this.size);
	g.lineTo(-this.size,-this.size);
	g.endFill();
	LG.EventDispatcher.trigger(LG.Events.TICK);
};

LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
	this.drawMe();
};

