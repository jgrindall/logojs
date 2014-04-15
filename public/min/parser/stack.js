
LG.stack = function(){
	this.s = [];
};


LG.stack.prototype.push = function(n){
	this.s.push(n);
};

LG.stack.prototype.pop = function(){
	var r = this.s.pop();
	return r;
};


