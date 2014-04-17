
LG.PageModel = Backbone.Model.extend({
	defaults:{
		numPages:1,
		maxPage:1
	}
});


LG.APaginatedCollection  = Backbone.Collection.extend({
	model:LG.FileModel,
	initialize:function(){
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
	load:function(){
		this.reset();
		var options = {"data" : this.getData() , "processData" : true};
		LG.spinnerModel.set({"show":true});
		options.success = function(){
			setTimeout(function(){
				LG.spinnerModel.set({"show":false});
			},
			2000);
		};
		this.fetch(options);
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
		this.listenTo(this, "sync", $.proxy(this.onSync, this));
		this.addTempModel();
	},
	addTempModel:function(options){
		if(options && options.force){
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new LG.FileModel({"dirty":true});
		}
		this.add(this.selected);
	},
	onSync:function(){
		alert("sync");
		this.addTempModel();
	},
	onLoginChanged:function(){
		var loggedIn = LG.userModel.get("loggedIn");
		alert("log in change "+loggedIn);
		if(!loggedIn){
			this.reset();
			this.addTempModel({"force":true});
		}
		else{
			alert("load your files");
			this.load();
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
		data = {"logo":model.logo, "dino":model.dino};
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
		alert("load by id "+id);
		var selectedModel;
		if(this.selected.get("_id") === id){
			LG.Utils.growl("File already open");
		}
		else{
			selectedModel = this.getByProperty("_id", id);
			this.loadModel(selectedModel);
		}
		LG.router.navigate("write", {"trigger":true});
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
	getNextName:function(name){
		if(this.nameOk(name)){
			return name;
		}
		var i = 1;
		while(!this.nameOk(name+""+i)){
			i++;
		}
		return name+""+i;
	},
	nameOk:function(name){
		LG.Utils.log("nameOk "+name);
		var ok = true;
		if(!LG.AFileCollection.validateFileName(name)){
			LG.Utils.growl("Please enter a valid filename");
			return false;
		}
		this.each( function(model){
			if(model.get("name") === name){
				ok = false;
			}
		});
		return ok;
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
		alert("load by id all "+id);
		var _this = this, oldModel, model, data, newName, options, yours = false, userId;
		oldModel = this.getByProperty("_id", id);
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
			alert("oldModel "+JSON.stringify(model));
			LG.fileCollection.openOthers(model);
			LG.router.navigate("write", {"trigger":true});
		}
	}
});



