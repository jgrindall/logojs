// this class handles the lauching of the app

// for phonegap, dom must be ready and device ready, for web just dom ready.
// _started makes sure that the app is launched only once

LG.Launcher = function(){
	this._domReady = false;
	this._mobReady = false;
	this._deviceReady = false;
	this._started = false;
	this.fbComplete = false;
	this.hash = null;
};


// bind into events
LG.Launcher.prototype.bindEvents = function(){
	$(document).bind ("ready", 		$.proxy (this.domReady, this)  );
	$(window).on("resize", $.proxy(this.onResize, this));
};


LG.Launcher.prototype.onResize = $.debounce( 500, function(){
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
});


LG.Launcher.prototype.domReady = function(){
	this._domReady = true;
	// there are two check methods, one for web and one for ipad
	if(	this.check() ){
		this._started = true;
		// if we are ready, then start by loading the html templates
		this.startLoad();
	}
};

LG.Launcher.prototype.startLoad = function(){
	var _this = this;
	this.loadTemplates();
};

LG.Launcher.prototype.loadTemplates = function(){
	// load the templates, compile each one using underscore templating
	LG.templates = new LG.Templates(LG.Config.TEMPLATES, $.proxy(this.templatesLoaded, this));
	LG.templates.init();
};


LG.Launcher.prototype.templatesLoaded = function(){
	LG.router = new LG.Router();
	this.start();
};

LG.Launcher.prototype.makeObjects = function(){
	LG.spinnerModel = new LG.SpinnerModel();
	LG.userModel = new LG.UserModel();
	LG.layoutModel = new LG.LayoutModel();
	LG.fileCollection = new LG.FileCollection();
	LG.imageModel = new LG.ImageModel();
	LG.allFilesCollection = new LG.AllFileCollection();
	LG.spinnerView = new LG.SpinnerView({"model":LG.spinnerModel});
};

LG.Launcher.prototype.checkFacebook = function(options){
	var url, img, _this = this;
	if(LG.Config.PHONEGAP){
		options.success();
		return;
	}
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

LG.Launcher.prototype.login = function(options){
	if(LG.facebook){
		LG.facebook.init({
			"success":function(){
				LG.facebook.load(options);
			},
			"fail":function(){
				options.success();
			}
		});
	}
	else{
		options.success();
	}
};


LG.Launcher.prototype.launch = function(){
	window.location.hash = "";
	this.addActivity();
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
	Backbone.history.start();
};

LG.Launcher.prototype.addActivity = function(){
	LG.activityView = new LG.ActivityView();
	$("body > #container").empty().append(LG.activityView.render().$el);
	LG.activityView.afterAdded();
};

LG.Launcher.prototype.onLoggedIn = function(){
	this.launch();
};

LG.Launcher.prototype.fbChecked = function(){
	this.fbComplete = true;
	console.log(LG.Network.FACEBOOK +"  "+LG.Config.PHONEGAP);
	if(LG.Network.FACEBOOK && !LG.Config.PHONEGAP){
		LG.facebook = new LG.WebFacebook();
	}
	//this.login({"success":$.proxy(this.onLoggedIn, this)});
	this.onLoggedIn();
};

LG.Launcher.prototype.start = function(){
	this.bindEvents();
	this.makeObjects();
	this.checkFacebook({"success":$.proxy(this.fbChecked, this)} );
};

LG.Launcher.prototype.check = function(){
	return false;
};





// phonegap specific class

LG.IPadPhoneGapLauncher = function(){
	LG.Launcher.apply(this, arguments);
};

LG.IPadPhoneGapLauncher.prototype = new LG.Launcher();

LG.IPadPhoneGapLauncher.prototype.bindEvents = function(){
	// also bind to extra PG events
	LG.Launcher.prototype.bindEvents.call(this);
	document.addEventListener("deviceready", $.proxy(this.deviceReady, this) , false);
	$(window).on("orientationchange", $.proxy(this.onOrient, this));
};

LG.IPadPhoneGapLauncher.prototype.deviceReady = function(){
	this._deviceReady = true;
	if(	this.check() ){
		this._started = true;
		this.startLoad();
	}
};

LG.IPadPhoneGapLauncher.prototype.onOrient = $.debounce( 500, function(){
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
});

LG.IPadPhoneGapLauncher.prototype.check = function(){
	// check is different for PG
	return (!this._started && this._domReady  && this._deviceReady);
};

// web specific class

LG.WebLauncher = function(){
	LG.Launcher.apply(this, arguments);
};

LG.WebLauncher.prototype = new LG.Launcher();

LG.WebLauncher.prototype.check = function(){
	return (!this._started && this._domReady );
};



// finally, make a new instance depending on what set up we have
if(LG.Config.PHONEGAP){
	LG.launcher = new LG.IPadPhoneGapLauncher();
}	
else{
	LG.launcher = new LG.WebLauncher();
}

LG.launcher.bindEvents();
