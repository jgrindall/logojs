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


// ipad

LG.IPadCreate = function(){
	LG.ACreate.apply(this, arguments);
};

LG.IPadCreate.prototype = Object.create(LG.ACreate.prototype);
LG.IPadCreate.prototype.constructor = LG.IPadCreate;

LG.IPadCreate.prototype.loadButton = function(){
	return new LG.IPadLoadButtonView ();
};

LG.IPadCreate.prototype.storage = function(){
	return new LG.IPadStorage();

};

LG.IPadCreate.prototype.launcher = function(){
	return new LG.IPadLauncher();
};

LG.IPadCreate.prototype.loginButton = function(){
	return new LG.IPadLoginButtonView();
};

LG.IPadCreate.prototype.userModel = function(){
	return new LG.IPadUserModel();
};

LG.IPadCreate.prototype.fileCollection = function(){
	return new LG.IPadFileCollection();
};

LG.IPadCreate.prototype.galleryButton = function(){
	return new LG.IPadGalleryButton();
};

// fake ipad

LG.FakeIPadCreate = function(){
	LG.ACreate.apply(this, arguments);
};

LG.FakeIPadCreate.prototype = Object.create(LG.ACreate.prototype);
LG.FakeIPadCreate.prototype.constructor = LG.FakeIPadCreate;

LG.FakeIPadCreate.prototype.loadButton = function(){
	return LG.IPadCreate.prototype.loadButton.call(this, arguments);
};

LG.FakeIPadCreate.prototype.storage = function(){
	return LG.WebCreate.prototype.storage.call(this, arguments);
};

LG.FakeIPadCreate.prototype.launcher = function(){
	return new LG.FakeIPadLauncher();
};

LG.FakeIPadCreate.prototype.loginButton = function(){
	return LG.IPadCreate.prototype.loginButton.call(this, arguments);
};

LG.FakeIPadCreate.prototype.fileCollection = function(){
	return LG.WebCreate.prototype.fileCollection.call(this, arguments);
};

LG.FakeIPadCreate.prototype.userModel = function(){
	return new LG.WebUserModel();
};

LG.FakeIPadCreate.prototype.galleryButton = function(){
	return new LG.IPadGalleryButton();
};

// make 

//alert("config "+LG.Config.PHONEGAP);

if(LG.Config.PHONEGAP === "ios"){
	LG.create = new LG.IPadCreate();
}
else if(LG.Config.FAKE_PHONEGAP){
	LG.create = new LG.FakeIPadCreate();
}
else {
	LG.create = new LG.WebCreate();
}









