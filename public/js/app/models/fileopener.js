

LG.FileOpener = function(){
	_.extend(this, Backbone.Events);
};

LG.FileOpener.prototype.open = function(id){
	//LG.Utils.log("open "+id);
	//LG.Utils.log(JSON.stringify(LG.fileCollection)+"   ("+LG.fileCollection.length+")");
	var oldModel, oldModelYours, yours = false, userId;
	oldModel = LG.allFilesCollection.getByProperty("_id", id);
	oldModelYours = LG.fileCollection.getByProperty("_id", id);
	if(!oldModel && !oldModelYours){
		// doesn't exist at all!
		return;
	}
	if(!LG.userModel.isConnected()){
		// not logged in at all
		LG.fileCollection.openOthers(oldModel.toJSON());
	}
	else{
		userId = LG.userModel.get("userId");
		//LG.Utils.log("else");
		if(oldModelYours && oldModelYours.get("userId") === userId){
			//LG.Utils.log(JSON.stringify(LG.fileCollection)+"   ("+LG.fileCollection.length+")");
			//LG.Utils.log("LOADING...");
			LG.fileCollection.loadById(id);
			//LG.Utils.log(JSON.stringify(LG.fileCollection)+"   ("+LG.fileCollection.length+")");
		}
		else{
			LG.fileCollection.openOthers(oldModel.toJSON());
		}
	}
};

LG.FileOpener.prototype.openFile = function(){
	LG.router.navigate("write/"+this.id, {"trigger":true});
};

LG.FileOpener.prototype.alertOk = function(){
	LG.fileCollection.save({
		"success":function(){
			//LG.Utils.log("saved  "+JSON.stringify(LG.fileCollection)+"   ("+LG.fileCollection.length+")");
		},
		"error":function(){
			//LG.Utils.log("fail");
		}
	});
};

LG.FileOpener.prototype.alertNo = function(){
	LG.fileCollection.reloadCurrent();
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.alertCancel = function(){
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.modelSynced = function(){
	//LG.Utils.log("ms stop listening to fc");
	//LG.Utils.log(JSON.stringify(LG.fileCollection)+"   ("+LG.fileCollection.length+")");
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.newFile = function(){
	LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
	LG.fileCollection.addNewModel({"force":true});
};

LG.FileOpener.prototype.openFromGallery = function(id){
	var options, currentId;
	this.id = id;
	currentId = LG.fileCollection.selected.get("_id");
	if(currentId === id){
		LG.sounds.playError();
		LG.Utils.growl("File already open");
		window.history.back();
	}
	else if(LG.userModel.isConnected()){
		if(!LG.fileCollection.selected.isSaved()){
			options = {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) };
			LG.popups.openPopup({"message":LG.Messages.SAVE_HEADER, "body":LG.Messages.WANT_TO_SAVE, "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, options);
			//LG.Utils.log("listening to fc, sel is "+JSON.stringify(LG.fileCollection.selected));
			this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
		}
		else{
			this.openFile();
		}
	}
	else{
		this.openFile();
	}
};
