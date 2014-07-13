

LG.FileOpener = function(){
	_.extend(this, Backbone.Events);
};

LG.FileOpener.prototype.open = function(id){
	var oldModel, oldModelYours, yours = false, userId;
	oldModel = LG.allFilesCollection.getByProperty("_id", id);
	oldModelYours = LG.fileCollection.getByProperty("_id", id);
	if(!oldModel && !oldModelYours){
		// doesn't exist at all!
		console.log("error opening file");
		return;
	}
	if(!LG.userModel.isConnected()){
		// not logged in at all
		console.log("open others");
		LG.fileCollection.openOthers(oldModel.toJSON());
	}
	else{
		userId = LG.userModel.get("userId");
		if(oldModelYours && oldModelYours.get("userId") === userId){
			console.log("yours");
			LG.fileCollection.loadById(id);
		}
		else{
			console.log("not yours");
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
			
		},
		"error":function(){
			
		}
	});
};

LG.FileOpener.prototype.alertNo = function(){
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.alertCancel = function(){
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.modelSynced = function(){
	this.stopListening(LG.fileCollection, "sync");
	this.openFile();
};

LG.FileOpener.prototype.openFromGallery = function(id){
	var options;
	this.id = id;
	if(LG.userModel.isConnected()){
		if(!LG.fileCollection.selected.isSaved()){
			options = {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) };
			LG.popups.openPopup({"message":LG.Messages.WANT_TO_SAVE, "body":LG.Messages.WANT_TO_SAVE, "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, options);
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
