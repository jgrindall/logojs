

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
				// TODO console.log("logo was " + logo+" & "+dino+", do I need to load it again?");
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
		if(LG.userModel.isConnected()){
			if(!this.selected.isNew()){
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
		if(this.selected){
			this.remove(this.selected);
		}
		this.selected = model;
		this.trigger("change");
	},
	loadById:function(id){
		var selectedModel;
		if(this.selected.get("_id") === id){
			LG.Utils.growl("File already open");
		}
		else{
			selectedModel = this.getByProperty("_id", id);
			if(selectedModel){
				this.loadModel(selectedModel);
			}
			LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
		}
	},
	deleteCurrentFile:function(callback){
		var _this = this;
		var options = {
			"success":function(){
				LG.Utils.growl("File deleted");
				_this.addNewModel({"force":true});
				callback.success();
			},
			"fail":function(){
				alert("error deleting");
			}
		};
		if(this.selected.isNew()){
			this.selected.set({"logo":null});
		}
		else{
			var m = this.selected;
			this.selected.destroy(options);
		}
	},
	saveCurrentFile:function(options){
		console.log(">>>>>>>>>  save current file");
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		var data = {"img":LG.imageModel.get("img"),"logo":LG.fileCollection.selected.get("logo"),"userId":LG.userModel.get("userId")};
		LG.Utils.log("save "+JSON.stringify(data));
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
	saveFileAs:function(name, callback){
		console.log("saveFileAs "+name+"  "+callback);
		var _this = this, model, data, options;
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		data = {"dino":LG.fileCollection.selected.get("dino"), "name":name, "logo":LG.fileCollection.selected.get("logo"), "img":LG.imageModel.get("img"), "userId":LG.userModel.get("userId")};
		model = new this.model(data);
		options = {
			"success":function(model, response){
				console.log("success called "+model+",   "+response+"  "+response._id);
				model.set({"_id":response._id});
				model.set({"id":response._id});
				_this.add(model);
				callback.success(response._id);
			},
			"error":function(){
				LG.router.openErrorPage({"cancel":function(){
					LG.router.navigate("write", {"trigger":true});
				}});
			}
		};
		model.save(data, options);
	}
});



LG.IPadFileCollection = LG.FileCollection.extend({
	model:LG.IPadFileModel,
	fetch:function(){
		LG.fileSystem.readFiles({"success":$.proxy(this.readSuccess, this), "fail":$.proxy(this.readFail, this)});
	},
	readSuccess:function(entries) {
		if(entries){
    		this.reset(entries);
    	}
    	console.log("reset! "+this.length);
	},
	readFail:function(error) {
   		alert("Failed to list directory contents: " + error.code);
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


