
LG.APaginatedCollection  = Backbone.Collection.extend({
	
});

LG.PageModel = Backbone.Model.extend({
	defaults:{
		numPages:1,
		maxPage:1
	}
});

LG.AFileCollection  = LG.APaginatedCollection.extend({
	model:LG.FileModel,
	initialize:function(){
		this.pageModel = new LG.PageModel();
	},
	parse: function(response) {
		this.pageModel.set({"numPages":parseInt(response.numPages, 10), "maxPage":parseInt(response.maxPage, 10)});
		return response.files;
	},
	getByProperty:function(propName, propVal){
		var selectedModel = null;
		this.each( function(model){
			console.log("getByProperty "+propName+"  "+propVal+"      =?     "+model.get(propName));
			if(model.get(propName) == propVal){
				selectedModel = model;
			}
		});
		return selectedModel;
	},
	getByName:function(name){
		return this.getByProperty("name", name);
	},
	getById:function(id){
		return this.getByProperty("_id", id);
	},
	nextPage:function(){
		var c = this.pageModel.get("numPages");
		if(  (c + 1) <= this.pageModel.get("maxPage")){
			this.pageModel.set({"numPages": c + 1});
			this.start();
		}
	},
	getData:function(){
		var options = {};
		options.userId = LG.userModel.get("userId");
		options.numPages = this.pageModel.get("numPages");
		options.perPage = 24;
		return options;
	},
	start:function(){
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
	if(ws.length === 0){
		return false;
	}
	return true;
};






LG.FileCollection = LG.AFileCollection.extend({
	url:"/files",
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change:loggedIn", $.proxy(this.onLoginChanged, this));
		this.restart();
	},
	onLoginChanged:function(){
		var loggedIn = LG.userModel.get("loggedIn");
		alert("log in change "+loggedIn);
		if(!loggedIn){
			this.restart();
		}
		else{
			this.start();
		}
	},
	restart:function(options){
		LG.Utils.log("restart files");
		options = _.extend({"logo":null}, options);
		// this.stopListening(this.selected);
		this.selected = new LG.FileModel(options);
		alert("RESTARTED");
		this.trigger("sync");
		this.trigger("change");
	},
	isSaved:function(){
		return this.selected.isSaved();
	},
	logoChanged:function(){
		this.trigger("change");
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
		this.selected = model;
		var logo = model.get("logo");
		this.selected.set({"logo":logo});
		this.selected.trigger("autochange:logo");
		this.trigger("change");
	},
	loadById:function(id){
		alert("laod by id "+id);
		var selectedModel = this.getById(id);
		console.log("selectedModel "+selectedModel+"  "+JSON.stringify(selectedModel.toJSON()));
		if(selectedModel){
			if(this.selected === selectedModel){
				LG.Utils.growl("File already open");
				LG.router.navigate("write", {"trigger":true});
			}
			else{
				this.loadModel(selectedModel);
			}
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
		if(!this.selected){
			return;
		}
		else{
			var options = {
				"success":function(){
					LG.Utils.growl("File deleted");
				}
			};
			this.selected.destroy(options);
			this.restart();
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
		namedModel = this.getByName(name);
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
		if(LG.userModel.isConnected()){
			userId = LG.userModel.get("userId");
			console.log(userId+"  =?  "+JSON.stringify(this.getById(id).toJSON()));
			yours = (this.getById(id).get("userId") === userId);
		}
		LG.Utils.log("-- all load "+id+" "+yours);
		if(yours){
			LG.fileCollection.loadById(id);
			return;
		}
		else{
			oldModel = this.getById(id);
			model = oldModel.toJSON();
			alert("oldModel "+JSON.stringify(model));
			LG.fileCollection.restart({"logo":model.logo, "dino":model.dino});
			LG.router.navigate("write", {"trigger":true});
		}
	}
});



