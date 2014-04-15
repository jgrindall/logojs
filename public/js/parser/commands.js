
LG.Command = function(amount){
	this.amount = amount;
};

LG.Command.prototype.execute = function(stage, container, position){
	this.container = container;
	this.position = position;
	this.stage = stage;
	this.startPosition = $.extend({}, position);
};





LG.ShapeCommand = function(amount){
	LG.Command.call(this, amount);
};
LG.ShapeCommand.prototype = new LG.Command();

LG.ShapeCommand.prototype.execute = function(stage, container, position){
	LG.Command.prototype.execute.apply(this,arguments);
	this.graphics = new createjs.Graphics();
	var shape = new createjs.Shape(this.graphics);
	this.container.addChild(shape);
};





LG.FdCommand = function(amount){
	LG.ShapeCommand.call(this, amount);
};
LG.FdCommand.prototype = new LG.ShapeCommand();

LG.FdCommand.prototype.execute = function(stage, container, position){
	console.log("fd "+this.amount+" from "+position.x+", "+position.y);
	LG.ShapeCommand.prototype.execute.apply(this, arguments);
	this.endPosition = {theta:position.theta, x:position.x + Math.cos(position.theta)*this.amount, y:position.y + Math.sin(position.theta)*this.amount};
	this.graphics.clear();
	this.graphics.setStrokeStyle(5, "round", "round");
	this.graphics.beginStroke(LG.color);
	this.graphics.moveTo(this.startPosition.x, this.startPosition.y);
	this.graphics.lineTo(this.endPosition.x, this.endPosition.y);
	this.position.x = this.endPosition.x;
	this.position.y = this.endPosition.y;
};

LG.FdCommand.prototype.output = function(){
	return "fd " +this.amount;
};


LG.RtCommand = function(amount){
	LG.Command.call(this, amount);
};
LG.RtCommand.prototype = new LG.Command();

LG.RtCommand.prototype.execute = function(stage, container, position){
	LG.Command.prototype.execute.apply(this,arguments);
	this.endPosition = {theta:position.theta+this.amount*Math.PI/180, x:position.x , y:position.y };
	this.position.theta = this.endPosition.theta;
};

LG.RtCommand.prototype.output = function(){
	return "rt " +this.amount;
};



