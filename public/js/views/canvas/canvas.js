

LG.CanvasView = Backbone.View.extend({
	
	initialize:function(){
		this.model = new LG.CanvasModel();
		LG.EventDispatcher.bind(LG.Events.COMMAND_FINISHED, $.proxy(this.nextCommand, this));
		LG.EventDispatcher.bind(LG.Events.COMMAND_TICK, $.proxy(this.tick, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_DRAW, $.proxy(this.draw, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_STOP, $.proxy(this.stop, this));
		LG.EventDispatcher.bind(LG.Events.RESIZE, $.proxy(this.onResize, this));
		LG.EventDispatcher.bind(LG.Events.CAPTURE_IMAGE, $.proxy(this.capture, this));
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
		this.listenTo(this.model, "change", $.proxy(this.reset, this));
	},
	template:"tpl_canvas",
	render:function(){
		this.loadTemplate(this.template, this.model.toJSON(), {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click img.help":"clickHelp",
			"_click":"clickMe"
		});
		return obj;
	},
	clickHelp:function(e){
		this.stopProp(e);
		alert("help");
	},
	onLayoutChanged:function(){
		var show = LG.layoutModel.get("show");
		var hideIf = ["gallery", "load"];
		if(hideIf.indexOf(show) != -1){
			this.$el.hide();
		}
		else{
			this.$el.show();
		}
	},
	clickMe:function(){
		alert("click "+this.active);
		if(LG.layoutModel.get("show") == "write"){
			if(this.active){
				LG.EventDispatcher.trigger(LG.Events.CLICK_STOP);
			}
			else{
				LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
			}
		}
	},
	onResize:function(){
		var w, h;
		w = $("body").width();
		h = $("body").height();
		this.$el.width(w).height(h);
		this.model.set({"width":w, "height":h});
		this.stop();
	},
	
	afterAdded:function(){
		this.reset();
	},
	removeAll:function(){
		if(this.container){
			this.container.removeAllChildren();
		}
		if(this.stage){
			this.stage.removeAllChildren();
		}
		this.stage = null;
		this.turtle = null;
		this.container = null;
		this.canvas = null;
	},
	reset:function(){
		this.active = false;
		this.ended = false;
		this.removeAll();
		this.canvas = document.getElementById("gamecanvas");
		$(this.canvas).attr("width", this.model.get("width") ).attr("height", this.model.get("height") );
		this.stage = new createjs.Stage(this.canvas);
		this.turtle = new LG.Easel.Turtle(10);
		this.container = new createjs.Container();
		this.container.addChild(this.turtle);
		this.stage.addChild(this.container);
		this.position = {theta:-Math.PI/2, x:this.model.get("width")/2, y:this.model.get("height")/2};
		this.tick();
	},
	tick:function(){
		LG.Utils.log("tick "+JSON.stringify(this.position));
		this.turtle.x = this.position.x;
		this.turtle.y = this.position.y;
		this.turtle.rotation = this.position.theta*180/Math.PI;
		this.stage.update();
	},
	stop:function(){
		this.active = false;
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
		console.log("Worker said : " + JSON.stringify(msg.data));
		if(data.type === "command"){
			if(data.name === "fd"){
				command = new LG.FdCommand(data.amount);
			}
			else if(data.name === "rt"){
				command = new LG.RtCommand(data.amount);
			}
			console.log("command "+command+" "+command.output());
			this.output.add(command);
			size = this.output.size();
			if(size >= LG.output.MAX_SIZE){
				alert("full");
				this.worker.terminate();
				this.ended = true;
			}
		}
		else if(data.type === "message"){
			alert("message "+data.message);
		}
		else if(data.type === "end"){
			console.log("ended!");
			this.ended = true;
		}
	},
	draw:function(){	
		this.reset();
		this.active = true;
		this.ended = false;
		this.output = new LG.output();
		this.commandIndex = 0;
		var logo = LG.logoModel.get("logo");
		var tree = LG.Utils.logoparser.parse(logo); // put this in a worker too?? YES!
		this.process(tree);
	},
	process:function(tree){
		this.worker = new Worker("js/visit.js");
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
		setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
	},
	capture:function(){
		var context, data, compositeOperation, tempCanvas, tempContext, img;
		context = this.canvas.getContext("2d");
		var x0 = Math.max(0, (this.canvas.width - LG.CanvasView.SNAPSHOT_WIDTH)/2 );
		var y0 = Math.max(0, (this.canvas.height - LG.CanvasView.SNAPSHOT_HEIGHT)/2 );
		alert(this.canvas.width+","+this.canvas.height+": "+x0+","+y0+","+LG.CanvasView.SNAPSHOT_WIDTH+","+LG.CanvasView.SNAPSHOT_HEIGHT);
		data = context.getImageData(x0, y0, LG.CanvasView.SNAPSHOT_WIDTH, LG.CanvasView.SNAPSHOT_HEIGHT);
		tempCanvas = document.createElement("canvas");
		tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = LG.CanvasView.SNAPSHOT_WIDTH;
		tempCanvas.height = LG.CanvasView.SNAPSHOT_HEIGHT;
		tempContext.putImageData(data, 0, 0);
		img = tempCanvas.toDataURL("image/png");
		LG.imageModel.set({"img":img});
	},
	finished:function(){
		LG.Utils.growl("Finished!");
		this.active = false;
		this.trigger(LG.Events.DRAW_FINISHED);
	},
	drawBatch:function(){
		var size = this.output.size(), i;
		if(!this.active){
			clearInterval( this.drawInterval );
		}
		for(i = 0; i <= LG.output.BATCH_SIZE - 1; i++){
			var command = this.output.at(this.commandIndex);
			console.log("drawBatch "+command);
			if(command){
				command.execute(this.stage, this.container, this.position);
				this.commandIndex++;
			}
		}
		this.tick();
		var done = (this.ended && (this.commandIndex >= this.output.size() - 1) );
		if(done){
			this.finished();
		}
		else{
			setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
		}
	},
	beforeClose:function(){
	
	}
});

LG.CanvasView.SNAPSHOT_WIDTH = 300;
LG.CanvasView.SNAPSHOT_HEIGHT = 300;

LG.CanvasModel = Backbone.Model.extend({
	defaults:{
		width:300,
		height:300
	}
});


/**

// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

**/