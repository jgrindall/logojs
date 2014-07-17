
LG.CanvasView = Backbone.View.extend({
	
	initialize:function(){
		this.listenTo(LG.EventDispatcher,	LG.Events.TICK,					$.proxy(this.tick, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_DRAW,			$.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_STOP,			$.proxy(this.stop, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.FORCE_STOP,			$.proxy(this.stop, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESIZE,				$.proxy(this.onResize, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESET_CANVAS,			$.proxy(this.reset, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.PAUSE,				$.proxy(this.pause, this));
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
	pause:function(){
		this.stop();
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
		var s = LG.layoutModel.get("show");
		console.log(s+" "+this.working);
		if(s === "write" || s === "writebar"){
			if(this.working){
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
		LG.canvasModel.set({"width":w, "height":h});
		this.tick();
	},
	afterAdded:function(){
		this.makeCanvas();
		this.addChildren();
		this.reset();
	},
	makeCanvas:function(){
		this.turtlecanvas = document.getElementById("turtlecanvas");
		this.bgcanvas = document.getElementById("bgcanvas");
		this.commandscanvas = document.getElementById("commandscanvas");
		this.backingcanvas = document.getElementById("backingcanvas");
		this.$turtlecanvas = $(this.turtlecanvas);
		this.$bgcanvas = $(this.bgcanvas);
		this.$backingcanvas = $(this.backingcanvas);
		this.$commandscanvas = $(this.commandscanvas);
	},
	removeAllChildren:function(){
		this.turtlestage.removeAllChildren();
		this.commandsstage.removeAllChildren();
		this.bgstage.removeAllChildren();
		// clear up
	},
	makeStages:function(){
		this.turtlestage = new createjs.Stage(this.turtlecanvas);
		this.turtlestage.snapToPixelEnabled = true;
		this.bgstage = new createjs.Stage(this.bgcanvas);
		this.commandsstage = new createjs.Stage(this.commandscanvas);
		this.backingstage = new createjs.Stage(this.backingcanvas);
		this.commandsstage.snapToPixelEnabled = true;
	},
	makeTurtle:function(){
		this.turtle = new LG.Easel.Turtle(LG.CanvasModel.DEFAULT_TURTLE_SIZE);
		this.turtlecontainer = new createjs.Container();
		this.turtlecontainer.addChild(this.turtle);
		this.turtlestage.addChild(this.turtlecontainer);
	},
	makeBacking:function(){
		this.backingcontainer = new createjs.Container();
		this.backingstage.addChild(this.backingcontainer);
		this.backingstage.addChild(this.bmpcontainer);
	},
	makeBg:function(){
		this.bg = new LG.Easel.Bg();
		this.bmpcontainer = new createjs.Container();
		this.bgstage.addChild(this.bg);
		this.bgstage.addChild(this.bmpcontainer);
	},
	makeCommands:function(){
		this.commands = new LG.Easel.Commands();
		this.commandscontainer = new createjs.Container();
		this.commandscontainer.addChild(this.commands);
		this.commandsstage.addChild(this.commandscontainer);
	},
	addChildren:function(){
		this.makeStages();
		this.makeTurtle();
		this.makeBacking();
		this.makeBg();
		this.makeCommands();
		this.reset();
	},
	reset:function(){
		this.stop();
		var w = LG.canvasModel.get("width");
		var h = LG.canvasModel.get("height");
		this.$(".easelcanvas").attr("width", w).attr("height", h);
		this.position = {"theta":-Math.PI/2, x:w/2 - 100, y:h/2, "pen":"down", "bg":LG.graphicsModel.getBg(), "color":LG.graphicsModel.getInner(), "thickness":LG.CanvasModel.DEFAULT_THICKNESS};
		this.commands.graphics.clear();
		this.bmpcontainer.removeAllChildren();
		this.backingcontainer.removeAllChildren();
		this.tick();
	},
	tick:function(){
		if(this.turtle && this.position){
			this.turtle.x = this.position.x;
			this.turtle.y = this.position.y;
			this.turtle.rotation = this.position.theta*180/Math.PI;
			this.turtle.drawMe(this.position.color);
		}
		if(this.bg && this.position){
			this.bg.drawMe(this.position.bg);
		}
		this.turtlestage.update();
		this.bgstage.update();
		this.commandsstage.update();
		this.backingstage.update();
	},
	stop:function(){
		if(this.working){
			LG.Utils.growl("Finished!");
			this.worker.terminate();
			this.working = false;
			this.flush();
		}
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
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
			this.outputNum ++; 
			command.execute(this.commands, this.position);
			var mod = this.outputNum % LG.CanvasModel.FLUSH_NUM;
			if(mod === 0){
				this.flush();
			}
			if(this.outputNum >= LG.CanvasModel.MAX_SIZE){
				this.stop();
			}
		}
		else if(data.type === "message"){
			this.onError(data);
		}
		else if(data.type === "end"){
			this.stop();
		}
	},
	draw:function(){
		this.reset();
		this.bmpcontainer.removeAllChildren();
		this.outputNum = 0;
		var logo = LG.fileCollection.selected.get("logo");
		var tree;
		try {
			tree = LG.Utils.logoparser.parse(logo);
		}
		catch(e){
			this.showError(e.expected, e.line, e.offset);
		}
		if(tree){
			LG.EventDispatcher.trigger(LG.Events.TO_BAR);
			try{
				this.process(tree);
			}
			catch(e){
				LG.Utils.log("e: "+e);
			}
		}
	},
	showError:function(expected, line, offset){
		LG.EventDispatcher.trigger(LG.Events.ERROR_ROW, expected, line, offset);
	},
	onError:function(obj){
		this.stop();
		LG.EventDispatcher.trigger(LG.Events.ERROR_RUNTIME, obj.message);
	},
	process:function(tree){
		this.working = true;
		this.worker = new Worker(LG.Config.PARSER_VISIT);
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.onerror = $.proxy(this.onError, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
	},
	capture:function(){
		var context, data, tempCanvas, tempContext, img, x0, y0;
		context = this.bgcanvas.getContext("2d");
		x0 = Math.max(0, (this.bgcanvas.width - LG.CanvasModel.SNAPSHOT_WIDTH)/2 );
		y0 = (this.bgcanvas.height - LG.CanvasModel.SNAPSHOT_HEIGHT)/2;
		y0 = Math.max(0, y0 - LG.CanvasModel.SNAPSHOT_HEIGHT/3);
		data = context.getImageData(x0, y0, LG.CanvasModel.SNAPSHOT_WIDTH, LG.CanvasModel.SNAPSHOT_HEIGHT);
		tempCanvas = document.createElement("canvas");
		tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = LG.CanvasModel.SNAPSHOT_WIDTH;
		tempCanvas.height = LG.CanvasModel.SNAPSHOT_HEIGHT;
		tempContext.putImageData(data, 0, 0);
		img = tempCanvas.toDataURL("image/png");
		LG.imageModel.set({"img":img});
	},
	flush:function(){
		this.tick();
		var backingFlush = new createjs.Bitmap(this.backingcanvas);
		var flushbmp = new createjs.Bitmap(this.commandscanvas);
		flushbmp.cache(0, 0, this.bgcanvas.width, this.bgcanvas.height);
		backingFlush.cache(0, 0, this.bgcanvas.width, this.bgcanvas.height);
		this.backingcontainer.removeAllChildren();
		this.backingcontainer.addChild(backingFlush);
		this.backingcontainer.addChild(flushbmp);
		this.commands.graphics.clear();
	},
	beforeClose:function(){
	
	}
});


LG.CanvasModel = Backbone.Model.extend({
	defaults:{
		width:1024,
		height:768
	}
});

LG.CanvasModel.SNAPSHOT_WIDTH = 300;
LG.CanvasModel.SNAPSHOT_HEIGHT = 300;
LG.CanvasModel.MAX_SIZE = 50000;
LG.CanvasModel.FLUSH_NUM = 250;
LG.CanvasModel.DEFAULT_THICKNESS = 7;
LG.CanvasModel.DEFAULT_TURTLE_SIZE = 14;


