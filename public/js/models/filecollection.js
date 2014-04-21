
LG.PageModel = Backbone.Model.extend({
	defaults:{
		numPages:1,
		maxPage:1
	}
});

LG.SpinnerCollection  = Backbone.Collection.extend({
	initialize:function(data){
		Backbone.Collection.prototype.initialize.call(this, data);
		this.listenTo(this, "sync", $.proxy(this.onSync, this));
	},
	onSync:function(){
		console.log("synced spinner collection");
		LG.spinnerModel.set({"show":false});
	},
	fetch:function(data){
		LG.spinnerModel.set({"show":true});
		Backbone.Collection.prototype.fetch.call(this, data);
	}
});


LG.APaginatedCollection  = LG.SpinnerCollection.extend({
	model:LG.FileModel,
	initialize:function(data){
		LG.SpinnerCollection.prototype.initialize.call(this, data);
		this.pageModel = new LG.PageModel();
	},
	parse: function(response) {
		this.pageModel.set({"numPages":parseInt(response.numPages, 10), "maxPage":parseInt(response.maxPage, 10)});
		return response.files;
	},
	nextPage:function(){
		var c = this.pageModel.get("numPages");
		if(  (c + 1) <= this.pageModel.get("maxPage")){
			this.pageModel.set({"numPages": c + 1});
			this.load();
		}
	}
});


LG.AFileCollection  = LG.APaginatedCollection.extend({
	model:LG.FileModel,
	initialize:function(){
		LG.APaginatedCollection.prototype.initialize.call(this);
	},
	getData:function(){
		var options = {};
		options.userId = LG.userModel.get("userId");
		options.numPages = this.pageModel.get("numPages");
		options.perPage = 24;
		return options;
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



LG.SelectedFileCollection = LG.AFileCollection.extend({
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change:loggedIn", $.proxy(this.onLoginChanged, this));
		this.addTempModel();
	},
	addTempModel:function(options){
		if(options && options.force){
			this.remove(this.selected);
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new LG.FileModel({"dirty":false});
		}
		this.add(this.selected);
		if(options && options.force){
			LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
		}
	},
	onSync:function(){
		LG.AFileCollection.prototype.onSync.call(this);
		this.addTempModel();
	},
	onLoginChanged:function(){
		var logo, dino, loggedIn = LG.userModel.get("loggedIn");
		if(loggedIn){
			logo = this.selected.get("logo");
			dino = this.selected.get("dino");
			this.load({"success":function(){
				console.log("logo was " + logo+" & "+dino+", do I need to load it again?");
			}});
		}
		else{
			this.reset();
			this.addTempModel({"force":true});
		}
	}
});


LG.FileCollection = LG.SelectedFileCollection.extend({
	url:"/files",
	initialize:function(){
		LG.SelectedFileCollection.prototype.initialize.call(this);
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
			// proper file
			this.selected = new LG.FileModel(_.extend({}, data, {"dirty":true}));
			this.add(this.selected);
		}
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
		}
	},
	isOpen:function(id){
		if(!this.selected){
			return false;
		}
		else {
			return (this.selected.get("_id")===id);
		}
	},
	deleteCurrentFile:function(){
		var _this = this;
		var options = {
			"success":function(){
				LG.Utils.growl("File deleted");
				_this.addTempModel({"force":true});
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
		var _this = this, model, data, options, namedModel;
		namedModel = this.getByProperty("name", name);
		if(namedModel){
			LG.Utils.growl("File exists");
			return;
		}
		model = new LG.FileModel();
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		data = {"dino":LG.fileCollection.selected.get("dino"), "name":name, "logo":LG.fileCollection.selected.get("logo"), "img":LG.imageModel.get("img"), "userId":LG.userModel.get("userId")};
		options = {
			"success":function(model, response, options){
				model.set({"_id":response._id});
				_this.add(model);
				console.log("model "+JSON.stringify(model.toJSON()));
				console.log("response "+JSON.stringify(response));
				_this.loadById(response._id);
				if(callback && callback.success){
					callback.success();
				}
			},
			"error":function(model, xhr, options){
				
			}
		};
		LG.Utils.log("save as "+JSON.stringify(data));
		model.save(data, options);
	}
});


LG.AllFileCollection = LG.AFileCollection.extend({
	url:"/files",
	initialize:function(){
		this.page = 0;
		this.num = 0;
		LG.AFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		return _.extend(LG.AFileCollection.prototype.getData.call(this), {"userId": null});
	},
	loadById:function(id){
		console.log("loadById "+id);
		var _this = this, oldModel, model, data, newName, options, yours = false, userId;
		oldModel = this.getByProperty("_id", id);
		console.log(oldModel+"  "+JSON.stringify(oldModel));
		if(LG.userModel.isConnected()){
			userId = LG.userModel.get("userId");
			yours = (oldModel.get("userId") === userId);
		}
		LG.Utils.log("-- all load "+id+" "+yours);
		if(yours){
			LG.fileCollection.loadById(id);
			return;
		}
		else{
			model = oldModel.toJSON();
			LG.fileCollection.openOthers(model);
			LG.router.navigate("write", {"trigger":true});
		}
	}
});



