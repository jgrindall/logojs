// this class handles the lauching of the app

// for phonegap, dom must be ready and device ready, for web just dom ready.
// _started makes sure that the app is launched only once

LG.Launcher = function(){
	_.extend(this, Backbone.Events);
	this._launched = false;
	this._domReady = false;
	this._started = false;
	this.fbComplete = false;
	this.hash = null;
};

// bind into events
LG.Launcher.prototype.bindEvents = function(){
	$(document).bind ("ready", 		$.proxy (this.domReady, this)  );
	$(window).on("resize", $.proxy(this.onResize, this));
	$(window).on("orientationchange", $.proxy(this.onResize, this));
};

LG.Launcher.prototype.onResize = $.debounce( 500, function(){
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
});

LG.Launcher.prototype.domReady = function(){
	this._domReady = true;
	// there are two check methods, one for web and one for ipad
	if(	this.check() && !this._started){
		// if we are ready, then start by loading the html templates
		this.startLoad();
		this._started = true;
	}
};

LG.Launcher.prototype.startLoad = function(){
	this.loadTemplates();
	this.makeObjects();
	this.loadStorage();
};

LG.Launcher.prototype.loadTemplates = function(){
	// load the templates, compile each one using underscore templating
	LG.templates.init(LG.Config.TEMPLATES);
};

LG.Launcher.prototype.makeObjects = function(){
	LG.fileOpener = new LG.FileOpener();
	LG.router = new LG.Router();
	LG.canvasModel = new LG.CanvasModel();
	LG.storage = LG.create.storage();
	LG.sounds = new LG.Sounds();
	LG.spinnerModel = new LG.SpinnerModel();
	LG.userModel = LG.create.userModel();
	LG.layoutModel = new LG.LayoutModel();
	LG.fileCollection = LG.create.fileCollection();
	LG.graphicsModel = new LG.GraphicsModel();
	LG.imageModel = new LG.ImageModel();
	LG.allFilesCollection = new LG.AllFileCollection();
	LG.spinnerView = new LG.SpinnerView({"model":LG.spinnerModel});
	LG.sounds = new LG.Sounds();
};

LG.Launcher.prototype.launch = function(){
	var defaultHash = "write", hash;
	if(this.hash && this.hash.length >= 1 && this.hash != defaultHash){
		hash = this.hash;
	}
	else{
		hash = defaultHash;
	}
	setTimeout(function(){	
		LG.router.navigate(hash, {"trigger":true});
	}, 1000);
	this._launched = true;
};

LG.Launcher.prototype.addActivity = function(){
	this.hash = window.location.hash.replace(/^#/,'');
	window.location.hash = "";
	LG.activityView = new LG.ActivityView();
	$("body > #container").empty().append(LG.activityView.render().$el);
	LG.activityView.afterAdded();
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
	LG.Utils.growl(LG.Messages.WRITE);
	Backbone.history.start();
};

LG.Launcher.prototype.allFilesLoaded = function(){
	this.launch();
};

LG.Launcher.prototype.loadStorage = function(){
	var keys = ["userId"];
	LG.storage.loadAll(keys, $.proxy(this.storageLoaded, this));
};

LG.Launcher.prototype.loadUserId = function(){
	
};

LG.Launcher.prototype.soundsLoaded = function(){
	this.loadUserId();
	this.login();
};



LG.Launcher.prototype.storageLoaded = function(){
	LG.sounds.load({"success":$.proxy(this.soundsLoaded, this)});
};

LG.Launcher.prototype.loadFiles = function(){
	this.allFilesLoaded();
	// don't need to load them
};

LG.Launcher.prototype.onLoggedIn = function(){
	this.addActivity();
	this.loadFiles();
};

LG.Launcher.prototype.check = function(){
	return false;
};





// web specific class

LG.WebLauncher = function(){
	LG.Launcher.apply(this, arguments);
};

LG.WebLauncher.prototype = Object.create(LG.Launcher.prototype);
LG.WebLauncher.prototype.constructor = LG.WebLauncher;

LG.WebLauncher.prototype.login = function(){
	this.onLoggedIn();
};

LG.WebLauncher.prototype.check = function(){
	return (!this._started && this._domReady );
};


LG.launcher = LG.create.launcher();
LG.launcher.bindEvents();