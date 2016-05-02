LG.ACreate = function(){
	
};

LG.ACreate.prototype.writeView = function(data){
	if(LG.Config.IS_TOUCH){
		return new LG.TouchWriteView(data);
	}
	else{
		return new LG.NoTouchWriteView(data);
	}
};

// web

LG.WebCreate = function(){
	LG.ACreate.apply(this, arguments);
};

LG.WebCreate.prototype = Object.create(LG.ACreate.prototype);
LG.WebCreate.prototype.constructor = LG.WebCreate;

LG.WebCreate.prototype.loadButton = function(){
	return new LG.WebLoadButtonView ();
};

LG.WebCreate.prototype.storage = function(){
	if(LG.Utils.supportsLocalStorage()){
		return new LG.WebStorage();
	}
	else if(LG.Utils.supportsCookies()){
		return new LG.CookieStorage();
	}
	else{
		return new LG.NoSupportStorage();
	}
};

LG.WebCreate.prototype.galleryButton = function(){
	return new LG.WebGalleryButton();
};

LG.WebCreate.prototype.fileCollection = function(){
	return new LG.FileCollection();
};

LG.WebCreate.prototype.launcher = function(){
	return new LG.WebLauncher();
};

LG.WebCreate.prototype.loginButton = function(){
	return new LG.WebLoginButtonView();
};

LG.WebCreate.prototype.userModel = function(){
	return new LG.WebUserModel();
};


LG.create = new LG.WebCreate();










