self.LG = {};

importScripts("stack.js");
importScripts("symtable.js");

var stack = new LG.Stack();
var symTable = new LG.SymTable();

self.addEventListener('message', function(msg) {
	if(msg.data.type === "tree"){
		visitNode(msg.data.tree);
		postMessage({"type":"end"});
	}
}, false);

function visitchildren(node){
	// a general node with children
	var ch = node.children;
	var len = ch.length;
	for(var i = 0; i < len; i++){
		self.postMessage({"type":"message", "message":"visiting child "+JSON.stringify(ch[i])});
		visitNode(ch[i]);
	}
}

function visitstart(node){
	symTable.enterBlock();
	visitchildren(node);
	symTable.exitBlock();
}

function visitinsidestmt(node){
	visitchildren(node);
}
function visitmakestmt(node){
	var ch = node.children;
	var name = ch[0].name;
	visitNode( ch[1] );
	symTable.add(name, stack.pop());
}

function visitfdstmt(node){
	visitchildren(node);
	var amount = stack.pop();
	self.postMessage({ "type":"command", "name":"fd", "amount":amount });
}

function visitexpression(node){
	var num  = 0;
	self.postMessage({"type":"message", "message":"visiting expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
	visitchildren(node);
	self.postMessage({"type":"message", "message":"visiting expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
	var l = node.children.length;
	for(var i=0;i<l;i++){
		num += stack.pop();
	}
	stack.push(num);
	self.postMessage({"type":"message", "message":"visiting expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
}

function visitmultexpression(node){
	self.postMessage({"type":"message", "message":"visiting m expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
	visitchildren(node);
	self.postMessage({"type":"message", "message":"visiting m expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
	var num  = 1;
	var l = node.children.length;
	for(var i=0;i<l;i++){
		num *= stack.pop();
	}
	stack.push(num);
	self.postMessage({"type":"message", "message":"visiting m expression, "+JSON.stringify(node)+" stack is "+stack.describe()});
}

function visitrptstmt(node){
	var ch = node.children;
	visitNode( ch[0] );
	var num = stack.pop();	
	for(var i = 1;i<=num; i++){
		self.postMessage({"type":"message", "message":"visiting "+JSON.stringify(ch[1])+"  "+i+"/"+num});
		visitNode(ch[1]);
	}
}

function visitunaryexpression(node){
	visitchildren(node);
}

function visitnumberexpression(node){
	visitchildren(node);
}

function visitnumber(node){
	stack.push(node.value);
}

function visitrtstmt(node){
	visitchildren(node);
	var amount = stack.pop();
	self.postMessage({"type":"command", "name":"rt", "amount":amount });
}

function visittimesordivterms(node){
	visitchildren(node);
	var ch = node.children;
	var l = ch.length;
	// now there are 'l' values on the stack.
	var num  = 1;
	for(var i = 0; i < l; i++){
		num *= stack.pop();
	}
	stack.push(num);
}

function visittimesordivterm(node){
	visitchildren(node);
}	

function visittimesterm(node){
	visitchildren(node);
}	

function visitplusorminus(node){
	visitchildren(node);
}

function visitoutsidefnlist(node){
	visitchildren(node);
}

function visitinsidefnlist(node){
	self.postMessage({"type":"message", "message":"visiting visitinsidefnlist "});
	visitchildren(node);
}

function visitplusexpression(node){
	visitchildren(node);
}

function visitvarname(node){
	var num = symTable.get(node.name);
	if(!num){
		throw new Error("not found "+node.name);
	}
	else{
		stack.push(num);
	}
}

function visitminusexpression(node){
	visitchildren(node);
	var num = stack.pop();
	stack.push(-1*num);
}
function visitdefinefnstmt(node){
	var name = node.name;
	var argsNode = node.args;
	var statementsNode = node.stmts;
	self.postMessage({"type":"message", "message":"visiting definefn "+JSON.stringify(argsNode)+" , "+JSON.stringify(statementsNode)});
	symTable.addFunction(name, argsNode, statementsNode);
}
function visitcallfnstmt(node){
	var name = node.name;
	self.postMessage({"type":"message", "message":"visiting callfn "+JSON.stringify(node)});
	var f = symTable.getFunction(name);
	self.postMessage({"type":"message", "message":"f is "+JSON.stringify(f)+" <- "+name});
	symTable.enterBlock();
	visitchildren(node.args);
	self.postMessage({"type":"message", "message":"visited "+node.args.children.length+" vars, and stack is now "+stack.describe()});
	executeFunction(f);
	symTable.exitBlock();
}

function executeFunction(f){
	self.postMessage({"type":"message", "message":"fn is "+JSON.stringify(f)});
	var i;
	var vals = [ ];
	var len = f.argsNode.children.length;
	for(i = 0; i <= len - 1; i++){
		vals.push(stack.pop());
	}
	for(i = 0; i <= len - 1; i++){
		var argNode = f.argsNode.children[i];
		var varname = argNode.name;
		//self.postMessage({"type":"message", "message":"stack var "+varname+" = "+s});
		symTable.add(varname, vals[len - 1 - i]);
	}
	visitNode(f.statementsNode);
}

function visitNode(node){
	var t = node.type;
	if(t=="start"){
		visitstart(node);
	}
	else if(t=="insidestmt"){
		visitinsidestmt(node);
	}
	else if(t == "definefnstmt"){
		visitdefinefnstmt(node);
	}
	else if(t == "callfnstmt"){
		visitcallfnstmt(node);
	}
	else if(t=="fdstmt"){
		visitfdstmt(node);
	}
	else if(t=="rtstmt"){
		visitrtstmt(node);
	}
	else if(t=="rptstmt"){
		visitrptstmt(node);
	}
	else if(t=="makestmt"){
		visitmakestmt(node);
	}
	else if(t=="expression"){
		visitexpression(node);
	}
	else if(t=="insidefnlist"){
		visitinsidefnlist(node);
	}
	else if(t=="outsidefnlist"){
		visitoutsidefnlist(node);
	}
	else if(t=="vardef"){
		visitvardef(node);
	}
	else if(t=="expression"){
		visitexpression(node);
	}
	else if(t=="multexpression"){
		visitmultexpression(node);
	}
	else if(t=="plusorminus"){
		visitplusorminus(node);
	}
	else if(t=="plusexpression"){
		visitplusexpression(node);
	}
	else if(t=="minusexpression"){
		visitminusexpression (node);
	}
	else if(t=="unaryexpression"){
		visitunaryexpression(node);
	}
	else if(t=="timesordivterms"){
		visittimesordivterms(node);
	}
	else if(t=="timesordivterm"){
		visittimesordivterm(node);
	}
	else if(t=="timesterm"){
		visittimesterm(node);
	}
	else if(t=="plusexpression"){
		visitplusexpression(node);
	}
	else if(t=="multexpression"){
		visitmultexpression(node);
	}
	else if(t=="negate"){
		visitnegate(node);
	}
	else if(t=="numberexpression"){
		visitnumberexpression(node);
	}
	else if(t=="divterm"){
		visitdivterm(node);
	}
	else if(t=="number"){
		visitnumber(node);
	}
	else if(t=="varname"){
		visitvarname(node);
	}
	else if(t=="number"){
		visitnumber(node);
	}
}

