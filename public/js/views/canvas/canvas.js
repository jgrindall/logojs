
LG.CanvasView = Backbone.View.extend({
	
	initialize:function(){
		this.listenTo(LG.EventDispatcher,	LG.Events.TICK,					$.proxy(this.tick, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_DRAW,			$.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_STOP,			$.proxy(this.stop, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESIZE,				$.proxy(this.onResize, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESET_CANVAS,			$.proxy(this.reset, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CAPTURE_IMAGE,		$.proxy(this.capture, this));
		this.listenTo(LG.layoutModel,		"change",						$.proxy(this.onLayoutChanged, this));
		this.listenTo(LG.graphicsModel,		"change:bg",					$.proxy(this.reset, this));
		this.listenTo(LG.graphicsModel,		"change:inner",					$.proxy(this.reset, this));
		this.listenTo(LG.canvasModel,		"change",						$.proxy(this.reset, this));
	},
	template:"tpl_canvas",
	render:function(){
		this.loadTemplate(this.template, LG.canvasModel.toJSON(), {replace:true} );
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
		LG.canvasModel.set({"width":w, "height":h});
	},
	afterAdded:function(){
		this.canvas = document.getElementById("gamecanvas");
		this.$canvas = $(this.canvas);
		this.addChildren();
		this.reset();
	},
	removeAllChildren:function(){
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
	addChildren:function(){
		this.stage = new createjs.Stage(this.canvas);
		this.turtle = new LG.Easel.Turtle(10);
		this.bg = new LG.Easel.Bg();
		this.commands = new LG.Easel.Commands();
		this.container = new createjs.Container();
		this.container.addChild(this.bg);
		this.container.addChild(this.commands);
		this.container.addChild(this.turtle);
		this.stage.addChild(this.container);
	},
	reset:function(){
		this.stop();
		var w = LG.canvasModel.get("width");
		var h = LG.canvasModel.get("height");
		this.$canvas.attr("width", w).attr("height", h);
		this.position = {"theta":-Math.PI/2, x:w/2, y:h/2, "pen":"down", "bg":LG.graphicsModel.getBg(), "color":LG.graphicsModel.getInner(), "thickness":5};
		this.commands.graphics.clear();
		this.tick();
	},
	tick:function(){
		if(this.turtle){
			this.turtle.x = this.position.x;
			this.turtle.y = this.position.y;
			this.turtle.rotation = this.position.theta*180/Math.PI;
			this.turtle.drawMe(this.position.color);
		}
		if(this.bg){
			this.bg.drawMe(this.position.bg);
		}
		this.stage.update();
	},
	stop:function(){
		this.ended = false;
		this.active = false;
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
		//console.log("Worker said : " + JSON.stringify(msg.data));
		if(data.type === "command"){
			if(data.name === "fd"){
				command = new LG.FdCommand({"amount":data.amount});
			}
			else if(data.name === "rt"){
				command = new LG.RtCommand({"amount":data.amount});
			}
			else if(data.name === "penup"){
				command = new LG.PenUpCommand();
			}
			else if(data.name === "pendown"){
				command = new LG.PenDownCommand();
			}
			else if(data.name === "bg"){
				command = new LG.BgCommand({"color":data.color});
			}
			else if(data.name === "color"){
				command = new LG.ColorCommand({"color":data.color});
			}
			else if(data.name === "thick"){
				command = new LG.ThicknessCommand({"amount":data.amount});
			}
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
		var tree;
		try {
			tree = LG.Utils.logoparser.parse(logo);
		}
		catch(e){
			console.log("Error "+JSON.stringify(e));
			this.showError(e.expected, e.line, e.offset);
			this.active = false;
		}
		if(tree){
			console.log(JSON.stringify(tree));
			try{
				this.process(tree);
			}
			catch(e){
				console.log("e: "+e);
			}
		}
		// TODO put this in a worker?
	},
	showError:function(expected, line, offset){
		LG.EventDispatcher.trigger(LG.Events.ERROR_ROW, expected, line, offset);
	},
	process:function(tree){
		this.worker = new Worker(LG.Config.PARSER_VISIT);
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
		setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
	},
	capture:function(){
		var context, data, tempCanvas, tempContext, img, x0, y0;
		context = this.canvas.getContext("2d");
		x0 = Math.max(0, (this.canvas.width - LG.CanvasView.SNAPSHOT_WIDTH)/2 );
		y0 = (this.canvas.height - LG.CanvasView.SNAPSHOT_HEIGHT)/2;
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
		this.ended = true;
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
				command.execute(this.commands, this.position);
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

