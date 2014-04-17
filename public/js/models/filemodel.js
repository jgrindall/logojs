// extends Backbone.Model

LG.ImageModel = Backbone.Model.extend({

});



LG.UndoRedoFileModel = Backbone.Model.extend({
	initialize: function(){
		this.restart();
		this.listenTo(this, "change:"+this.watchString, $.proxy(this.modelChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
	},
	restart:function(options){
		this.history = [ "" ];
		this.pointer = 0;
	},
	modelChanged:function(){
		// see where pointer is first!
		var h, p, newValue;
		h = this.history;
		p = this.pointer;
		newValue = this.get(this.watchString);
		while(p < h.length - 1){
			h.pop();
		}
		if(h.length === 0){
			h.push(newValue);
			this.pointer = 0;
		}
		else if(h.length < LG.UndoRedoFileModel.MAX_HISTORY){
			h.push(newValue);
			this.pointer = p + 1;
		}
		else{
			h.splice(0, 1);
			h.push(newValue);
		}
	},
	canUndo:function(){
		if(this.history.length === 0 || this.pointer === 0){
			return false;
		}
		return true;
	},
	canRedo:function(){
		if(this.history.length === 0 || this.pointer === this.history.length - 1){
			return false;
		}
		return true;
	},
	undo:function(){
		if(!this.canUndo()){
			return;
		}
		this.pointer = this.pointer - 1;
		// set logo as this.history[this.pointer];
	},
	redo:function(){
		var h, p;
		if(!this.canRedo()){
			return;
		}
		this.pointer = p + 1;
		// set logo as this.history[this.pointer];
	}	
});

LG.UndoRedoFileModel.MAX_HISTORY = 20;

LG.FileModel = LG.UndoRedoFileModel.extend({
	defaults:{
		name:null,
		logo:null,
		votes:0,
		userId:null,
		img:null,
		dino:0
	},
	watchString:"logo",
	idAttribute: "_id", 
	urlRoot:"/files",
	initialize:function(){
		LG.UndoRedoFileModel.prototype.initialize.call(this);
		this.dirty = true;
		this.listenTo(this, "save sync", $.proxy(this.synced, this));
		this.listenTo(this, "error", $.proxy(this.error, this));
		this.listenTo(this, "change:logo change:dino", $.proxy(this.onChanged, this));
	},
	parse:function(data){
		delete data._v;
		delete data.success;
		return data;
	},
	incrementDino:function(){
		var d1, d2;
		d1 = this.get("dino");
		d2 = (d1 + 1) % LG.FileModel.NUM_DINO;
		this.set({"dino":d2});
	},
	reset:function(){
		this.set({"logo":""});
	},
	isSaved:function(){
		var saved = !this.dirty;
		console.log(">>>  isSaved "+saved);
		return saved;
	},
	canUndo:function(){
		return false;
	},
	canRedo:function(){
		return false;
	},
	onChanged:function(){
		alert("dirty, saved!!");
		this.dirty = true;
	},
	parse: function(data) {
		return data;
	},
	error:function(model, xhr, options){
		var response = $.parseJSON(xhr.responseText);
		LG.Utils.growl("Error: "+response.error);
	},
	synced:function(e){
		alert("syncved");
		this.dirty = false;
		this.trigger("change");
	}
});



LG.FileModel.NUM_DINO = 5;
