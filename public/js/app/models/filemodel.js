// extends Backbone.Model

LG.ImageModel = Backbone.Model.extend({

});



LG.UndoRedoFileModel = Backbone.Model.extend({
	initialize: function(){
		this.restart();
		this.editing = false;
		this.listenTo(this, this.getWatchString(), $.proxy(this.modelChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
	},
	getWatchString:function(){
		var i, s = [ ];
		for(i = 0;i <= this.watchString.length - 1;i++){
			s.push ("change:"+this.watchString[i]);
		}
		return s.join(" ");
	},
	restart:function(options){
		this.history = [  { "logo":null, "dino":0 }  ];
		this.pointer = 0;
	},
	getValues : function(){
		var i, obj = {};
		for(i = 0;i <= this.watchString.length - 1;i++){
			obj[this.watchString[i]] = this.get(this.watchString[i]);
		}
		return obj;
	},
	modelChanged:function(){
		if(this.editing){
			return;
		}
		var h, p, newValue;
		h = this.history;
		p = this.pointer;
		newValues = this.getValues();
		while(p < h.length - 1){
			h.pop();
		}
		if(h.length === 0){
			h.push(newValues);
			this.pointer = 0;
		}
		else if(h.length < LG.UndoRedoFileModel.MAX_HISTORY){
			h.push(newValues);
			this.pointer = p + 1;
		}
		else{
			h.splice(0, 1);
			h.push(newValues);
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
	reload:function(){
		this.editing = true;
		this.set(this.history[this.pointer]);
		this.trigger("change");
		this.editing = false;
	},
	undo:function(){
		if(!this.canUndo()){
			return;
		}
		this.pointer = this.pointer - 1;
		this.reload();
	},
	redo:function(){
		if(!this.canRedo()){
			return;
		}
		this.pointer = this.pointer + 1;
		this.reload();
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
	watchString:["logo","dino"],
	idAttribute: "_id", 
	urlRoot:function(){
		return LG.baseUrl + "/files";
	},
	initialize:function(data){
		LG.UndoRedoFileModel.prototype.initialize.call(this);
		this.dirty = false;
		if(data && data.dirty){
			this.dirty = true;
		}
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
		d2 = (d1 + 1) % LG.GraphicsModel.BG.length;
		this.set({"dino":d2});
	},
	reset:function(){
		this.set({"logo":""});
	},
	isSaved:function(){
		var saved = !this.dirty;
		return saved;
	},
	onChanged:function(){
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
		this.dirty = false;
		this.trigger("change");
	},
	isNew:function(){
		var id = this.get("_id");
		if(id){
			return false;
		}
		return true;
	}
});



LG.IPadFileModel = LG.FileModel.extend({
	save:function(data, options){
		console.log("saving model "+JSON.stringify(this)+"  "+data+"  "+options);
		console.log("1  "+$.proxy(this.saveSuccess, this, options));
		console.log("2  "+$.proxy(this.saveFail, this, options));
		var callbacks = {"success":$.proxy(this.saveSuccess, this, options), "fail":$.proxy(this.saveFail, this, options)};
		console.log("callbacks "+JSON.stringify(callbacks));
		console.log("callbacks "+callbacks);
		console.log("a "+callbacks.success);
		console.log("b "+callbacks.fail);
		var id = ( this.get("_id") || LG.Utils.getUuid() );
		this.set({"_id":id});
		LG.fileSystem.saveFile(this, callbacks);
    },
    destroy:function(options){
    	//alert("deleting model");
    	var callbacks = {"success":$.proxy(this.deleteSuccess, this, options), "fail":$.proxy(this.deleteFail, this, options)};
    	LG.fileSystem.deleteFile(this, callbacks);
    },
    deleteSuccess:function(options){
    	console.log("deleteSuccess");
    	options.success();
    },
    deleteFail:function(options){
    	console.log("deleteFail");
    	options.fail();
    },
    saveSuccess:function(options){
    	console.log("saveSuccess!!! yay");
    	var id = this.get("_id");
    	var response = {"_id":id};
   		options.success(this, response);
    },
    saveFail:function(options){
    	options.error();
    }
});
