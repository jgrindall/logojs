// extends Backbone.Model

LG.ImageModel = Backbone.Model.extend({

});

LG.FileModel = Backbone.Model.extend({
	defaults:{
		name:"",
		logo:"",
		id:null,
		votes:0,
		userid:null,
		img:null
	},
	urlRoot:"index.php/pages/files",
	
	initialize:function(){
		this.listenTo(this, "save", $.proxy(this.synced, this));
		this.listenTo(this, "error", $.proxy(this.error, this));
	},
	error:function(model, xhr, options){
		var response = $.parseJSON(xhr.responseText);
		LG.Utils.growl("Error: "+response.error);
	},
	synced:function(e){
		LG.Utils.growl("File saved");
		LG.fileCollection.currentLogo = this.get("logo");
	}
});

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
		return this.getByProperty("id", parseInt(id, 10));
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
		options.userid = LG.userModel.get("userid");
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
	url:"index.php/pages/files",
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.selected = null;
		this.currentLogo = null;
		this.listenTo(LG.logoModel, "change:logo autochange:logo", $.proxy(this.logoChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESTART, $.proxy(this.restart, this));
	},
	restart:function(options){
		LG.Utils.log("restart files");
		options = _.extend({"logo":""}, options);
		this.selected = null;
		this.currentLogo = options.logo;
		this.trigger("sync");
	},
	isSaved:function(){
		if(this.selected){
			return (this.currentLogo == this.selected.get("logo") );
		}
		return false;
	},
	logoChanged:function(){
		this.currentLogo = LG.logoModel.get("logo");
		this.trigger("change");
	},
	save:function(options){
		if(LG.userModel.isConnected()){
			if(this.selected){
				this.saveCurrentFile(options);
			}
			else{
				LG.router.navigate("filename", {"trigger":true});
			}
		}
		else{
			LG.popups.openPopup({"message":"Please log in"});
		}
	},
	loadModel:function(model){
		alert("load Model "+JSON.stringify(model.toJSON()));
		this.selected = model;
		var logo = model.get("logo");
		LG.logoModel.set({"logo":logo});
		LG.logoModel.trigger("autochange:logo");
		this.currentLogo = logo;
		this.trigger("change");
	},
	loadById:function(id){
		alert("laod by id "+id);
		this.id = parseInt(id, 10);
		var selectedModel = this.getById(this.id);
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
			return (this.selected.get("id")===id);
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
					LG.EventDispatcher.trigger(LG.Events.RESTART);
				}
			};
			this.selected.destroy(options);
		}
	},
	saveCurrentFile:function(options){
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		var data = {"img":LG.imageModel.get("img"),"logo":LG.logoModel.get("logo"),"userid":LG.userModel.get("userid")};
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
		data = {"name":name, "logo":LG.logoModel.get("logo"), "img":LG.imageModel.get("img"), "userid":LG.userModel.get("userid")};
		options = {
			"success":function(model, response, options){
				_this.add(model);
				_this.loadById(model.get("id"), false);
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
	url:"index.php/pages/files",
	initialize:function(){
		this.page = 0;
		this.num = 0;
		LG.AFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		return _.extend(LG.AFileCollection.prototype.getData.call(this), {"userid": null});
	},
	loadById:function(id, check){
		var _this = this, oldModel, model, data, newName, options, yours;
		yours = (LG.fileCollection.getById(id) !== null);
		LG.Utils.log("all load "+id+" "+yours);
		if(yours){
			LG.fileCollection.loadById(id, check);
			return;
		}
		else{
			oldModel = this.getById(id);
			LG.EventDispatcher.trigger(LG.Events.RESTART, {"logo":oldModel.get("logo")});
			LG.router.navigate("write", {"trigger":true});
		}
	}
});



