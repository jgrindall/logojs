LG.LogoModel = Backbone.Model.extend({
	initialize: function(){
		this.restart();
		this.listenTo(this, "change:logo", $.proxy(this.modelChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESTART, $.proxy(this.restart, this));
	},
	restart:function(options){
		options = _.extend({"logo":""}, options);
		this.set({"logo":options.logo, "history":[ options.logo ], "pointer":0});
		this.trigger("autochange:logo");
	},
	modelChanged:function(){
		// see where pointer is first!
		var h, p, newLogo;
		h = this.get("history");
		p = this.get("pointer");
		newLogo = this.get("logo");
		while(p < h.length - 1){
			h.pop();
		}
		if(h.length === 0){
			h.push(newLogo);
			this.set({"pointer" : 0});
		}
		else if(h.length < LG.LogoModel.MAX_HISTORY){
			h.push(newLogo);
			this.set({"pointer" : p + 1});
		}
		else{
			h.splice(0, 1);
			h.push(newLogo);
		}
	},
	canUndo:function(){
		var h, p;
		h = this.get("history");
		p = this.get("pointer");
		if(h.length === 0 || p === 0){
			return false;
		}
		return true;
	},
	canRedo:function(){
		var h, p;
		h = this.get("history");
		p = this.get("pointer");
		if(h.length === 0 || p === h.length - 1){
			return false;
		}
		return true;
	},
	undo:function(){
		var h, p;
		if(!this.canUndo()){
			return;
		}
		h = this.get("history");
		p = this.get("pointer");
		this.set({"pointer" : p - 1, "logo":h[p - 1]}, {silent:true});
		this.trigger("autochange:logo");
	},
	redo:function(){
		var h, p;
		if(!this.canRedo()){
			return;
		}
		h = this.get("history");
		p = this.get("pointer");
		this.set({"pointer" : p + 1, "logo":h[p + 1]}, {silent:true});
		this.trigger("autochange:logo");
	}	
});

LG.LogoModel.MAX_HISTORY = 50;




