
LG.Command = function(data){
	this.data = data;
};

LG.Command.prototype.execute = function(context, position){
	this.context = context;
	this.graphics = this.context.graphics;
	this.position = position;
	this.startPosition = $.extend({}, position);
};





LG.ShapeCommand = function(data){
	LG.Command.call(this, data);
};

LG.ShapeCommand.prototype = Object.create(LG.Command.prototype);
LG.ShapeCommand.prototype.constructor = LG.ShapeCommand;

LG.ShapeCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
};





LG.FdCommand = function(data){
	LG.ShapeCommand.call(this, data);
};

LG.FdCommand.prototype = Object.create(LG.ShapeCommand.prototype);
LG.FdCommand.prototype.constructor = LG.FdCommand;

LG.FdCommand.prototype.execute = function(context, position){
	LG.ShapeCommand.prototype.execute.apply(this, arguments);
	this.endPosition = {"theta":position.theta, "x":position.x + Math.cos(position.theta)*this.data.amount, "y":position.y + Math.sin(position.theta)*this.data.amount};
	this.graphics.setStrokeStyle(position.thickness, "round", "round");
	this.graphics.beginStroke(position.color);
	if(position.pen === "up"){
		this.graphics.moveTo(this.endPosition.x, this.endPosition.y);
	}
	else{
		this.graphics.moveTo(this.startPosition.x, this.startPosition.y);
		this.graphics.lineTo(this.endPosition.x, this.endPosition.y);
	}
	this.position.x = this.endPosition.x;
	this.position.y = this.endPosition.y;
};


LG.FdCommand.prototype.output = function(){
	return "fd " +this.data.amount;
};


LG.RtCommand = function(data){
	LG.Command.call(this, data);
};

LG.RtCommand.prototype = Object.create(LG.Command.prototype);
LG.RtCommand.prototype.constructor = LG.RtCommand;

LG.RtCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	this.endPosition = {"theta": position.theta + this.data.amount*Math.PI/180, "x":position.x , "y":position.y };
	this.position.theta = this.endPosition.theta;
};

LG.RtCommand.prototype.output = function(){
	return "rt " +this.data.amount;
};




LG.PenUpCommand = function(){
	LG.Command.call(this);
};

LG.PenUpCommand.prototype = Object.create(LG.Command.prototype);
LG.PenUpCommand.prototype.constructor = LG.PenUpCommand;

LG.PenUpCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.pen = "up";
	
};

LG.PenUpCommand.prototype.output = function(){
	return "penup ";
};



LG.PenDownCommand = function(){
	LG.Command.call(this);
};

LG.PenDownCommand.prototype = Object.create(LG.Command.prototype);
LG.PenDownCommand.prototype.constructor = LG.PenDownCommand;

LG.PenDownCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.pen = "down";
};

LG.PenDownCommand.prototype.output = function(){
	return "pendown";
};



LG.BgCommand = function(data){
	LG.Command.call(this, data);
};

LG.BgCommand.prototype = Object.create(LG.Command.prototype);
LG.BgCommand.prototype.constructor = LG.BgCommand;

LG.BgCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.bg = "#00ff00";
};

LG.BgCommand.prototype.output = function(){
	return "bg " +this.data.color;
};





LG.ColorCommand = function(data){
	LG.Command.call(this, data);
};

LG.ColorCommand.prototype = Object.create(LG.Command.prototype);
LG.ColorCommand.prototype.constructor = LG.BgCommand;

LG.ColorCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.color = "#00ffFF";
};

LG.ColorCommand.prototype.output = function(){
	return "color " +this.data.color;
};

