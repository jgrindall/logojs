

LG.FileOpener = function(){

};

LG.FileOpener.prototype.open = function(id){
	var oldModel, yours = false, userId;
	oldModel = LG.fileCollection.getByProperty("_id", id);
	if(!oldModel){
		// doesn't exist at all!
		return;
	}
	if(!LG.userModel.isConnected()){
		// not logged in
		LG.fileCollection.openOthers(oldModel.toJSON());
	}
	else{
		userId = LG.userModel.get("userId");
		yours = (oldModel.get("userId") === userId && LG.fileCollection.getByProperty("_id", id) !== null);
		if(yours){
			LG.fileCollection.loadById(id);
		}
		else{
			LG.fileCollection.openOthers(oldModel.toJSON());
		}
	}
};

LG.fileOpener = new LG.FileOpener();
