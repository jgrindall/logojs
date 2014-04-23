

LG.FileOpener = function(){

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
			// yours!
			LG.fileCollection.loadById(id);
		}
		else{
			LG.fileCollection.openOthers(oldModel.toJSON());
		}
	}
};


