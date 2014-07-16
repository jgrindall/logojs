// extends Backbone.Model

LG.ImageModel = Backbone.Model.extend({

});



LG.UndoRedoFileModel = Backbone.Model.extend({
	initialize: function(data){
		this.restart();
		this.editing = false;
		this.listenTo(this, "change:logo change:dino", $.proxy(this.modelChanged, this));
	},
	restart:function(options){
		this.history = [  this.getValues()  ];
		this.pointer = 0;
	},
	getValues : function(){
		var obj = {};
		obj["logo"] = this.get("logo");
		obj["dino"] = this.get("dino");
		return obj;
	},
	saveState:function(){
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
	modelChanged:function(){
		if(this.editing){
			return;
		}
		this.saveState();
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
		//LG.Utils.log("undo "+this.id+"    :  "+this.canUndo()+"  "+this.pointer);
		if(!this.canUndo()){
			return;
		}
		this.pointer = this.pointer - 1;
		this.reload();
	},
	redo:function(){
		//LG.Utils.log("redo "+this.canRedo()+"  "+this.pointer);
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
		var callbacks = {"success":$.proxy(this.saveSuccess, this, options), "fail":$.proxy(this.saveFail, this, options)};
		var id = ( this.get("_id") || LG.Utils.getUuid() );
		this.set(_.extend(data, {"_id":id}));
		LG.fileSystem.saveFile(this, callbacks);
    },
    fetchSuccess:function(files){
    	this.set(files[0]);
    },
    fetchFail:function(){
    	
    },
    fetch:function(){
    	var callbacks = {"success":$.proxy(this.fetchSuccess, this), "fail":$.proxy(this.fetchFail, this)};
    	LG.fileSystem.fetchFile(this, callbacks);
    },
    destroy:function(options){
    	//LG.Utils.log("ipad destroy");
    	var callbacks = {"success":$.proxy(this.deleteSuccess, this, options), "fail":$.proxy(this.deleteFail, this, options)};
    	LG.fileSystem.deleteFile(this, callbacks);
    },
    deleteSuccess:function(options){
    	options.success();
    },
    deleteFail:function(options){
    	options.fail();
    },
    saveSuccess:function(options){
    	//LG.Utils.log("ipad model saveSuccess!!\n\n");
    	var id = this.get("_id");
    	var response = {"_id":id};
    	this.set({"dirty":false});
    	options.success(this, response);
    	this.trigger("change");
    	//LG.Utils.log("TRIGGE SYNC");
    	this.trigger("sync");
    },
    saveFail:function(options){
    	LG.Utils.log("saveFail");
    	options.error();
    }
});
