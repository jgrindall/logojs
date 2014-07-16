

LG.AFileCollection  = LG.ASelectedFileCollection.extend({
	model:LG.FileModel,
	url:function(){
		return LG.baseUrl + "/files";
	},
	initialize:function(){
		LG.ASelectedFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		return data = LG.ASelectedFileCollection.prototype.getData.call(this);
	},
	load:function(options){
		var data = _.extend({"data" : this.getData() , "processData" : true}, options);
		this.fetch(data);
	}
});




LG.AFileCollection.validateFileName = function(name){
	var ws;
	if(name.length <= 2){
		return false;
	}
	ws = name.replace(/\s/g, "");
	if(ws.length <= 2){
		return false;
	}
	return true;
};



LG.FileCollection = LG.AFileCollection.extend({
	name:"your",
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change:loggedIn", $.proxy(this.onLoginChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
	},
	undo:function(){
		this.selected.undo();
	},
	redo:function(){
		this.selected.redo();
	},
	getData:function(){
		var data = LG.AFileCollection.prototype.getData.call(this);
		data.userId = LG.userModel.get("userId");
		return data;
	},
	onLoginChanged:function(){
		var logo, dino, loggedIn = LG.userModel.get("loggedIn");
		if(loggedIn){
			logo = this.selected.get("logo");
			dino = this.selected.get("dino");
			this.load({
				"success":function(){
					// TODO LG.Utils.log("logo was " + logo+" & "+dino+", do I need to load it again?");
				},
				"error":function(){
					LG.router.openErrorPage({"cancel":function(){
						LG.router.navigate("write", {"trigger":true});
					}});
				}
			});
		}
		else{
			this.reset();
			this.addNewModel({"force":true});
		}
	},
	isSaved:function(){
		return this.selected.isSaved();
	},
	logoChanged:function(){
		this.trigger("change");
	},
	openOthers:function(model){
		var newModel, data;
		// set name as null because you need to change it
		data = {"name":null, "logo":model.logo, "dino":model.dino};
		if(this.selected.isNew()){
			this.selected.set(data);
		}
		else{
			// proper file is open
			this.selected = new this.model(_.extend({}, data, {"dirty":true}));
			this.add(this.selected);
		}
		LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
	},
	save:function(options){
		//LG.Utils.log("save!!!! "+options);
		if(LG.userModel.isConnected()){
			if(!this.selected.isNew()){
				//LG.Utils.log("scf\n\n");
				this.saveCurrentFile(options);
			}
			else{
				LG.router.navigate("filename", {"trigger":true});
			}
		}
		else{
			LG.Utils.growl("Please log in to save your work");
		}
	},
	loadModel:function(model){
		if(this.selected.isNew()){
			// why!
			this.remove(this.selected);
		}
		this.selected = model;
		this.trigger("change");
	},
	loadById:function(id){
		var selectedModel;
		if(this.selected.get("_id") != id){
			selectedModel = this.getByProperty("_id", id);
			if(selectedModel){
				this.loadModel(selectedModel);
			}
			LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
		}
	},
	deleteCurrentFile:function(callback){
		LG.Utils.log("deleteCurrentFile");
		var _this = this, options;
		options = {
			"success":function(){
				LG.sounds.playSuccess();
				LG.Utils.growl("File deleted");
				_this.remove(_this.selected);
				_this.addNewModel({"force":true});
				callback.success();
			},
			"fail":function(){
				callback.fail();
			}
		};
		if(this.selected.isNew()){
			this.selected.set({"logo":null});
		}
		else{
			this.selected.destroy(options);
		}
	},
	saveCurrentFile:function(options){
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		//LG.Utils.log("saveCurrentFile selected is "+this.selected.get("logo"));
		//LG.Utils.log("this is "+JSON.stringify(this)+"  ("+ this.length +")");
		var data = {"img":LG.imageModel.get("img"),"logo":this.selected.get("logo"),"userId":LG.userModel.get("userId")};
		//LG.Utils.log("save "+JSON.stringify(data));
		this.selected.save(data, options);
	},
	nameOk:function(name){
		var error = false;
		if(!LG.AFileCollection.validateFileName(name)){
			error = "Please enter a valid filename";
		}
		else{
			this.each( function(model){
				if(model.get("name") === name){
					error = "That name is taken, please choose another filename";
				}
			});
		}
		return error;
	},
	reloadCurrent:function(){
		if(this.selected && !this.selected.isNew()){
			this.selected.fetch();
		}
	},
	saveFileAs:function(name, callback){
		var _this = this, model, data, options;
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		data = {"dino":LG.fileCollection.selected.get("dino"), "name":name, "logo":LG.fileCollection.selected.get("logo"), "img":LG.imageModel.get("img"), "userId":LG.userModel.get("userId")};
		this.selected.set(data);
		options = {
			"success":function(model, response){
				model.set({"_id":response._id});
				_this.add(model);
				callback.success(response._id);
			},
			"error":function(){
				callback.error();
			}
		};
		this.selected.save(data, options);
	}
});



LG.IPadFileCollection = LG.FileCollection.extend({
	model:LG.IPadFileModel,
	fetch:function(){
		LG.spinnerModel.set({"show":true});
		LG.fileSystem.readFiles({"success":$.proxy(this.readSuccess, this), "fail":$.proxy(this.readFail, this)});
	},
	readSuccess:function(entries) {
		if(entries){
    		this.reset(entries);
    		this.trigger("sync");
    	}
	},
	readFail:function(error) {
   		
	}
});

LG.AllFileCollection = LG.AFileCollection.extend({
	name:"all",
	initialize:function(){
		this.page = 0;
		this.num = 0;
		LG.AFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		var data = _.extend(LG.AFileCollection.prototype.getData.call(this), {"userId": null});
		return data;
	}
});


