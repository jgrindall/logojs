self.LG = {};

importScripts("stack.js");

var stack = new LG.stack();
var vars = {};

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
		visitNode(ch[i]);
	}
}

function visitstart(node){
	visitchildren(node);
}

function visitinsidestmt(node){
	visitchildren(node);
}
function visitmakestmt(node){
	var ch = node.children;
	var name = ch[0].name;
	visitNode( ch[1] );
	vars[name] = stack.pop();
}

function visitfdstmt(node){
	visitchildren(node);
	var amount = stack.pop();
	self.postMessage({ "type":"command", "name":"fd", "amount":amount });
}

function visitexpression(node){
	visitchildren(node);
	var num = 0;
	var l = node.children.length;
	for(var i=0;i<l;i++){
		num += stack.pop();
	}
	stack.push(num);
}

function visitmultexpression(node){
	visitchildren(node);
	var num  = 1;
	var l = node.children.length;
	for(var i=0;i<l;i++){
		num *= stack.pop();
	}
	stack.push(num);
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
	for(var i=0;i<l;i++){
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

function visitplusexpression(node){
	visitchildren(node);
}

function visitvarname(node){
	var num = vars[node.name];
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

function visitNode(node){
	var t = node.type;
	//postMessage({"message":"worker received "+node.type+", "+JSON.stringify(node)});
	if(t=="start"){
		visitstart(node);
	}
	else if(t=="insidestmt"){
		visitinsidestmt(node);
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
	else if(t=="insidefnlis"){
		visitinsidefnlist(node);
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

