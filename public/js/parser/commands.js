
LG.Command = function(data){
	this.data = data;
};

LG.Command.prototype.execute = function(context, position){
	this.context = context;
	this.graphics = this.context.graphics;
	this.position = position;
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
	var endX = this.position.x + Math.cos(this.position.theta)*this.data.amount;
	var endY = this.position.y + Math.sin(this.position.theta)*this.data.amount;
	this.graphics.setStrokeStyle(this.position.thickness, "round", "round");
	this.graphics.beginStroke(this.position.color);
	if(position.pen === "up"){
		this.graphics.moveTo(endX, endY);
	}
	else{
		this.graphics.moveTo(this.position.x, this.position.y);
		this.graphics.lineTo(endX, endY);
	}
	this.position.x = endX;
	this.position.y = endY;
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
	var endPosition = {"theta": this.position.theta + this.data.amount*Math.PI/180, "x":this.position.x , "y":this.position.y };
	this.position.theta = endPosition.theta;
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
	var hex = LG.GraphicsModel.getHex(this.data.color);
	position.bg = hex;
};

LG.BgCommand.prototype.output = function(){
	return "bg " +this.data.color;
};





LG.ColorCommand = function(data){
	LG.Command.call(this, data);
};

LG.ColorCommand.prototype = Object.create(LG.Command.prototype);
LG.ColorCommand.prototype.constructor = LG.ColorCommand;

LG.ColorCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	var hex = LG.GraphicsModel.getHex(this.data.color);
	position.color = hex;
};

LG.ColorCommand.prototype.output = function(){
	return "color " +this.data.color;
};




LG.ThicknessCommand = function(data){
	LG.Command.call(this, data);
};

LG.ThicknessCommand.prototype = Object.create(LG.Command.prototype);
LG.ThicknessCommand.prototype.constructor = LG.ThicknessCommand;

LG.ThicknessCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.thickness = this.data.amount;
};

LG.ThicknessCommand.prototype.output = function(){
	return "thick " +this.data.amount;
};
