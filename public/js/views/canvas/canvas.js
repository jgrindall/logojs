
LG.CanvasView = Backbone.View.extend({
	
	initialize:function(){
		this.model = new LG.CanvasModel();
		LG.EventDispatcher.bind(LG.Events.COMMAND_FINISHED, $.proxy(this.nextCommand, this));
		LG.EventDispatcher.bind(LG.Events.TICK, $.proxy(this.tick, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_DRAW, $.proxy(this.draw, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_STOP, $.proxy(this.stop, this));
		LG.EventDispatcher.bind(LG.Events.RESIZE, $.proxy(this.onResize, this));
		LG.EventDispatcher.bind(LG.Events.RESET_CANVAS, $.proxy(this.reset, this));
		LG.EventDispatcher.bind(LG.Events.CAPTURE_IMAGE, $.proxy(this.capture, this));
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
		this.listenTo(this.model, "change", $.proxy(this.reset, this));
		this.listenTo(LG.graphicsModel, "change:bg", $.proxy(this.drawBg, this));
	},
	template:"tpl_canvas",
	render:function(){
		this.loadTemplate(this.template, this.model.toJSON(), {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
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
		console.log("click "+this.active);
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
		w = $("body").width() - 230;
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
		this.bg = null;
		this.turtle = null;
		this.container = null;
		this.canvas = null;
	},
	drawBg:function(){
		var w = this.model.get("width") ;
		var h = this.model.get("height") ;
		this.bg.graphics.beginFill(LG.graphicsModel.getBg()).drawRect(0, 0, w, h);
		this.tick();
	},
	reset:function(){
		var w = this.model.get("width") ;
		var h = this.model.get("height") ;
		this.active = false;
		this.ended = false;
		this.removeAll();
		this.canvas = document.getElementById("gamecanvas");
		$(this.canvas).attr("width", w).attr("height", h );
		this.stage = new createjs.Stage(this.canvas);
		this.turtle = new LG.Easel.Turtle(10);
		this.bg = new createjs.Shape();
		this.commands = new createjs.Shape();
		this.container = new createjs.Container();
		this.container.addChild(this.bg);
		this.container.addChild(this.commands);
		this.container.addChild(this.turtle);
		this.stage.addChild(this.container);
		this.position = {theta:-Math.PI/2, x:w/2, y:h/2};
		this.drawBg();
	},
	tick:function(){
		if(this.turtle){
			this.turtle.x = this.position.x;
			this.turtle.y = this.position.y;
			this.turtle.rotation = this.position.theta*180/Math.PI;
		}
		this.stage.update();
	},
	stop:function(){
		this.active = false;
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
		//console.log("Worker said : " + JSON.stringify(msg.data));
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
				this.worker.terminate();
				this.ended = true;
			}
		}
		else if(data.type === "message"){
			console.log("message "+data.message);
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
		var logo = LG.fileCollection.selected.get("logo");
		console.log("LOGO is "+logo);
		var tree;
		try {
			tree = LG.Utils.logoparser.parse(logo);
		}
		catch(e){
			this.showError(e.expected,e.offset);
			this.active = false;
		}
		if(tree){
			try{
				this.process(tree);
			}
			catch(e){
				console.log("e: "+e);
				// run time errors here!
			}
		}
		// TODO put this in a worker too?? YES!
		
	},
	showError:function(expected, offset){
		LG.EventDispatcher.trigger(LG.Events.ERROR_ROW, expected, offset);
	},
	process:function(tree){
		this.worker = new Worker("min/parser/visit.js");
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
		setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
	},
	capture:function(){
		var context, data, compositeOperation, tempCanvas, tempContext, img;
		context = this.canvas.getContext("2d");
		var x0 = Math.max(0, (this.canvas.width - LG.CanvasView.SNAPSHOT_WIDTH)/2 );
		var y0 = (this.canvas.height - LG.CanvasView.SNAPSHOT_HEIGHT)/2;
		y0 = Math.max(0, y0 - LG.CanvasView.SNAPSHOT_HEIGHT/3);
		data = context.getImageData(x0, y0, LG.CanvasView.SNAPSHOT_WIDTH, LG.CanvasView.SNAPSHOT_HEIGHT);
		tempCanvas = document.createElement("canvas");
		tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = LG.CanvasView.SNAPSHOT_WIDTH;
		tempCanvas.height = LG.CanvasView.SNAPSHOT_HEIGHT;
		tempContext.putImageData(data, 0, 0);
		img = tempCanvas.toDataURL("image/png");
		LG.imageModel.set({"img":img});
		this.addRect(x0,y0);
	},
	addRect:function(x0, y0){
		var _this = this;
		var rect = new createjs.Shape();
		rect.alpha = 0.25;
		rect.graphics.beginFill("#eeeeee").drawRect(x0, y0, LG.CanvasView.SNAPSHOT_WIDTH, LG.CanvasView.SNAPSHOT_HEIGHT);
		this.container.addChild(rect);
		setTimeout(function(){
			_this.container.removeChild(rect);
			_this.tick();
		}, 500);
		this.tick();
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
			if(command){
				command.execute(this.commands, this.position, this.container);
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