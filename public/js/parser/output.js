
LG.output = function(){
	this.o = [];
};

LG.output.prototype.add = function(cmd){
	this.o.push(cmd);
};

LG.output.prototype.size = function(){
	return this.o.length;
};

LG.output.prototype.pop = function(){
	var r = this.o.pop();
	return r;
};

LG.output.prototype.at = function(i){
	return this.o[i];
};

LG.output.MAX_SIZE_REACHED = "Exceeded output size";

LG.output.MAX_SIZE = 10000;

LG.output.BATCH_SIZE = 40;

LG.output.TIMEOUT = 50;