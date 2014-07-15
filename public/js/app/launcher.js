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
	var defaultHash = "menu", hash;
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

LG.WebLauncher.prototype.social = function(options){
	var url, img, _this = this;
	url = "https://facebook.com/favicon.ico";
	img = $("<img src='"+url+"'/>");
	img.on("load", function(){
		if(!_this.fbComplete){
			LG.Network.FACEBOOK = true;
			options.success();
		}
	});
	img.on("error", function(){
		if(!_this.fbComplete){
			options.success();
		}
	});
	setTimeout(function(){
		if(!_this.fbComplete){
			options.success();
		}
	}, 2500);
};

LG.WebLauncher.prototype.socialChecked = function(){
	var _this = this;
	this.fbComplete = true;
	if(LG.Network.FACEBOOK){
		LG.facebook = new LG.WebFacebook();
		LG.facebook.init({
			"success":function(){
				LG.facebook.load({
					"fail":function(){
						_this.onLoggedIn();
					},
					"success":function(){
						_this.onLoggedIn();
					}
				});
			},
			"fail":function(){
				_this.onLoggedIn();
			}
		});
	}
	else{
		_this.onLoggedIn();
	}
};

LG.WebLauncher.prototype.login = function(){
	this.social({"success":$.proxy(this.socialChecked, this)} );
};

LG.WebLauncher.prototype.check = function(){
	return (!this._started && this._domReady );
};





// ipad

LG.IPadLauncher = function(){
	LG.Launcher.apply(this, arguments);
	this._deviceReady = false;
	this._fileResolved = false;
};

LG.IPadLauncher.prototype = Object.create(LG.Launcher.prototype);
LG.IPadLauncher.prototype.constructor = LG.IPadLauncher;

LG.IPadLauncher.prototype.login = function(){
	// just log them in automatically
	LG.userModel.set({"loggedIn":true});
	this.onLoggedIn();
};

LG.IPadLauncher.prototype.loadUserId = function(){
	var userId = LG.storage.loadCached("userId");
	if(!userId){
		userId = LG.Utils.getUuid();
	}
	LG.userModel.set({"userId":userId});
};

LG.IPadLauncher.prototype.fileSystemOk = function(){
	this._fileResolved = true;
	if(	this.check() ){
		this._started = true;
		this.startLoad();
	}
};

LG.IPadLauncher.prototype.fileSystemFail = function(){
	
};

LG.IPadLauncher.prototype.keyboardShowHandler = function(){
	LG.EventDispatcher.trigger(LG.Events.KEYBOARD_UP);
};

LG.IPadLauncher.prototype.keyboardHideHandler = function(){
	LG.EventDispatcher.trigger(LG.Events.KEYBOARD_DOWN);
};

LG.IPadLauncher.prototype.bindEvents = function(){
	LG.Launcher.prototype.bindEvents.call(this);
	document.addEventListener("deviceready", $.proxy(this.deviceReady, this) , false);
	document.addEventListener("resume", $.proxy(this.resume, this) , false);
	document.addEventListener("pause", $.proxy(this.pause, this) , false);
	window.addEventListener('native.showkeyboard', $.proxy(this.keyboardShowHandler, this));
	window.addEventListener('native.hidekeyboard', $.proxy(this.keyboardHideHandler, this));
};

LG.IPadLauncher.prototype.resume = function(){
	LG.EventDispatcher.trigger(LG.Events.RESUME);
};

LG.IPadLauncher.prototype.pause = function(){
	LG.EventDispatcher.trigger(LG.Events.PAUSE);
};

LG.IPadLauncher.prototype.deviceReady = function(){
	this._deviceReady = true;
	LG.fileSystem.init({"success":$.proxy(this.fileSystemOk, this), "fail":$.proxy(this.fileSystemFail, this)} );
};

LG.IPadLauncher.prototype.check = function(){
	return (!this._started && this._domReady  && this._deviceReady && this._fileResolved);
};

// fake ipad

LG.FakeIPadLauncher = function(){
	LG.Launcher.apply(this, arguments);
};

LG.FakeIPadLauncher.prototype = Object.create(LG.Launcher.prototype);
LG.FakeIPadLauncher.prototype.constructor = LG.FakeIPadLauncher;

LG.FakeIPadLauncher.prototype.login = function(){
	LG.IPadLauncher.prototype.login.call(this);
};

LG.FakeIPadLauncher.prototype.loadUserId = function(){
	LG.IPadLauncher.prototype.loadUserId.call(this);
};

LG.FakeIPadLauncher.prototype.bindEvents = function(){
	LG.Launcher.prototype.bindEvents.call(this);
};

LG.FakeIPadLauncher.prototype.check = function(){
	return LG.WebLauncher.prototype.check.call(this);
};

// make

LG.launcher = LG.create.launcher();
LG.launcher.bindEvents();