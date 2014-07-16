
LG.Facebook = function(){
	
};

LG.Facebook.SRC 						= 	"http://connect.facebook.net/en_US/all.js";
LG.Facebook.APP_ID						=	"169857723045523";
LG.Facebook.ID 							= 	"facebook-jssdk";
LG.Facebook.REDIRECT_URI 				= 	"https://www.facebook.com/connect/login_success.html";
LG.Facebook.WEB_REDIRECT_URI 			= 	"http://www.logotacular.com";
LG.Facebook.CHANNEL_URL 				= 	"/channel/channel.html";
LG.Facebook.SCOPE						=	"user_about_me";
LG.Facebook.GRAPH_ME					=	"https://graph.facebook.com/me";
LG.Facebook.GRAPH_ME_PIC				=	"https://graph.facebook.com/me/picture?redirect=false&";
LG.Facebook.SECONDS_TO_WAIT 			= 	8;

LG.Facebook.INIT_OBJ = {status : false, cookie : true, xfbml : false, kidDirectedSite:true, appId : LG.Facebook.APP_ID,	channelUrl : LG.Facebook.CHANNEL_URL};

LG.Facebook.prototype.openFeed = function(options){
	var url, href;
	url = encodeURIComponent(LG.Facebook.SMFH_LINK_URL );
	href = LG.Facebook.FEED_DIALOG+"?app_id="+LG.Facebook.APP_ID+"&link="+url;
	href += "&description="+encodeURIComponent(LG.Config.PRODUCT_NAME);
	href += "&name="+encodeURIComponent(LG.Config.PRODUCT_DESCRIPTION);
	this.open(href, options);
};

LG.Facebook.getPicture = function(uid){
	return "http://graph.facebook.com/"+uid+"/picture";
};


/////   web ///////////////

LG.WebFacebook = function(){
	LG.Facebook.apply(this, arguments);
};

LG.WebFacebook.prototype = Object.create(LG.Facebook.prototype);
LG.WebFacebook.prototype.constructor = LG.WebFacebook;

LG.WebFacebook.prototype.init = function(options){
	var _this = this;
	window.fbAsyncInit = function() {
		try{
			FB.init(LG.Facebook.INIT_OBJ);
			options.success();
		}
		catch(e){
			options.fail();
		}
	};
	try{
		$("#fb-root").append("<script src='"+LG.Facebook.SRC+"' type='text/javascript' async='true' id='"+LG.Facebook.ID+"'></script>");
		this.startListenToLoad(options);
	}
	catch(e){
		options.fail();
	}
};

LG.WebFacebook.prototype.startListenStatus = function(options){
	this.checkStatusInterval = setInterval($.proxy(this.checkStatusLoaded, this, options), 500);
};


LG.WebFacebook.prototype.checkStatusLoaded = function(options){
	if(this.statusChecked){
		clearInterval(this.checkStatusInterval);
	}
	else{
		this.numWait++;
		if(this.numWait >= LG.Facebook.SECONDS_TO_WAIT ){
			clearInterval(this.checkStatusInterval);
			options.fail();
		}
	}	
};

LG.WebFacebook.prototype.startListenToLoad = function(options){
	var _this = this;
	this.numWait = 0;
	this.checkLoadInterval = setInterval(function(){
		_this.checkScriptLoaded(options);
	}, 500);
};

LG.WebFacebook.prototype.checkScriptLoaded = function(options){
	if(window.FB){
		clearInterval(this.checkLoadInterval);
	}
	else{
		this.numWait++;
		if(this.numWait >= LG.Facebook.SECONDS_TO_WAIT ){
			clearInterval(this.checkLoadInterval);
			options.fail();
		}
	}
};

LG.WebFacebook.prototype.open = function(href, options){
	href = href + "&redirect_uri="+LG.Facebook.WEB_REDIRECT_URI;
	LG.EventDispatcher.trigger(LG.Events.WINDOW_OPENED);
	window.open(href, '_blank', LG.Facebook.OPTIONS);
};

LG.WebFacebook.prototype.load = function(options){
	// called by the loader.
	this.getLoginStatus({
		"success":function(){
			options.success();
		},
		"fail":function(response){
			options.success();
		}
	});
};


LG.WebFacebook.prototype.getLoginStatus = function(options){
	this.statusChecked = false;
	var _this = this;
	this.numWait = 0;
	try{
		FB.getLoginStatus(function(response) {
			_this.statusChecked = true;
			LG.Network.FACEBOOK_ACTIVE = true;
			if(response.status === "connected" && response.authResponse){
				LG.userModel.fbLoggedIn(options);
			}
			else{
				options.fail();
			}
		}, true);
		this.startListenStatus(options);
	}
	catch(e){
		options.fail();
	}
};


LG.WebFacebook.prototype.login = function(options){
	try{
		FB.login(function(response) {
			if (response.authResponse) {
				LG.userModel.fbLoggedIn(options);
			}
			else {
				options.fail();
			}
		});
	}
	catch(e){
		options.fail();
	}
};



LG.WebFacebook.prototype.logout = function(options) {
	try{
		FB.logout(function(response) {
			if (response.authResponse) {
				LG.userModel.fbLoggedOut(options);
			}
			else {
				options.fail();
			}
		});
	}
	catch(e){
		options.fail();
	}
};

LG.WebFacebook.prototype.getMe = function(options) {
	try{
		FB.api('/me', function(response) {
			options.success(response);
		});
	}
	catch(e){
		options.fail();
	}
};

LG.WebFacebook.prototype.getPic = function(options) {
	try{	
		FB.api('/me/picture', function(response) {
			options.success(response);
		});
	}
	catch(e){
		options.fail();
	}
};


