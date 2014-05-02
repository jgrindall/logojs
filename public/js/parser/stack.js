
LG.Stack = function(){
	this.s = [];
};


LG.Stack.prototype.push = function(n){
	this.s.push(n);
};

LG.Stack.prototype.pop = function(){
	var r = this.s.pop();
	return r;
};


