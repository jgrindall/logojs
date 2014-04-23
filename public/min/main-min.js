// useful utility methods


LG.Utils = {};

LG.Utils.isTouch = function(){
	try{
		if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			return true;
		}
	}
	catch(e){
		return false;		
	}
	return false;
};

LG.Utils.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

LG.Utils.getUuid = function(){
	var az, len, i, index, s ="", SIZE = 48;
	az = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	len = az.length;
	for(i = 1; i <= SIZE; i++){
		index = Math.floor(Math.random() * len);
		s += az.charAt(index);
	}
	return s;
};

LG.Utils.growl = function(msg){
	// open a little popup message
	// close all if there are any
	//LG.Utils.closeGrowls();
	var data = {
		"afterOpen": function() {
			var g = this;
			$(this).on("click", function(e){
				e.stopPropagation();
				$(g).remove();
			});
		},
		"beforeClose":function(){
			$(this).off("click");
		},
		"closeTemplate":"",
		"position":"bottom-left"
	
	};
	$.jGrowl(msg, data);
};

$.jGrowl.defaults.pool = 1;

LG.Utils.supportsLocalStorage = function(){
	if (typeof window.localStorage !== 'undefined'){
		try{
			localStorage.setItem("storage", "");
			localStorage.removeItem("storage");
			return true;
		}
		catch(e){
		
		}
	}
	return false;
};

LG.Utils.supportsCookies = function(){
	var r1,r2 = Math.floor(Math.random()*1000000) + 1;
	try{
		$.cookie("smfhtest"+r1, r1);
		r2 = $.cookie("smfhtest"+r1);
		if(parseInt(r2, 10)===parseInt(r1, 10)){
			return true;
		}
	}
	catch(e){
	
	}
	return false;
};

LG.Utils.fillArray = function(value, len) {
	var i;
	var r = [ ];
	if (len === 0 || isNaN(len)){
		return null;
	}
	for(i=1;i<=len;i++){
		r.push(value);
	}
	return r;
};

LG.Utils.truncate = function(s, n){
	if(s.length < n){
		return s;
	}
	return ( s.substring(0, n - 1)+"..." );
};

LG.Utils.getURLParameter = function(name){
	var r =  decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	return r;
};


LG.Utils.find = function(list, attrName, match){
	// helper function for JSON
	if(!list || !attrName){
		return null;
	}
	var found = null;
	$.each(list, function(i, val){	
		var matched = ( val[attrName] == match);
		if(matched){
			found = val;
		}
		return !matched;
	});
	return found;
};


LG.Utils.log = function(s){
	if(window.console){
		console.log("DEBUG> "+s+"\n");
	}
};

LG.Utils.requestAnimFrame = (function(){
	return	window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();




// global config constants

LG.Config = {};

// turn this off to prevent console logging completely
LG.Config.DEBUG = true;

// this variable is replaced by the ant build script
LG.Config.PHONEGAP = false;

LG.Config.FAKE_PHONEGAP = true;

LG.Config.IS_TOUCH = LG.Utils.isTouch();

// preload and compile the html using this list - should be faster
LG.Config.TEMPLATES = ["tpl_galleryside","tpl_helpoverlay","tpl_dinobutton","tpl_spinner","tpl_gallerypage","tpl_helpbuttonmenu","tpl_help","tpl_newbutton","tpl_deletebutton","tpl_writetop","tpl_menutop","tpl_writebutton","tpl_settingsbutton","tpl_cancelbutton","tpl_menubuttons","tpl_menu","tpl_loadrow","tpl_load","tpl_gallerylist","tpl_gallerybottom","tpl_gallerytop","tpl_galleryleftbutton","tpl_galleryrightbutton","tpl_loadbutton","tpl_galleryrow","tpl_gallery","tpl_filename","tpl_alert","tpl_savebutton","tpl_helpbutton","tpl_tidybutton","tpl_clearbutton","tpl_gallerybutton", "tpl_logobutton", "tpl_loginbutton","tpl_filebutton","tpl_textbutton","tpl_undobutton","tpl_redobutton","tpl_startbutton","tpl_pausebutton","tpl_stopbutton","tpl_header","tpl_write","tpl_writebuttons","tpl_canvas","tpl_activitybuttons","tpl_activity"];

LG.Config.PRODUCT_ID = "logojs";



LG.Messages = {};
LG.Messages.WANT_TO_SAVE = "Do you want to save your current file?";
LG.Messages.WANT_TO_DELETE = "Are you sure you want to delete this file?";


LG.ACreate = function(){
	
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

LG.WebCreate.prototype.launcher = function(){
	return new LG.WebLauncher();
};

LG.WebCreate.prototype.loginButton = function(){
	return new LG.WebLoginButtonView();
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

// make 
if(LG.Config.PHONEGAP === "ios"){
	LG.create = new LG.IPadCreate();
}
else if(LG.Config.FAKE_PHONEGAP){
	LG.create = new LG.FakeIPadCreate();
}
else {
	LG.create = new LG.WebCreate();
}











if (!Array.prototype.indexOf) {

	Array.prototype.indexOf = function(obj) {
		var i, j = this.length;
		for (i = 0; i < j; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}




if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        };
    })();
}
// simple utility to check browser
// --------------------------


LG.BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)	|| this.searchVersion(navigator.appVersion)	|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		this.ie9 = (this.browser==="Explorer" && this.version<=9);
		this.ie8 = (this.browser==="Explorer" && this.version<=8);
		this.chrome = (this.browser==="Chrome");
		this.safari = (this.browser==="Safari");
		this.firefox = (this.browser==="Firefox");
		this.opera = (this.browser==="Opera");
		this.mp4first = !(this.firefox || this.opera);
		this.useVideoImage = !(this.firefox || this.opera);
	},
	searchString: function (data) {
		var i, dataString, dataProp;
		for ( i=0;i<data.length;i++)	{
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1){
					return data[i].identity;
				}
			}
			else if (dataProp){
				return data[i].identity;
			}
		}
		return null;
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) {
			return null;
		}
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{	
			// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod/iPad"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};



if(LG.Config.IS_TOUCH){
	$(document).bind("touchmove",function(e) {
		e.preventDefault();
	});
}

$.ajaxSetup({
	// always go here if we get a 404 on the backend
	statusCode: {
		404: function(){
			alert("404 error");
		}
	},
	cache:false
});


LG.BrowserDetect.init();





// handle popup menus

LG.Network = {};

LG.Network.FACEBOOK = false;
// storage
// on the web, use the localStorage
// on the iPad, use the secure keychain


LG.AbstractStorage = function(){
	this.cache = {};
};

LG.AbstractStorage.getNewKey = function(key){
	key = LG.Config.PRODUCT_ID+"_"+key;
	return key;
};

LG.AbstractStorage.prototype.loadCached = function(key){
	var newKey = LG.AbstractStorage.getNewKey(key);
	return this.cache[newKey];
};

LG.AbstractStorage.prototype.loadAllCached = function(keys){
	var r = {}, _this = this, newKey;
	$.each(keys, function(i, key){
		newKey = LG.AbstractStorage.getNewKey(key);
		r[key] = _this.cache[newKey];
	});
	return r;
};

LG.AbstractStorage.prototype.loadNext = function(){	
	var key, _this = this;
	if(this.index >= this.keys.length){
		_this.success();
	}
	else{
		key = this.keys[this.index];
		this.load(key, function(k, v){
			_this.index++;
			_this.loadNext();
		});
	}
};

LG.AbstractStorage.prototype.saveNext = function(){	
	var _this = this, key, val;
	if(this.index >= this.keys.length){
		_this.success();
	}
	else{
		key = this.keys[this.index];
		val = this.vals[this.index];
		this.save(key, val, function(key, val){
			_this.index++;
			_this.saveNext();
		});
	}
};

LG.AbstractStorage.prototype.loadAll = function(keys, success){
	this.index = 0;
	this.keys = keys;
	this.success = success;
	this.loadNext();
};

LG.AbstractStorage.prototype.saveAll = function(keys, vals, success){
	this.index = 0;
	this.keys = keys;
	this.vals = vals;
	this.success = success;
	this.saveNext();
};






///////////// web //////////////

LG.WebStorage = function(){
	LG.AbstractStorage.call(this);
	this.store = window.localStorage;
};

LG.WebStorage.prototype = Object.create(LG.AbstractStorage.prototype);
LG.WebStorage.prototype.constructor = LG.WebStorage;

LG.WebStorage.prototype.save = function(key, val, success){
	if(val===null || typeof val === "undefined" || val === "undefined"){
		this.remove(key, success);
	}
	else{
		var newKey = LG.AbstractStorage.getNewKey(key);
		try{
			this.store.setItem(newKey, val);
		}
		catch(e){
			
		}
		this.cache[newKey] = val;
	}
	success(key, val);
};

LG.WebStorage.prototype.load = function(key, success){
	var newKey, val;
	newKey = LG.AbstractStorage.getNewKey(key);
	val = null;
	try{
		val = this.store.getItem(newKey);
	}
	catch(e){
	
	}
	if(typeof val==="undefined" || val==="undefined" || val===null || val==="null"){
		val = null;
	}
	this.cache[newKey] = val;
	success(key, val);
};

LG.WebStorage.prototype.remove = function(key, success){
	var newKey = LG.AbstractStorage.getNewKey(key);
	try{
		this.store.removeItem(newKey);
	}
	catch(e){
	
	}
	this.cache[newKey] = null;
	success(key, null);
};





///////////// ipad //////////////

LG.IPadStorage = function(){
	//based on https://github.com/phonegap/phonegap-plugins/blob/master/iPhone/Keychain/KeychainPlugin-Host/www/index.html
	LG.AbstractStorage.call(this);
	this.store = cordova.require("cordova/plugin/keychain");
	this.servicename = "com.heymath.smfh"+LG.Config.PRODUCT_ID;
};

LG.IPadStorage.prototype = Object.create(LG.AbstractStorage.prototype);
LG.IPadStorage.prototype.constructor = LG.IPadStorage;

LG.IPadStorage.prototype.save = function(key, val, success){
	var _this = this, newKey, win, fail;
	val = val + "";  // must be a string
	if(val === null || val=== "" || typeof val === "undefined" || val === "undefined"){
		this.remove(key, success);
	}
	else{
		newKey = LG.AbstractStorage.getNewKey(key);
		win = function(){
			_this.cache[newKey] = val;
			success(key, val);
		};
		fail = function(error){
			_this.cache[newKey] = val;
			success(key, val);
		};
		try{
			this.store.setForKey(win, fail, newKey, this.servicename, val);
		}
		catch(e){
			fail();
		}
	}
};

LG.IPadStorage.prototype.load = function(key, success){
	var _this = this, newKey, win, fail;
	newKey = LG.AbstractStorage.getNewKey(key);
	win = function(val){
		if(typeof val==="undefined" || val==="undefined" || val===null || val==="null"){
			val = null;
		}
		_this.cache[newKey] = val;
		success(key, val);
	};
	fail = function(error){
		// NB.  fail is called on the iPad if the value is null
		_this.cache[newKey] = null;
		success(key, null);
	};
	try{
		this.store.getForKey(win, fail, newKey, this.servicename);
	}
	catch(e){
		fail();
	}
};

LG.IPadStorage.prototype.remove = function(key, success){
	var newKey, _this = this, win, fail;
	newKey = LG.AbstractStorage.getNewKey(key);
	win = function(){
		_this.cache[newKey] = null;
		success(key, null);
	};
	fail = function(error){
		_this.cache[newKey] = null;
		success(key, null);
	};
	try{
		this.store.removeForKey(win, fail, newKey, this.servicename);
	}
	catch(e){
		fail();
	}
};




///////////// unsupported //////////////

LG.NoSupportStorage = function(){
	LG.AbstractStorage.call(this);
	this.store = {};
};

LG.NoSupportStorage.prototype = Object.create(LG.AbstractStorage.prototype);
LG.NoSupportStorage.prototype.constructor = LG.NoSupportStorage;

LG.NoSupportStorage.prototype.save = function(key, val, success){
	if(val===null || typeof val === "undefined" || val === "undefined"){
		this.remove(key, success);
	}
	else{
		var newKey = LG.AbstractStorage.getNewKey(key);
		this.store[newKey] = val;
		this.cache[newKey] = val;
	}
	success(key, val);
};

LG.NoSupportStorage.prototype.load = function(key, success){
	var newKey, val;
	newKey = LG.AbstractStorage.getNewKey(key);
	val = this.store[newKey];
	if(typeof val==="undefined" || val==="undefined"){
		val = null;
	}
	this.cache[newKey] = val;
	success(key, val);
};

LG.NoSupportStorage.prototype.remove = function(key, success){
	var newKey =  LG.AbstractStorage.getNewKey(key);
	this.store[newKey] = null;
	this.cache[newKey] = null;
	success(key, null);
};





///////////// cookie //////////////

LG.CookieStorage = function(){
	LG.AbstractStorage.call(this);
	this.store = {};
};

LG.CookieStorage.prototype = Object.create(LG.AbstractStorage.prototype);
LG.CookieStorage.prototype.constructor = LG.CookieStorage;

LG.CookieStorage.prototype.save = function(key, val, success){
	if(val===null || typeof val === "undefined" || val === "undefined"){
		this.remove(key, success);
	}
	else{
		var newKey = LG.AbstractStorage.getNewKey(key);
		$.cookie(newKey, val);
		this.cache[newKey] = val;
	}
	success(key, val);
};

LG.CookieStorage.prototype.load = function(key, success){
	var newKey, val;
	newKey = LG.AbstractStorage.getNewKey(key);
	val = $.cookie(newKey);
	if(typeof val==="undefined" || val==="undefined"){
		val = null;
	}
	this.cache[newKey] = val;
	success(key, val);
};

LG.CookieStorage.prototype.remove = function(key, success){
	var newKey =  LG.AbstractStorage.getNewKey(key);
	$.removeCookie(newKey);
	this.cache[newKey] = null;
	success(key, null);
};



// compile the templates using underscore for faster rendering

LG.Templates = function() {
	this.compiledTemplates = { };
};

LG.Templates.prototype.init = function(ids){
	var _this = this;
	$.each(ids, function(i, id){
		var html = $('#'+id).html();
		var trim = $.trim(html);
		_this.compiledTemplates[id] = _.template(trim);
	});
};

LG.Templates.prototype.getTemplate = function(id){
	return this.compiledTemplates[id];
};

LG.templates = new LG.Templates();

// play a sound effect (not used yet)

LG.Sounds = function(){
	this.sfx = ["img/whooshup", "img/click", "img/error", "img/success"];
	this.sounds = [];
	this.loaded = 0;
};

LG.Sounds.prototype.load = function(options){
	this.options = options;
	this.loadNext();
};

LG.Sounds.prototype.loadNext = function(){
	var _this = this;
	if(this.loaded == this.sfx.length){
		this.options.success();
	}
	else{
		var file = this.sfx[this.loaded];
		var s = new Howl({
			urls: [file+".mp3",file+".wav"],
			volume: 0.5,
			onload: function() {
				_this.sounds.push(s);
				_this.loaded++;
				_this.loadNext();
			}
		});
	}
};

LG.Sounds.prototype.playWhoosh = function(s){
	this.sounds[0].play();
};

LG.Sounds.prototype.playSuccess = function(s){
	this.sounds[3].play();
};

LG.Sounds.prototype.playError = function(s){
	this.sounds[2].play();
};

LG.Sounds.prototype.playClick = function(s){
	this.sounds[1].play();
};




// extends Backbone.Router

// only 4 pages at the moment

LG.Router = Backbone.Router.extend({
	
    routes:{
		""											:	"write",
		"write"										:	"write",
		"write/:id"									:	"write",
		"gallery"									:	"gallery",
		"load"										:	"load",
		"filename"									:	"filename",
		"alert"										:	"alert",
		"help"										:	"help",
		"menu"										:	"menu"
    },
	initialize:function () {
		
    },
	show:function(s){
		if( s != "alert"){
			LG.popups.closePopup();
		}
		LG.layoutModel.set({"show":s});
	},
	write:function(id){
		if(id){
			LG.fileOpener.open(id);
		}
		this.show("write");
	},
	filename:function(){
		this.show("filename");
	},
	load:function(){
		this.show("load");
	},
	help:function(){
		this.show("help");
	},
	menu:function(){
		this.show("menu");
	},
	alert:function(){
		this.show("alert");
	},
	gallery:function(){
		this.show("gallery");
	}
});



LG.EventDispatcher =  _.extend(  {}, Backbone.Events);
// global event dispatcher


// and a list of events to prevent mistyping
LG.Events = {};
LG.Events.RESIZE				=	"LG::resize";
LG.Events.CLICK_TIDY			=	"LG::clickTidy";
LG.Events.CLICK_UNDO			=	"LG::clickUndo";
LG.Events.CLICK_DELETE			=	"LG::clickDelete";
LG.Events.CLICK_REDO			=	"LG::clickRedo";
LG.Events.CLICK_CLEAR			=	"LG::clickClear";
LG.Events.CLICK_STOP			=	"LG::clickStop";
LG.Events.CLICK_NEW				=	"LG::clickNew";
LG.Events.CAPTURE_IMAGE			=	"LG::captureImage";
LG.Events.DRAW_FINISHED			=	"LG::drawFinished";
LG.Events.COMMAND_FINISHED		=	"LG::commandFinished";
LG.Events.TICK					=	"LG::commandTick";
LG.Events.PREVIEW_FILE			=	"LG::previewFile";
LG.Events.CLICK_DRAW			=   "LG::clickDraw";
LG.Events.CLICK_DRAW_START		=   "LG::clickDrawStart";
LG.Events.BUTTON_VIS_CHANGED	=	"LG::buttonVisChanged";
LG.Events.CLICK_TEXT			=	"LG::clickText";
LG.Events.UNDO_REDO_DONE		=	"LG::undoRedoDone";
LG.Events.CHANGE_FILE			=	"LG::changeFile";
LG.Events.ALERT_OK				=	"LG::alertOk";
LG.Events.ALERT_CANCEL			=	"LG::alertCancel";
LG.Events.ALERT_NO				=	"LG::alertNo";
LG.Events.DINO_CHANGED			=	"LG::dinoChanged";
LG.Events.RESET_CANVAS			=	"LG::resetCanvas";
LG.Events.HIDE_HELP_OVERLAY		=	"LG::hideHelpOverlay";



LG.Facebook = function(){
	
};

LG.Facebook.SRC 						= 	"http://connect.facebook.net/en_US/all.js";
LG.Facebook.APP_ID						=	"169857723045523";
LG.Facebook.ID 							= 	"facebook-jssdk";
LG.Facebook.REDIRECT_URI 				= 	"https://www.facebook.com/connect/login_success.html";
LG.Facebook.WEB_REDIRECT_URI 			= 	"http://www.numbersandpictures.com/logojs/build/web";
LG.Facebook.CHANNEL_URL 				= 	"/channel/channel.html";
LG.Facebook.SCOPE						=	"email,user_about_me,offline_access,publish_stream";
LG.Facebook.GRAPH_ME					=	"https://graph.facebook.com/me";
LG.Facebook.GRAPH_ME_PIC				=	"https://graph.facebook.com/me/picture?redirect=false&";
LG.Facebook.GRAPH_ME_STATUS_UPDATE		=	"https://graph.facebook.com/me/feed";
LG.Facebook.FQL							=	"https://graph.facebook.com/fql";
LG.Facebook.GET_FRIENDS_FBQL 			=	"SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) ORDER BY rand()";
LG.Facebook.SMFH_LINK_URL 				=	"http://www.logotacular.com/logojs/build/web";
LG.Facebook.SECONDS_TO_WAIT 			= 	20;

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
	this.numWait = 0;
	this.useFb = true;
};

LG.WebFacebook.prototype = Object.create(LG.Facebook.prototype);
LG.WebFacebook.prototype.constructor = LG.WebFacebook;

LG.WebFacebook.prototype.init = function(options){
	var _this = this;
	window.fbAsyncInit = function() {
		if(_this.useFb){
			try{
				FB.init(LG.Facebook.INIT_OBJ);
				options.success();
			}
			catch(e){
				options.fail();
			}
		}
	};
	try{
		console.log("add script");
		$("#fb-root").append("<script src='"+LG.Facebook.SRC+"' type='text/javascript' async='true' id='"+LG.Facebook.ID+"'></script>");
		this.startListenToLoad(options);
	}
	catch(e){
		options.fail();
	}
};


LG.WebFacebook.prototype.startListenToLoad = function(options){
	var _this = this;
	this.checkLoadInterval = setInterval(function(){
		_this.checkScriptLoaded(options);
	}, 500);
};

LG.WebFacebook.prototype.checkScriptLoaded = function(options){
	console.log("check! "+this.numWait+"  "+window.FB);
	if(window.FB){
		clearInterval(this.checkLoadInterval);
	}
	else{
		this.numWait++;
		if(this.numWait >= LG.Facebook.SECONDS_TO_WAIT ){
			this.useFb = false;
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
	try{
		FB.getLoginStatus(function(response) {
			if(response.status === "connected" && response.authResponse){
				LG.userModel.fbLoggedIn(options);
			}
			else{
				options.fail();
			}
		}, true);
	}
	catch(e){
		options.fail();
	}
};


LG.WebFacebook.prototype.login = function(options){
	try{
		FB.login(function(response) {
			LG.Utils.log("login response "+JSON.stringify(response));
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




LG.Utils.logoparser = (function(){

  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "insidestmt": parse_insidestmt,
        "fdstmt": parse_fdstmt,
        "rtstmt": parse_rtstmt,
        "rptstmt": parse_rptstmt,
        "insidefnlist": parse_insidefnlist,
        "makestmt": parse_makestmt,
        "vardef": parse_vardef,
        "expression": parse_expression,
        "plusorminus": parse_plusorminus,
        "multexpression": parse_multexpression,
        "timesordivterms": parse_timesordivterms,
        "timesordivterm": parse_timesordivterm,
        "plusexpression": parse_plusexpression,
        "minusexpression": parse_minusexpression,
        "unaryexpression": parse_unaryexpression,
        "negate": parse_negate,
        "timesterm": parse_timesterm,
        "divterm": parse_divterm,
        "numberexpression": parse_numberexpression,
        "number": parse_number,
        "varname": parse_varname
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_insidestmt();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_insidestmt();
        }
        if (result0 !== null) {
          result0 = (function(offset, st) {
        	var obj={};
        	obj.type="start";
        	obj.children=[];
        	for(var i=0;i<=st.length-1;i++){
        		obj.children.push(st[i]);
        	}
        	return obj;
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_insidestmt() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_fdstmt();
        if (result0 !== null) {
          result0 = (function(offset, f1) {
        	return {type:"insidestmt", children:[f1]};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_rtstmt();
          if (result0 !== null) {
            result0 = (function(offset, f2) {
          	return {type:"insidestmt", children:[f2]};
          })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_rptstmt();
            if (result0 !== null) {
              result0 = (function(offset, f3) {
            	return {type:"insidestmt", children:[f3]};
            })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              result0 = parse_makestmt();
              if (result0 !== null) {
                result0 = (function(offset, f4) {
              	return {type:"insidestmt", children:[f4]};
              })(pos0, result0);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
          }
        }
        return result0;
      }
      
      function parse_fdstmt() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "fd(") {
          result0 = "fd(";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"fd(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_expression();
          if (result1 !== null) {
            if (input.substr(pos, 2) === ");") {
              result2 = ");";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\");\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, num) {
        	return {type:"fdstmt", children:[num]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rtstmt() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "rt(") {
          result0 = "rt(";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"rt(\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_expression();
          if (result1 !== null) {
            if (input.substr(pos, 2) === ");") {
              result2 = ");";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\");\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, num) {
        	return {type:"rtstmt", children:[num]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rptstmt() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 4) === "rpt ") {
          result0 = "rpt ";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"rpt \"");
          }
        }
        if (result0 !== null) {
          result1 = parse_expression();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 91) {
              result2 = "[";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"[\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_insidefnlist();
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 93) {
                  result4 = "]";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"]\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, num, list) {
        	return {type:"rptstmt", children:[num,list]};
        })(pos0, result0[1], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_insidefnlist() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_insidestmt();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_insidestmt();
        }
        if (result0 !== null) {
          result0 = (function(offset, l) {
        
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_makestmt() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_vardef();
        if (result0 !== null) {
          if (input.substr(pos, 2) === ":=") {
            result1 = ":=";
            pos += 2;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":=\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_expression();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 59) {
                result3 = ";";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\";\"");
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, v, e) {
        	return {type:"makestmt", children:[v,e]};
        })(pos0, result0[0], result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_vardef() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, n) {
        	return {type:"timesordivterm", name:n.toString()};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_expression() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_multexpression();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_plusorminus();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_plusorminus();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, m, pm) {
        	var obj={};
        	obj.type="expression";
        	obj.children=[];
        	obj.children.push(m);
        	for(var i=0;i<=pm.length-1;i++){
        		obj.children.push(pm[i]);
        	}
        	return obj;
        })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_plusorminus() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_plusexpression();
        if (result0 !== null) {
          result0 = (function(offset, p) {
        	return {type:"plusorminus", children:[p]};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_minusexpression();
          if (result0 !== null) {
            result0 = (function(offset, m) {
          	return {type:"plusorminus", children:[m]};
          })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_multexpression() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_unaryexpression();
        if (result0 !== null) {
          result1 = parse_timesordivterms();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, u, td) {
        	var obj={};
        	obj.type="multexpression";
        	obj.children=[];
        	obj.children.push(u);
        	obj.children.push(td);
        	return obj;
        })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_timesordivterms() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_timesordivterm();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_timesordivterm();
        }
        if (result0 !== null) {
          result0 = (function(offset, t) {
        	var obj={};
        	obj.type="timesordivterms";
        	obj.children=[];
        	for(var i=0;i<=t.length-1;i++){
        		obj.children.push(t[i]);
        	}
        	return obj;
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_timesordivterm() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_timesterm();
        if (result0 !== null) {
          result0 = (function(offset, t) {
        	return {type:"timesordivterm", children:[t]};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_divterm();
          if (result0 !== null) {
            result0 = (function(offset, d) {
          	return {type:"timesordivterm", children:[d]};
          })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_plusexpression() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 43) {
          result0 = "+";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"+\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_multexpression();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, m) {
        	return {type:"plusexpression", children:[m]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_minusexpression() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 45) {
          result0 = "-";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_multexpression();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, m) {
        	return {type:"minusexpression", children:[m]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_unaryexpression() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_negate();
        if (result0 !== null) {
          result0 = (function(offset, n) {
        	return {type:"unaryexpression", children:[n]};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_numberexpression();
          if (result0 !== null) {
            result0 = (function(offset, num) {
          	return {type:"unaryexpression", children:[num]};
          })(pos0, result0);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_negate() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 45) {
          result0 = "-";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_numberexpression();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, n) {
        	return {type:"negate", children:[n]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_timesterm() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 42) {
          result0 = "*";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"*\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_unaryexpression();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, u) {
        	return {type:"timesterm", children:[u]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_divterm() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 47) {
          result0 = "/";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_unaryexpression();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, u) {
        	return {type:"divterm", children:[u]};
        })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_numberexpression() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_number();
        if (result0 !== null) {
          result0 = (function(offset, n) {
        	return {type:"numberexpression",children:[n]};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 40) {
            result0 = "(";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"(\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_expression();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 41) {
                result2 = ")";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\")\"");
                }
              }
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, e) {
          	return {type:"numberexpression", children:[e]};
          })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse_varname();
            if (result0 !== null) {
              result0 = (function(offset, v) {
            	return {type:"numberexpression", children:[v]};
            })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
        }
        return result0;
      }
      
      function parse_number() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[0-9]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[0-9]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[0-9]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, d) {
        	var s = "";
        	var l = d.length;
        	for(var i=0;i<l;i++){
        		s+=d[i];
        	}
        	return {type:"number",value:parseInt(s, 10)};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_varname() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (/^[a-z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, n) {
        	return {type:"varname",name:n.toString()};
        })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();


LG.Utils.log("parser "+LG.Utils.logoparser);


LG.output = function(){
	this.o = [];
};

LG.output.prototype.add = function(cmd){
	this.o.push(cmd);
};

LG.output.prototype.size = function(){
	return this.o.length;
};

LG.output.prototype.pop = function(){
	var r = this.o.pop();
	return r;
};

LG.output.prototype.at = function(i){
	return this.o[i];
};

LG.output.MAX_SIZE_REACHED = "Exceeded output size";

LG.output.MAX_SIZE = 10000;

LG.output.BATCH_SIZE = 40;

LG.output.TIMEOUT = 50;

LG.Command = function(amount){
	this.amount = amount;
};

LG.Command.prototype.execute = function(stage, container, position){
	this.container = container;
	this.position = position;
	this.stage = stage;
	this.startPosition = $.extend({}, position);
};





LG.ShapeCommand = function(amount){
	LG.Command.call(this, amount);
};

LG.ShapeCommand.prototype = Object.create(LG.Command.prototype);
LG.ShapeCommand.prototype.constructor = LG.ShapeCommand;

LG.ShapeCommand.prototype.execute = function(stage, container, position){
	LG.Command.prototype.execute.apply(this,arguments);
	this.graphics = new createjs.Graphics();
	var shape = new createjs.Shape(this.graphics);
	this.container.addChild(shape);
};





LG.FdCommand = function(amount){
	LG.ShapeCommand.call(this, amount);
};

LG.FdCommand.prototype = Object.create(LG.ShapeCommand.prototype);
LG.FdCommand.prototype.constructor = LG.FdCommand;

LG.FdCommand.prototype.execute = function(stage, container, position){
	console.log("fd "+this.amount+" from "+position.x+", "+position.y);
	LG.ShapeCommand.prototype.execute.apply(this, arguments);
	this.endPosition = {theta:position.theta, x:position.x + Math.cos(position.theta)*this.amount, y:position.y + Math.sin(position.theta)*this.amount};
	this.graphics.clear();
	this.graphics.setStrokeStyle(5, "round", "round");
	this.graphics.beginStroke(LG.graphicsModel.get("color"));
	this.graphics.moveTo(this.startPosition.x, this.startPosition.y);
	this.graphics.lineTo(this.endPosition.x, this.endPosition.y);
	this.position.x = this.endPosition.x;
	this.position.y = this.endPosition.y;
};

LG.FdCommand.prototype.output = function(){
	return "fd " +this.amount;
};


LG.RtCommand = function(amount){
	LG.Command.call(this, amount);
};

LG.RtCommand.prototype = Object.create(LG.Command.prototype);
LG.RtCommand.prototype.constructor = LG.RtCommand;

LG.RtCommand.prototype.execute = function(stage, container, position){
	LG.Command.prototype.execute.apply(this,arguments);
	this.endPosition = {theta:position.theta+this.amount*Math.PI/180, x:position.x , y:position.y };
	this.position.theta = this.endPosition.theta;
};

LG.RtCommand.prototype.output = function(){
	return "rt " +this.amount;
};




// base view and utility methods

Backbone.Model.prototype.output = function(){
	// pretty printing!
	return JSON.stringify( this.toJSON(), null, "\t" );
};


//extends Backbone.Model

LG.ButtonModel = Backbone.Model.extend({
	// simple button model with one parameter
	defaults:{
		disabled:false,
		show:true
	}
});


Backbone.Collection.prototype.getByProperty = function(propName, propVal){
	var selectedModel = null;
	this.each( function(model){
		if(model.get(propName) == propVal){
			selectedModel = model;
		}
	});
	return selectedModel;
};

LG.SpinnerModel = Backbone.Model.extend({
	defaults:{
		"show":false,
		"message":"Loading&hellip;"
	}
});
// extends Backbone.Model

LG.ImageModel = Backbone.Model.extend({

});



LG.UndoRedoFileModel = Backbone.Model.extend({
	initialize: function(){
		this.restart();
		this.editing = false;
		this.listenTo(this, this.getWatchString(), $.proxy(this.modelChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
	},
	getWatchString:function(){
		var i, s = [ ];
		for(i = 0;i <= this.watchString.length - 1;i++){
			s.push ("change:"+this.watchString[i]);
		}
		return s.join(" ");
	},
	restart:function(options){
		this.history = [  { "logo":null, "dino":0 }  ];
		this.pointer = 0;
	},
	getValues : function(){
		var i, obj = {};
		for(i = 0;i <= this.watchString.length - 1;i++){
			obj[this.watchString[i]] = this.get(this.watchString[i]);
		}
		return obj;
	},
	modelChanged:function(){
		if(this.editing){
			return;
		}
		var h, p, newValue;
		h = this.history;
		p = this.pointer;
		newValues = this.getValues();
		while(p < h.length - 1){
			h.pop();
		}
		if(h.length === 0){
			h.push(newValues);
			this.pointer = 0;
		}
		else if(h.length < LG.UndoRedoFileModel.MAX_HISTORY){
			h.push(newValues);
			this.pointer = p + 1;
		}
		else{
			h.splice(0, 1);
			h.push(newValues);
		}
	},
	canUndo:function(){
		if(this.history.length === 0 || this.pointer === 0){
			return false;
		}
		return true;
	},
	canRedo:function(){
		if(this.history.length === 0 || this.pointer === this.history.length - 1){
			return false;
		}
		return true;
	},
	reload:function(){
		this.editing = true;
		this.set(this.history[this.pointer]);
		this.trigger("change");
		this.editing = false;
	},
	undo:function(){
		if(!this.canUndo()){
			return;
		}
		this.pointer = this.pointer - 1;
		this.reload();
	},
	redo:function(){
		if(!this.canRedo()){
			return;
		}
		this.pointer = this.pointer + 1;
		this.reload();
	}	
});

LG.UndoRedoFileModel.MAX_HISTORY = 20;

LG.FileModel = LG.UndoRedoFileModel.extend({
	defaults:{
		name:null,
		logo:null,
		votes:0,
		userId:null,
		img:null,
		dino:0
	},
	watchString:["logo","dino"],
	idAttribute: "_id", 
	urlRoot:"/files",
	initialize:function(data){
		LG.UndoRedoFileModel.prototype.initialize.call(this);
		this.dirty = false;
		if(data && data.dirty){
			this.dirty = true;
		}
		this.listenTo(this, "save sync", $.proxy(this.synced, this));
		this.listenTo(this, "error", $.proxy(this.error, this));
		this.listenTo(this, "change:logo change:dino", $.proxy(this.onChanged, this));
	},
	parse:function(data){
		delete data._v;
		delete data.success;
		return data;
	},
	incrementDino:function(){
		var d1, d2;
		d1 = this.get("dino");
		d2 = (d1 + 1) % LG.FileModel.NUM_DINO;
		this.set({"dino":d2});
	},
	reset:function(){
		this.set({"logo":""});
	},
	isSaved:function(){
		var saved = !this.dirty;
		return saved;
	},
	onChanged:function(){
		this.dirty = true;
	},
	parse: function(data) {
		return data;
	},
	error:function(model, xhr, options){
		var response = $.parseJSON(xhr.responseText);
		LG.Utils.growl("Error: "+response.error);
	},
	synced:function(e){
		console.log("syncved");
		this.dirty = false;
		this.trigger("change");
	}
});



LG.FileModel.NUM_DINO = 5;


LG.ASpinnerCollection  = Backbone.Collection.extend({
	initialize:function(data){
		Backbone.Collection.prototype.initialize.call(this, data);
		this.listenTo(this, "sync", $.proxy(this.onSync, this));
	},
	onSync:function(){
		setTimeout(function(){
			LG.spinnerModel.set({"show":false});
		}, 1000);
	},
	fetch:function(data){
		LG.spinnerModel.set({"show":true});
		Backbone.Collection.prototype.fetch.call(this, data);
	}
});


LG.PageModel = Backbone.Model.extend({
	defaults:{
		numPages:1,
		maxPage:1
	}
});

LG.APaginatedCollection  = LG.ASpinnerCollection.extend({
	initialize:function(data){
		LG.ASpinnerCollection.prototype.initialize.call(this, data);
		this.pageModel = new LG.PageModel();
	},
	parse: function(response) {
		this.pageModel.set({"numPages":parseInt(response.numPages, 10), "maxPage":parseInt(response.maxPage, 10)});
		return response.files;
	},
	nextPage:function(){
		var c = this.pageModel.get("numPages");
		if(  (c + 1) <= this.pageModel.get("maxPage")){
			this.pageModel.set({"numPages": c + 1});
			this.load();
		}
	},
	getData:function(){
		var data = {};
		data.numPages = this.pageModel.get("numPages");
		data.perPage = LG.APaginatedCollection.PER_PAGE;
		return data;
	}
});

LG.APaginatedCollection.PER_PAGE = 24;



LG.ASelectedFileCollection = LG.APaginatedCollection.extend({
	initialize:function(){
		LG.APaginatedCollection.prototype.initialize.call(this);
		this.addNewModel();
	},
	addNewModel:function(options){
		if(options && options.force){
			this.remove(this.selected);
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new this.model({"dirty":false});
		}
		this.add(this.selected);
	},
	onSync:function(){
		LG.APaginatedCollection.prototype.onSync.call(this);
		this.addNewModel();
	}
});




LG.AFileCollection  = LG.ASelectedFileCollection.extend({
	model:LG.FileModel,
	initialize:function(){
		LG.ASelectedFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		return data = LG.ASelectedFileCollection.prototype.getData.call(this);
	},
	load:function(options){
		var data = _.extend({"data" : this.getData() , "processData" : true}, options);
		this.fetch(data);
	}
});




LG.AFileCollection.validateFileName = function(name){
	var ws;
	if(name.length <= 2){
		return false;
	}
	ws = name.replace(/\s/g, "");
	if(ws.length <= 2){
		return false;
	}
	return true;
};



LG.FileCollection = LG.AFileCollection.extend({
	url:"/files",
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change:loggedIn", $.proxy(this.onLoginChanged, this));
	},
	getData:function(){
		var data = LG.AFileCollection.prototype.getData.call(this);
		data.userId = LG.userModel.get("userId");
		return data;
	},
	onLoginChanged:function(){
		var logo, dino, loggedIn = LG.userModel.get("loggedIn");
		if(loggedIn){
			logo = this.selected.get("logo");
			dino = this.selected.get("dino");
			this.load({"success":function(){
				// TODO console.log("logo was " + logo+" & "+dino+", do I need to load it again?");
			}});
		}
		else{
			this.reset();
			this.addNewModel({"force":true});
		}
	},
	isSaved:function(){
		return this.selected.isSaved();
	},
	logoChanged:function(){
		this.trigger("change");
	},
	openOthers:function(model){
		var newModel, data;
		// set name as null because you need to change it
		data = {"name":null, "logo":model.logo, "dino":model.dino};
		if(this.selected.isNew()){
			this.selected.set(data);
		}
		else{
			// proper file is open
			this.selected = new this.model(_.extend({}, data, {"dirty":true}));
			this.add(this.selected);
		}
	},
	save:function(options){
		if(LG.userModel.isConnected()){
			if(!this.selected.isNew()){
				this.saveCurrentFile(options);
			}
			else{
				LG.router.navigate("filename", {"trigger":true});
			}
		}
		else{
			LG.Utils.growl("Please log in to save your work");
		}
	},
	loadModel:function(model){
		if(this.selected){
			this.remove(this.selected);
		}
		this.selected = model;
		this.trigger("change");
	},
	loadById:function(id){
		var selectedModel;
		if(this.selected.get("_id") === id){
			LG.Utils.growl("File already open");
		}
		else{
			selectedModel = this.getByProperty("_id", id);
			if(selectedModel){
				this.loadModel(selectedModel);
			}
		}
	},
	deleteCurrentFile:function(callback){
		var _this = this;
		var options = {
			"success":function(){
				LG.Utils.growl("File deleted");
				_this.addNewModel({"force":true});
				callback.success();
			}
		};
		if(this.selected.isNew()){
			this.selected.set({"logo":null});
		}
		else{
			var m = this.selected;
			this.selected.destroy(options);
		}
	},
	saveCurrentFile:function(options){
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		var data = {"img":LG.imageModel.get("img"),"logo":LG.fileCollection.selected.get("logo"),"userId":LG.userModel.get("userId")};
		LG.Utils.log("save "+JSON.stringify(data));
		this.selected.save(data, options);
	},
	nameOk:function(name){
		var error = false;
		if(!LG.AFileCollection.validateFileName(name)){
			error = "Please enter a valid filename";
		}
		else{
			this.each( function(model){
				if(model.get("name") === name){
					error = "That name is taken, please choose another filename";
				}
			});
		}
		return error;
	},
	saveFileAs:function(name, callback){
		var _this = this, model, data, options;
		model = new this.model();
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		data = {"dino":LG.fileCollection.selected.get("dino"), "name":name, "logo":LG.fileCollection.selected.get("logo"), "img":LG.imageModel.get("img"), "userId":LG.userModel.get("userId")};
		options = {
			"success":function(model, response, options){
				model.set({"_id":response._id});
				_this.add(model);
				callback.success(response._id);
			},
			"error":function(model, xhr, options){
				
			}
		};
		model.save(data, options);
	}
});


LG.AllFileCollection = LG.AFileCollection.extend({
	url:"/files",
	initialize:function(){
		this.page = 0;
		this.num = 0;
		LG.AFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		var data = _.extend(LG.AFileCollection.prototype.getData.call(this), {"userId": null});
		alert("get data all "+JSON.stringify(data));
		return data;
	}
});





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



// extends Backbone.Model

LG.GraphicsModel = Backbone.Model.extend({
	initialize:function(){
		this.setColor(0);
		this.listenTo(LG.fileCollection, "add  sync change:dino", $.proxy(this.changeColor, this));
	},
	setColor:function(i){
		this.set({"color":LG.GraphicsModel.CLRS[i]});
	},
	changeColor:function(){
		var c = LG.fileCollection.selected.get("dino");
		this.setColor(c);
	}
});

LG.GraphicsModel.CLR0 = "#187d1a";
LG.GraphicsModel.CLR1 = "#e89000";
LG.GraphicsModel.CLR2 = "#15075b";
LG.GraphicsModel.CLR3 = "#c9344a";
LG.GraphicsModel.CLR4 = "#ca2e00";

LG.GraphicsModel.CLRS = [LG.GraphicsModel.CLR0, LG.GraphicsModel.CLR1, LG.GraphicsModel.CLR2, LG.GraphicsModel.CLR3, LG.GraphicsModel.CLR4];

	
LG.UserModel = Backbone.Model.extend({
	defaults: {
		"name":null,
		"userId":null,
		"pic":null,
		"pwd":null,
		"loggedIn":false
	},
	initialize: function(){
		this.clear();
		this.listenTo(this, "change", _.debounce($.proxy(this.persist, this), 1000));
	},
	persist:function(){
		var keys = ["userId"];
		var vals = [this.get("userId")];
		LG.storage.saveAll(keys, vals, function(){});
	},
	clear:function(){
		this.set( {"name":null, "userId":null, "pic":null, "pwd":null, "loggedIn":false} );
	},
	loginClicked:function(){
		if(this.isConnected()){
			this.logout();
		}
		else{
			this.login();
		}
	},
	isConnected:function(){
		return (this.get("loggedIn") !== false);
	}
});



// web

LG.WebUserModel = LG.UserModel.extend({
	login:function(){
		var users = ["100","200","300"], user;
		if(LG.facebook){
			LG.facebook.login({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					alert("fail");
				}
			});
		}
		else{
			user = users[Math.floor(Math.random()*100) % users.length];
			alert("you are "+user);
			this.set({"loggedIn":"facebook", "userId":user, "name":"n"+user});
		}
	},
	logout:function(){
		if(LG.facebook){
			LG.facebook.logout({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					alert("fail");
				}
			});
		}
		else{
			this.clear();
		}
	},
	fbLoggedIn:function(options){
		this.loadFbData(options);
	},
	fbLoggedOut:function(options){
		this.clear();
		options.success();
	},
	loadFbData:function(options){
		var _this = this;
		LG.facebook.getMe({
			"success":function(response){
				LG.facebook.getPic({
					"success":function(pic){
						_this.set( {"name":response.name, "userId":response.id, "loggedIn":"facebook", "pic":pic.data.url} );
						options.success();
					},
					"fail":function(){
						options.fail();
					}	
				});
			},
			"fail":function(){
				options.fail();
			}
		});
	}
});



//ipad

LG.IPadUserModel = LG.UserModel.extend({
	login:function(){
		
	},
	logout:function(){
		
	}
});





LG.LayoutModel = Backbone.Model.extend({
	defaults: {
		show:""
	},
	initialize: function(){
		
	}
});




// base view for all views


Backbone.View.prototype.beforeClose = function () {
	// override this in each specific view
};

Backbone.View.prototype.afterAdded = function () {
	// override this in each specific view
};

Backbone.View.getTouch = function(obj){
	// static function
	var newObj = {};
	var clickEventName, downEventName, upEventName, swipeName, keyUpName;
	if(LG.Config.IS_TOUCH){
		clickEventName = "touchstart";
		downEventName = "touchstart";
		upEventName = "touchend";
		swipeName = "swipe";
	}
	else{
		clickEventName = "click";
		downEventName = "mousedown";
		upEventName = "mouseup";
		swipeName = "swipe";
	}
	keyUpName = "keyup";
	_.each(obj, function(val, key){
		var newKey = key.replace("_click", clickEventName);
		newKey = newKey.replace("_mousedown", downEventName);
		newKey = newKey.replace("_mouseup", upEventName);
		if(swipeName){
			newKey = newKey.replace("_swipe", swipeName);
		}
		newKey = newKey.replace("_keyup", keyUpName);
		newObj[newKey] = val;
	});
	return newObj;
};

Backbone.View.prototype.extendEvents = function (superClass, events) {
	if(_.isFunction(this.events) ){
		return _.extend({}, superClass.prototype.getEvents(),this.events());
	}
	else{
		return _.extend({}, superClass.prototype.getEvents(),this.events);
	}
};
 
Backbone.View.prototype.getEvents = function () {
	// overridden in subclasses!
	if(_.isFunction(this.events) ){
		return this.events();
	}
	else{
		return this.events;
	}
};

Backbone.View.prototype.stopProp = function (e) {
	if(e){
		e.stopPropagation();
		e.preventDefault();
	}
};

Backbone.View.prototype.close = function () {
	// when we delete a view we call close() on it
	// call the beforeClose method, remove the element from the stage
	// and remove listeners
	this.beforeClose();
	this.stopListening();
	this.unbind();
	this.remove();
};

Backbone.View.prototype.output = function(){
	// pretty printing!
	return JSON.stringify(this.toJSON());
};

Backbone.View.prototype.rerender = function(){
	// render and add back at the same position in the parent.
	var parent = this.$el.parent();
	var index = this.$el.index();
	var siblings = parent.children();
	var len = siblings.length;
	var before;
	var after;
	if(len >= 2){
		if(index >= 1){
			before = siblings.eq(index-1);
		}
		if(index <= len - 2){
			after = siblings.eq(index + 1);
		}
	}
	this.$el.remove();
	this.render();
	if(before){
		before.after(this.$el);
	}
	else if(after){
		after.before(this.$el);
	}
	else{
		parent.append(this.$el);
	}
};

Backbone.View.prototype.getTemplate = function (url, data, options) {
	// get compiled template
	var compiledTemplate = LG.templates.getTemplate(url);
	if(!compiledTemplate){
		throw new Error("template "+url+" not found");
	}
	var html = "";
	try{
		html = compiledTemplate(data);
	}
	catch(e){
		throw new Error(url+" template failed "+e.message);
	}
	return html;
};

Backbone.View.prototype.loadTemplate = function (url, data, options) {
	// load template into view.  If replace then use the html itself, rather than adding it to a div
	var html = this.getTemplate(url, data, options);
	options = _.extend({replace:false}, options);  // defaults
	if(options.replace){
		this.setElement(html);  // this will rebind the events on the element
	}
	else{
		this.$el.html(html);
	}
};


// extends Backbone.View - a base class for all "this is a page" views
LG.AbstractPageView = Backbone.View.extend({
	
});



LG.Button = Backbone.View.extend({
	initialize:function(){
		this.model = new LG.ButtonModel();
		this.listenTo(this.model, "change", $.proxy(this.buttonVisChanged, this));
	},
	buttonVisChanged:function(){
		this.rerender();
	},
	getShow:function(){
		return this.model.get("show");
	},
	getDisabled:function(){
		return this.model.get("disabled");
	},
	getData:function(){
		return {};
	},
	render:function(){
		var defaultData, data;
		defaultData = { show: this.getShow(), disabled: this.getDisabled() };
		data = _.extend(defaultData, this.getData());
		this.loadTemplate(  this.template, data , {replace:true} );
		return this;
	},
	disableButton:function(data){
		this.model.set( {"disabled":data.disabled} );
	},
	showButton:function(data){
		this.model.set( {"show":data.show} );
	}
});

LG.HeaderButton = LG.Button.extend({
	
});
// go back to catalogue

// extends LG.Headerbutton

LG.TextButtonView = LG.HeaderButton.extend({
	template:"tpl_textbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		
	},
	
	render:function(){
		this.loadTemplate(  this.template, { show: this.getShow(), disabled: this.getDisabled() } , {replace:true} );
		return this;
	},
	onClick:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_TEXT);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});


// go back to catalogue

// extends LG.HeaderButton

LG.LogoButtonView = LG.HeaderButton.extend({
	template:"tpl_logobutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("write", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});


// go back to catalogue

// extends LG.Headerbutton

LG.ALoginButtonView = LG.HeaderButton.extend({
	template:"tpl_loginbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		LG.userModel.loginClicked();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});




// web

LG.WebLoginButtonView  = function(){
	LG.ALoginButtonView.call(this);
}

LG.WebLoginButtonView.prototype = Object.create(LG.ALoginButtonView.prototype);

LG.WebLoginButtonView.prototype.constructor = LG.WebLoginButtonView;

LG.WebLoginButtonView.prototype.getData = function(){
	var user = LG.userModel.toJSON(), label, connected;
	connected = LG.userModel.isConnected();
	if(connected){
		label = "Logout";
	}
	else{
		label = "Facebook login";
	}
	return {"label":label, "name":user.name, "pic":user.pic};
};


// ipad

LG.IPadLoginButtonView  = function(){
	LG.ALoginButtonView.call(this);
}

LG.IPadLoginButtonView.prototype = Object.create(LG.ALoginButtonView.prototype);

LG.IPadLoginButtonView.prototype.constructor = LG.IPadLoginButtonView;

LG.IPadLoginButtonView.prototype.getData = function(){
	return {"label":"", "pic":null, "disabled":true};
};







// go back to catalogue

// extends LG.Headerbutton

LG.GalleryButtonView = LG.HeaderButton.extend({
	template:"tpl_gallerybutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("gallery", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	}
});


// go back to catalogue

// extends LG.HeaderButton

LG.HelpButtonView = LG.HeaderButton.extend({
	template:"tpl_helpbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.SHOW_HELP_OVERLAY);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

LG.HelpButtonMenuView = LG.HeaderButton.extend({
	template:"tpl_helpbuttonmenu",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("help", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

// go back to catalogue

// extends LG.Headerbutton

LG.SaveButtonView = LG.HeaderButton.extend({
	template:"tpl_savebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		var data = this.getData();
		if(data.loggedIn && !data.disabled){
			LG.fileCollection.save({});
		}
		else if(!data.loggedIn){
			LG.Utils.growl("Please log in to save your work");
		}
	},
	getData:function(){
		var disable = true, fileModel, loggedIn;
		loggedIn = LG.userModel.isConnected();
		fileModel = LG.fileCollection.selected;
		if(loggedIn){
			disable = fileModel.isSaved();
		}
		return {"loggedIn":loggedIn, "disabled":disable};
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

// go back to catalogue

// extends LG.Headerbutton

LG.ALoadButtonView = LG.HeaderButton.extend({
	template:"tpl_loadbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("load", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button:not(.disabled)":"onClick"
		});
		return obj;
	
	}
});



// web

LG.WebLoadButtonView  = function(){
	LG.ALoadButtonView.call(this);
}

LG.WebLoadButtonView.prototype = Object.create(LG.ALoadButtonView.prototype);

LG.WebLoadButtonView.prototype.constructor = LG.WebLoadButtonView;

LG.WebLoadButtonView.prototype.getData = function(){
	var loggedIn = LG.userModel.isConnected();
	return {"disabled":!loggedIn};
};


// ipad

LG.IPadLoadButtonView  = function(){
	LG.ALoadButtonView.call(this);
}

LG.IPadLoadButtonView.prototype = Object.create(LG.ALoadButtonView.prototype);

LG.IPadLoadButtonView.prototype.constructor = LG.IPadLoadButtonView;

LG.IPadLoadButtonView.prototype.getData = function(){
	var loggedIn = LG.userModel.isConnected();
	return {"disabled":!loggedIn};
};





// go back to catalogue

// extends LG.Headerbutton

LG.FileButtonView = LG.HeaderButton.extend({
	template:"tpl_filebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
	},
	getData:function(){
		var name = null, saved = false, fileModel;
		fileModel = LG.fileCollection.selected;
		name = fileModel.get("name");
		saved = LG.fileCollection.selected.isSaved();
		return {"name":name, "saved": saved};
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});


// go back to catalogue

// extends LG.Headerbutton

LG.DinoButtonView = LG.HeaderButton.extend({
	template:"tpl_dinobutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add  sync change:dino", $.proxy(this.rerender, this));
	},
	getData:function(){
		return {"dino":LG.fileCollection.selected.get("dino")};
	},
	onClick:function(e){
		this.stopProp(e);
		LG.fileCollection.selected.incrementDino();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;L
	}
});



// an abstract spinner view for the big and small spinners




LG.SpinnerView = Backbone.View.extend({
	initialize:function(data){
		this.model = data.model;
		this.listenTo(this.model, "change", $.proxy(this.change, this));
		this.data = {message:""};
	},
	template:"tpl_spinner",
	change:function(){
		if(this.model.get("show")){
			$("body").append(this.render().$el);
			this.$el.css("display","block");
		}
		else{
			this.$el.css("display","none");
			this.$el.remove();
		}
	},
	render:function(){
		this.loadTemplate(  this.template, {}  , {replace:true} );
		return this;
	},
	beforeClose:function(){
		
	}
});





window.LG.Easel = window.LG.Easel || {};

LG.Easel.Turtle = function(size) {
	this.initialize(size);
	_.extend(this, Backbone.Events);
	this.listenTo(LG.graphicsModel, "change", $.proxy(this.drawMe, this));
}

LG.Easel.Turtle.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Turtle.prototype.constructor = LG.Easel.Turtle;

LG.Easel.Turtle.prototype.drawMe = function() {
	var g = this.graphics, clr = LG.graphicsModel.get("color");
	g.clear();
	g.setStrokeStyle(0);
	g.beginStroke(clr);
	g.beginFill(clr);
	g.moveTo(-this.size,-this.size);
	g.lineTo(this.size,0);
	g.lineTo(-this.size,this.size);
	g.lineTo(-this.size,-this.size);
	g.endFill();
	LG.EventDispatcher.trigger(LG.Events.TICK);
};

LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
	this.drawMe();
};



// extends LG.AbstractPageView

LG.ActivityView = LG.AbstractPageView.extend({
	template:"tpl_activity",
	name:"activity",
	initialize:function(){
		this.listenTo(LG.EventDispatcher, LG.Events.SHOW_HELP_OVERLAY, $.proxy(this.showHelp, this));
		this.listenTo(LG.EventDispatcher, LG.Events.HIDE_HELP_OVERLAY, $.proxy(this.hideHelp, this));
	},
	showHelp:function(){
		if(!this.helpOverlayView){
			this.helpOverlayView = new LG.HelpOverlayView();	
			this.$el.append(this.helpOverlayView.render().el);
		}
	},
	hideHelp:function(){
		if(this.helpOverlayView){
			this.helpOverlayView.close();
			this.helpOverlayView = null;
		}
	},
	render:function(){
		
		this.loadTemplate(  this.template, { }, {replace:true}  );
		
		this.canvasView = new LG.CanvasView();
		this.$el.append(this.canvasView.render().el);
		
		this.writeView = new LG.WriteView();
		this.$el.append(this.writeView.render().el);
		
		this.helpView = new LG.HelpView();
		this.$el.append(this.helpView.render().el);
		
		this.galleryView = new LG.GalleryView({"collection":LG.allFilesCollection});
		this.$el.append(this.galleryView.render().el);
		
		this.filenameView = new LG.FileNameView();
		this.$el.append(this.filenameView.render().el);
		
		this.menuView = new LG.MenuView();
		this.$el.append(this.menuView.render().el);
		
		this.loadView = new LG.LoadView({"collection":LG.fileCollection});	
		this.$el.append(this.loadView.render().el);
		
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			
		});
		return obj;
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		this.canvasView.afterAdded();
		this.writeView.afterAdded();
		this.galleryView.afterAdded();
		this.menuView.afterAdded();
		this.loadView.afterAdded();
	}
	
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.BaseButton = LG.Button.extend({
	
});



// extends LG.AbstractPageView

LG.ActivityButtonsView = Backbone.View.extend({
	template:"tpl_activitybuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.startButton = new LG.StartButtonView();
		this.stopButton = new LG.StopButtonView();
		this.$el.append(this.startButton.render().el).append(this.stopButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.startButton){
			this.startButton.close();
		}
		if(this.stopButton){
			this.stopButton.close();
		}
		this.startButton = null;
		this.stopButton = null;
	},
	afterAdded:function(){
		
	}
	
});



LG.CanvasView = Backbone.View.extend({
	
	initialize:function(){
		this.model = new LG.CanvasModel();
		LG.EventDispatcher.bind(LG.Events.COMMAND_FINISHED, $.proxy(this.nextCommand, this));
		LG.EventDispatcher.bind(LG.Events.TICK, $.proxy(this.tick, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_DRAW, $.proxy(this.draw, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_STOP, $.proxy(this.stop, this));
		LG.EventDispatcher.bind(LG.Events.RESIZE, $.proxy(this.onResize, this));
		LG.EventDispatcher.bind(LG.Events.RESET_CANVAS, $.proxy(this.reset, this));
		LG.EventDispatcher.bind(LG.Events.CAPTURE_IMAGE, $.proxy(this.capture, this));
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
		this.listenTo(this.model, "change", $.proxy(this.reset, this));
	},
	template:"tpl_canvas",
	render:function(){
		this.loadTemplate(this.template, this.model.toJSON(), {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click img.help":"clickHelp",
			"_click":"clickMe"
		});
		return obj;
	},
	clickHelp:function(e){
		this.stopProp(e);
		alert("help");
	},
	onLayoutChanged:function(){
		var show = LG.layoutModel.get("show");
		var hideIf = ["gallery", "load"];
		if(hideIf.indexOf(show) != -1){
			this.$el.hide();
		}
		else{
			this.$el.show();
		}
	},
	clickMe:function(){
		if(LG.layoutModel.get("show") == "write"){
			if(this.active){
				LG.EventDispatcher.trigger(LG.Events.CLICK_STOP);
			}
			else{
				LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
			}
		}
	},
	onResize:function(){
		var w, h;
		w = $("body").width() - 230;
		h = $("body").height();
		this.$el.width(w).height(h);
		this.model.set({"width":w, "height":h});
		this.stop();
	},
	
	afterAdded:function(){
		this.reset();
	},
	removeAll:function(){
		if(this.container){
			this.container.removeAllChildren();
		}
		if(this.stage){
			this.stage.removeAllChildren();
		}
		this.stage = null;
		this.turtle = null;
		this.container = null;
		this.canvas = null;
	},
	reset:function(){
		this.active = false;
		this.ended = false;
		this.removeAll();
		this.canvas = document.getElementById("gamecanvas");
		$(this.canvas).attr("width", this.model.get("width") ).attr("height", this.model.get("height") );
		this.stage = new createjs.Stage(this.canvas);
		this.turtle = new LG.Easel.Turtle(10);
		this.container = new createjs.Container();
		this.container.addChild(this.turtle);
		this.stage.addChild(this.container);
		this.position = {theta:-Math.PI/2, x:this.model.get("width")/2, y:this.model.get("height")/2};
		this.tick();
	},
	tick:function(){
		if(this.turtle){
			this.turtle.x = this.position.x;
			this.turtle.y = this.position.y;
			this.turtle.rotation = this.position.theta*180/Math.PI;
		}
		this.stage.update();
	},
	stop:function(){
		this.active = false;
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
		console.log("Worker said : " + JSON.stringify(msg.data));
		if(data.type === "command"){
			if(data.name === "fd"){
				command = new LG.FdCommand(data.amount);
			}
			else if(data.name === "rt"){
				command = new LG.RtCommand(data.amount);
			}
			console.log("command "+command+" "+command.output());
			this.output.add(command);
			size = this.output.size();
			if(size >= LG.output.MAX_SIZE){
				this.worker.terminate();
				this.ended = true;
			}
		}
		else if(data.type === "message"){
			alert("message "+data.message);
		}
		else if(data.type === "end"){
			console.log("ended!");
			this.ended = true;
		}
	},
	draw:function(){	
		this.reset();
		this.active = true;
		this.ended = false;
		this.output = new LG.output();
		this.commandIndex = 0;
		var logo = LG.fileCollection.selected.get("logo");
		var tree = LG.Utils.logoparser.parse(logo); // put this in a worker too?? YES!
		this.process(tree);
	},
	process:function(tree){
		this.worker = new Worker("min/parser/visit.js");
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
		setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
	},
	capture:function(){
		var context, data, compositeOperation, tempCanvas, tempContext, img;
		context = this.canvas.getContext("2d");
		var x0 = Math.max(0, (this.canvas.width - LG.CanvasView.SNAPSHOT_WIDTH)/2 );
		var y0 = Math.max(0, (this.canvas.height - LG.CanvasView.SNAPSHOT_HEIGHT)/2 );
		//console.log("canvas: "+this.canvas.width+","+this.canvas.height+": "+x0+","+y0+","+LG.CanvasView.SNAPSHOT_WIDTH+","+LG.CanvasView.SNAPSHOT_HEIGHT);
		data = context.getImageData(x0, y0, LG.CanvasView.SNAPSHOT_WIDTH, LG.CanvasView.SNAPSHOT_HEIGHT);
		tempCanvas = document.createElement("canvas");
		tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = LG.CanvasView.SNAPSHOT_WIDTH;
		tempCanvas.height = LG.CanvasView.SNAPSHOT_HEIGHT;
		tempContext.putImageData(data, 0, 0);
		img = tempCanvas.toDataURL("image/png");
		LG.imageModel.set({"img":img});
	},
	finished:function(){
		LG.Utils.growl("Finished!");
		this.active = false;
		this.trigger(LG.Events.DRAW_FINISHED);
	},
	drawBatch:function(){
		var size = this.output.size(), i;
		if(!this.active){
			clearInterval( this.drawInterval );
		}
		for(i = 0; i <= LG.output.BATCH_SIZE - 1; i++){
			var command = this.output.at(this.commandIndex);
			console.log("drawBatch "+command);
			if(command){
				command.execute(this.stage, this.container, this.position);
				this.commandIndex++;
			}
		}
		this.tick();
		var done = (this.ended && (this.commandIndex >= this.output.size() - 1) );
		if(done){
			this.finished();
		}
		else{
			setTimeout($.proxy(this.drawBatch, this), LG.output.TIMEOUT);
		}
	},
	beforeClose:function(){
	
	}
});

LG.CanvasView.SNAPSHOT_WIDTH = 300;
LG.CanvasView.SNAPSHOT_HEIGHT = 300;

LG.CanvasModel = Backbone.Model.extend({
	defaults:{
		width:300,
		height:300
	}
});


/**

// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

**/
LG.AMenuView = Backbone.View.extend({	
	initialize:function(){
		var _this = this;
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
	},
	showName:"",
	onLayoutChanged:function(){
		var showName = LG.layoutModel.get("show");
		if(showName === this.showName){
			this.$el.addClass("show");
			this.onShow();
		}
		else{
			this.$el.removeClass("show");
			this.onHide();
		}
	},
	onShow:function(){
	
	},
	onHide:function(){
		
	}
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.MenuButton = LG.Button.extend({
	
});



LG.MenuView = LG.AMenuView.extend({
	
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	template:"tpl_menu",
	showName:"menu",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.menuButtons = new LG.MenuButtonsView();
		this.menuTop = new LG.MenuTopView();
		this.$el.append(this.menuTop.render().$el).append(this.menuButtons.render().$el);
		return this;
	},
	swipeMe:function(e){
		this.stopProp(e);
		if(e.gesture.direction === "right"){
			LG.router.navigate("write", {"trigger":true});
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"_swipe":"swipeMe"
		} );
		return obj;
	}
});




	

// extends LG.AbstractPageView

LG.MenuButtonsView = Backbone.View.extend({
	template:"tpl_menubuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.galleryButton 		= 	new LG.GalleryButtonView();
		this.loadButton 		= 	LG.create.loadButton();
		this.helpButton 		= 	new LG.HelpButtonMenuView ();
		this.loginButton 		= 	LG.create.loginButton();
		this.logoButton			=	new LG.LogoButtonView ();
		this.$el.append(this.helpButton.render().el).append(this.loadButton.render().el).append(this.galleryButton.render().el).append(this.loginButton.render().el)
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
	
});



// extends LG.AbstractPageView

LG.MenuTopView = Backbone.View.extend({
	template:"tpl_menutop",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.writeButton 		= 	new LG.WriteButtonView();
		this.$el.append(this.writeButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.writeButton){
			this.writeButton.close();
		}
		this.writeButton = null;
	},
	afterAdded:function(){
		
	}
	
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.WriteButtonView = LG.MenuButton.extend({
	template:"tpl_writebutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getData:function(){
		return {"name":"Johns file", "saved":true};
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("write", {"trigger":true});
	}
	
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.SettingsButtonView = LG.MenuButton.extend({
	template:"tpl_settingsbutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("menu", {"trigger":true});
	}
	
});



LG.Popups = function(){

};

LG.Popups.prototype.openPopup = function(data, callbacks){
	this.alertView = new LG.AlertView(data);
	$("#activity").append(this.alertView.render().el);
	LG.router.navigate("alert", {"trigger":true});
	
	LG.EventDispatcher.on(LG.Events.ALERT_OK, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_OK);
		if(_.isFunction(callbacks.ok)){
			callbacks.ok();
		}
	});
	
	LG.EventDispatcher.on(LG.Events.ALERT_CANCEL, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_CANCEL);
		if(_.isFunction(callbacks.cancel)){
			callbacks.cancel();
		}
	});
	LG.EventDispatcher.on(LG.Events.ALERT_NO, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_NO);
		if(_.isFunction(callbacks.no)){
			callbacks.no();
		}
	});
};

LG.Popups.prototype.closePopup = function(){
	if(this.alertView){
		this.alertView.close();
		this.alertView = null;
		LG.EventDispatcher.off(LG.Events.ALERT_OK);
		LG.EventDispatcher.off(LG.Events.ALERT_CANCEL);
		LG.EventDispatcher.off(LG.Events.ALERT_NO);
	}
};

LG.popups = new LG.Popups();

LG.APopUpView = LG.AMenuView.extend({
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	events:function(){
		var obj ;
		if(LG.Config.IS_TOUCH){
			obj = {
				"keypress input":"onKeyPress"
			};
		}
		else{
			obj = {
				"click input":"stopProp",
				"click .popupcontents":"clickCancel",
				"keypress input":"onKeyPress"
			};
		}
		return obj;
	},
	clickCancel:function(e){
		this.stopProp(e);
		window.history.back();
	},
	onKeyPress:function(e){
		if(e.which === 13){
			this.onEnterPress();
		}
	}
});



LG.AlertView = LG.APopUpView.extend({
	showName:"alert",
	initialize:function(data){
		this.data = data;
		LG.APopUpView.prototype.initialize.call(this);
		this.events = this.extendEvents(LG.APopUpView, this.events);
		this.render();
	},
	
	template:"tpl_alert",
	
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#cancelbutton":"clickCancel",
			"_click a#okbutton":"clickOk",
			"_click a#nobutton":"clickNo"
		});
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, this.data , {replace:true} );
		return this;
	},
	clickOk:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_OK);
	},
	clickCancel:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_CANCEL);
	},
	clickNo:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_NO);
	},
	onShow:function(){
		
	}
});




// generic alert message box with ok button

// extends LG.APopUpView

LG.FileNameView = LG.APopUpView.extend({
	showName:"filename",
	initialize:function(){
		LG.APopUpView.prototype.initialize.call(this);
		this.events = this.extendEvents(LG.APopUpView, this.events);
		this.render();
	},
	
	template:"tpl_filename",
	
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#cancelbutton":"clickCancel",
			"_click a#okbutton":"clickOk"
		});
		return obj;
	},
	onShow:function(){
		this.$("p.error").text("");
		$("input#filenametext").val("");
	},
	render:function(){
		this.loadTemplate(  this.template, {"error":""} , {replace:true} );
		return this;
	},
	getName:function(){
		return this.$("input#filenametext").val();
	},
	clickOk:function(e){
		this.stopProp(e);
		var name = this.getName(), options, error;
		error = LG.fileCollection.nameOk(name);
		if(error){
			this.$("p.error").text(error);
		}
		else{
			options = {
				"success":function(id){
					LG.router.navigate("write/"+id, {"trigger":true});
				},
				"error":function(){
					
				}
			};
			LG.fileCollection.saveFileAs(name, options);
		}
	},
	clickCancel:function(e){
		this.stopProp(e);
		window.history.back();
	}
});





// extends Backbone.View - a base class for all "this is a button in the header" views
LG.WriteButton = LG.Button.extend({
	
});



LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 500, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		LG.EventDispatcher.on(LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
	},
	template:"tpl_write",
	showName:"write",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.writeButtons = new LG.WriteButtonsView();
		this.writeTop = new LG.WriteTopView();
		this.$el.append(this.writeButtons.render().$el).append(this.writeTop.render().$el);
		return this;
	},
	draw:function(){
		this.save();
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW);
	},
	load:function(){
		var fileModel = LG.fileCollection.selected;
		this.setLogo(fileModel.get("logo"));
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	save:function(){
		var data = {"logo":this.getLogo()};
		LG.fileCollection.selected.set(data);
	},
	setLogo:function(s){
		this.$("textarea").val(s);
	},
	getLogo:function(){
		return this.$("textarea").val();
	},
	changedText:function(e){
		if(e.which === 186 || e.which === 13 || e.which === 32){
			LG.fileCollection.selected.set({"logo":this.getLogo()});
		}
		else{
			this.changedTextDeBounce();
		}
	},
	swipeMe:function(e){
		this.stopProp(e);
		if(e.gesture.direction === "right"){
			LG.router.navigate("menu", {"trigger":true});
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"_swipe":"swipeMe"
		} );
		return obj;
	}
});





// extends LG.AbstractPageView

LG.WriteButtonsView = Backbone.View.extend({
	template:"tpl_writebuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.undoButton = new LG.UndoButtonView();
		this.redoButton = new LG.RedoButtonView();
		this.clearButton = new LG.ClearButtonView();
		this.saveButton = 	new LG.SaveButtonView ();
		this.deleteButton = new LG.DeleteButtonView ();
		this.newButton = new LG.NewButtonView ();
		this.$el.append(this.saveButton.render().el).append(this.newButton.render().el).append(this.undoButton.render().el).append(this.redoButton.render().el).append(this.clearButton.render().el).append(this.deleteButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.redoButton){
			this.redoButton.close();
		}
		if(this.undoButton){
			this.undoButton.close();
		}
		if(this.clearButton){
			this.clearButton.close();
		}
		this.redoButton = null;
		this.clearButton = null;
		this.undoButton = null;
	},
	afterAdded:function(){
		
	}
	
});



// extends LG.AbstractPageView

LG.WriteTopView = Backbone.View.extend({
	template:"tpl_writetop",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.fileButton = new LG.FileButtonView ( );
		this.dinoButton = new LG.DinoButtonView ( );
		this.settingsButton = new LG.SettingsButtonView ( );
		this.helpButton = new LG.HelpButtonView ( );
		this.$el.append(this.dinoButton.render().el).append(this.fileButton.render().el).append(this.settingsButton.render().el).append(this.helpButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.fileButton){
			this.fileButton.close();
		}
		if(this.settingsButton){
			this.settingsButton.close();
		}
		this.fileButton = null;
		this.settingsButton = null;
	},
	afterAdded:function(){
		
	}
	
});



LG.UndoRedoButton = LG.WriteButton.extend({
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "change add sync", $.proxy(this.rerender, this));
	},
	clickMe:function(e){
		
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	}
});

// extends Backbone.View - a base class for all "this is a button in the header" views
LG.UndoButtonView = LG.UndoRedoButton.extend({
	template:"tpl_undobutton",
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_UNDO);
	},
	getDisabled:function(){
		var canUndo = LG.fileCollection.selected.canUndo();
		return !canUndo;
	}
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.RedoButtonView = LG.UndoRedoButton.extend({
	template:"tpl_redobutton",
	getDisabled:function(){
		var canRedo = LG.fileCollection.selected.canRedo();
		return !canRedo;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_REDO);
	}
	
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.TidyButtonView = LG.WriteButton.extend({
	template:"tpl_tidybutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_TIDY);
	}
	
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.ClearButtonView = LG.WriteButton.extend({
	template:"tpl_clearbutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "change", $.proxy(this.rerender, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_CLEAR);
		LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
	},
	getDisabled:function(){
		var logo = LG.fileCollection.selected.get("logo");
		if(!logo || logo === ""){
			return true;
		}
		return false;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	}
	
});


// extends Backbone.View - a base class for all "this is a button in the header" views
LG.DeleteButtonView = LG.WriteButton.extend({
	template:"tpl_deletebutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getDisabled:function(){
		var fileModel = LG.fileCollection.selected;
		if(!fileModel.isNew()){
			return false;
		}
		return true;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	},
	alertOk:function(){
		var options = {
			"success":function(){
				LG.router.navigate("write", {"trigger":true});
			}
		};
		LG.fileCollection.deleteCurrentFile(options);
	},
	alertNo:function(){
		window.history.back();
	},
	alertCancel:function(){
		window.history.back();
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
	},
	clickMe:function(e){
		this.stopProp(e);
		var model = LG.fileCollection.selected;
		if(LG.userModel.isConnected()){
			if(!model.isNew()){
				LG.popups.openPopup({"message":LG.Messages.WANT_TO_DELETE, "okColor":2, "noColor":1, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
			}
		}
	}	
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.NewButtonView = LG.WriteButton.extend({
	template:"tpl_newbutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getData:function(){
		return {"disabled":false};
	},
	alertOk:function(){
		this.listenToOnce(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
		LG.fileCollection.save();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		window.history.back();
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.newFile();
		LG.router.navigate("write", {"trigger":true});
	},
	newFile:function(){
		LG.fileCollection.addNewModel({"force":true});
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
	},
	clickMe:function(e){
		this.stopProp(e);
		var loggedIn = LG.userModel.isConnected();
		var fileModel = LG.fileCollection.selected;
		if(!loggedIn){
			// can't save it anyway 
			this.newFile();
		}
		else{
			if(!fileModel.isSaved()){
				// unsaved
				LG.popups.openPopup({"message":LG.Messages.WANT_TO_SAVE,  "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
			}
			else{
				// dump the old file, make a new one
				this.newFile();
			}
		}
	}
	
});

LG.HelpView = LG.AMenuView.extend({
	template:"tpl_help",
	showName:"help",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click #cancelbutton":"clickCancel"
		});
		return obj;
	},
	clickCancel:function(){
		window.history.back();
	},
	updateLayout : function() {
		if(this.wrapper && this.scroller && this.myScroll){
			var wrapperWidth = this.wrapper.width(), wrapperHeight = this.wrapper.height();
			this.$(".helpcontainer").width(wrapperWidth - 1).height(wrapperHeight - 1);
			this.scroller.css('width',  this.$(".helpcontainer").length * wrapperWidth + 1);
			console.log("wrapperWidth "+wrapperWidth + "  " + this.$(".helpcontainer").length);
			this.myScroll.refresh();
		}
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.scroller = this.$("#helpscroller");
		this.wrapper = this.$("#helpwrapper");
		return this;
	},
	onShow:function(){
		this.initScroll();
	},
	onHide:function(){
		
	},
	beforeClose:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	},
	initScroll:function(){
		var _this = this;
		this.myScroll = new IScroll("#helpwrapper", {snap:".helpcontainer", scrollbars:true, scrollX:true, scrollY:false, interactiveScrollbars:true, momentum:false});
		this.updateLayout();
	}
});


LG.HelpOverlayView = Backbone.View.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		this.page = 0;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button.next":"clickNext",
			"_click button.copy":"clickCopy",
			"_click button.more":"clickMore",
			"_click button.draw":"clickDraw",
			"_click":"clickMe"
		} );
		return obj;
	},
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickNext:function(e){
		this.stopProp(e);
		this.next();
	},
	clickMore:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
		LG.router.navigate("help", {"trigger":true});
	},
	clickCopy:function(e){
		this.stopProp(e);
		this.$("button.draw").css("display", "block");
		this.copy();
	},
	copy:function(){
		var s = "fd(100);rt(90);fd(100);rt(90);fd(100);rt(90);fd(100);rt(90);";
		LG.fileCollection.selected.set({"logo":s});
	},
	next:function(){
		this.$el.removeClass("help"+this.page);
		this.page = (this.page + 1) % LG.HelpOverlayView.NUM_PAGES;
		this.$el.addClass("help"+this.page);
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		return this;
	},
	beforeClose:function(){
	
	}
});

LG.HelpOverlayView.NUM_PAGES = 4;


LG.AGalleryLRButtonView = LG.Button.extend({
	initialize:function(){
		LG.Button.prototype.initialize.call(this);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		this.trigger("navigatelr");
	}
});


LG.CancelButtonView = LG.Button.extend({
	initialize:function(){
		LG.Button.prototype.initialize.call(this);
	},
	template:"tpl_cancelbutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("menu", {"trigger":true});
	}
});


LG.GalleryLeftButtonView = LG.AGalleryLRButtonView.extend({
	initialize:function(){
		LG.AGalleryLRButtonView.prototype.initialize.call(this);
	},
	template:"tpl_galleryleftbutton"
});


LG.GalleryRightButtonView = LG.AGalleryLRButtonView.extend({
	initialize:function(){
		LG.AGalleryLRButtonView.prototype.initialize.call(this);
	},
	template:"tpl_galleryrightbutton"
});




LG.GalleryListView = Backbone.View.extend({
	
	initialize:function(options){
		this.pages = [ ];
		this.collection = options.collection
		this.showName = options.showName;
		this.perPage = LG.GalleryListView.NUMY;
		this.scrollPos = 0;
	},
	template:"tpl_gallerylist",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .galleryrow":"clickItem"
		});
		return obj;
	},
	removeAllPages:function(){
		_.each(this.pages, function(page, key){
			page.close();
		});
		this.pages = [ ];
	},
	clickItem:function(e){
		this.stopProp(e);
		var idToOpen = $(e.currentTarget).data("id");
		this.myScroll.scrollTo(0, 0); // fix this
		LG.EventDispatcher.trigger(LG.Events.PREVIEW_FILE, idToOpen);
	},
	addFiles:function(){
		var _this = this, i, page, numPages, models, pageModels, startIndex;
		models = this.collection.filter(function(model){
			return !model.isNew();
		});
		numPages = Math.ceil(models.length / this.perPage);
		this.removeAllPages();
		this.pages = [ ];
		for(i = 0; i <= numPages - 1; i++){
			startIndex = i * LG.GalleryListView.NUMY;
			pageModels = models.slice(startIndex, startIndex + LG.GalleryListView.NUMY);
			page = new LG.GalleryPageView({"pageModels":pageModels});
			_this.scroller.append(page.render().$el);
			_this.pages.push(page);
		}
		this.initScroll();
		this.updateLayout();
		this.goBack();
		this.status();
	},
	status:function(){
		var d = "none";
		if(this.pages.length === 0){
			d = "block";	
		}
		this.$(".nonefound").css("display", d);
	},
	goBack:function(){
		if(this.myScroll){
			this.myScroll.scrollTo(-this.scrollPos, 0);
		}
	},
	onShow:function(){
		this.listenTo(this.collection, "add sync", _.debounce($.proxy(this.addFiles, this)), 500);
		this.collection.load();
	},
	onHide:function(){
		this.stopListening(this.collection);
		this.removeAllPages();
		this.removeScroll();
	},
	render:function(){
		this.loadTemplate(  this.template, {"showName":this.showName} , {replace:true} );
		this.scroller = this.$("#listscroller"+this.showName);
		this.wrapper = this.$("#listwrapper"+this.showName);
		return this;
	},
	beforeClose:function(){
		this.removeAllPages();
		this.removeScroll();
	},
	removeScroll:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	},
	updateLayout : function() {
		var numPages, wrapperWidth, wrapperHeight, pageWidth;
		if(this.wrapper && this.scroller && this.myScroll){
			numPages = Math.ceil(this.collection.length / this.perPage);
			wrapperWidth = this.wrapper.width();
			wrapperHeight = this.wrapper.height();
			pageWidth = wrapperWidth / LG.GalleryListView.NUMX;
			this.$(".gallerypage").width(pageWidth);
			this.scroller.width(numPages * pageWidth);
			this.myScroll.refresh();
		}
	},
	scrollEnd:function(){
		var wrapperWidth = this.wrapper.width(), w, p;
		this.scrollPos = -1 * this.scroller.offset().left;
		w = this.scroller.width();
		p = (this.scrollPos + wrapperWidth) * 100 / w;
		if(p === 100){
			this.collection.nextPage();
		}
	},
	initScroll:function(){
		if(this.myScroll){
			this.removeScroll();
		}
		if(this.$(".gallerypage").length >= 1){
			this.myScroll = new IScroll("#listwrapper"+this.showName, {"scrollbars":true, "snap":".gallerypage", "scrollX":true, "scrollY":false, "interactiveScrollbars":true, "momentum":false});
			this.myScroll.on("scrollEnd", $.proxy(this.scrollEnd, this));
		}
	}
});

LG.GalleryListView.NUMX = 3;
LG.GalleryListView.NUMY = 3;


LG.GalleryPageView = Backbone.View.extend({
	initialize:function(data){
		this.pageModels = data.pageModels;
		this.elts = [ ];
	},
	template:"tpl_gallerypage",
	removeAll:function(){
		_.each(this.elts, function(elt, key){
			elt.close();
		});
		this.elts = [ ];
	},
	addFiles:function(){
		var _this = this, docFragm;
		this.removeAll();
		this.elts = [ ];
		docFragm = document.createDocumentFragment();
		_.each(this.pageModels, function(model, i){
			var elt = new LG.GalleryRowView(model);
			docFragm.appendChild(elt.render().el);
			_this.elts.push(elt);
		});
		this.$el.append(docFragm);
	},
	render:function(){
		this.loadTemplate(  this.template, {"showName":this.showName} , {replace:true} );
		this.addFiles();
		return this;
	},
	beforeClose:function(){
		this.removeAll();
	}
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GalleryTopView = Backbone.View.extend({
	template:"tpl_gallerytop",
	render:function(){
		this.loadTemplate(  this.template, {} , {replace:true} );
		this.cancelButton = new LG.CancelButtonView();
		this.$el.append(this.cancelButton.render().$el);
		return this;
	}
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GallerySideView = Backbone.View.extend({
	initialize:function(){
		this.model = {"logo":null, "name":null, "_id":null};
		this.listenTo(LG.EventDispatcher, LG.Events.PREVIEW_FILE, $.proxy(this.preview, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#okbutton":"clickOk",
			"_click a#cancelbutton":"clickCancel"
		});
		return obj;
	},
	template:"tpl_galleryside",
	clickOk:function(e){
		this.stopProp(e);
		this.logOpen();
		this.tryOpenFile();
	},
	clickCancel:function(e){
		this.stopProp(e);
		this.hide();
	},
	logFile:function(url){
		$.ajax({
			url: url,
			type:"post",
			data: {"_id":this.id},
			error:function(jqXHR, textStatus, errorThrown){
				
			},
			success: function(data, textStatus, request){
				
			}
		});
	},
	logOpen:function(){
		this.logFile("/view");
 	},
	logVote:function(){
		this.logFile("/vote");
 	},
	preview:function(id){
		this.id = id;
		this.model = LG.allFilesCollection.getByProperty("_id", id).toJSON();
		this.rerender();
		this.$el.addClass("show");
	},
	render:function(){
		var model = _.extend(this.model, {"okColor":2, "noColor":1, "okLabel":"Open file", "noLabel":"Cancel"});
		this.loadTemplate(  this.template, model , {replace:true} );
		return this;
	},
	hide:function(){
		this.$el.removeClass("show");
	},
	onShow:function(){
		this.hide();
	},
	openFile:function(){
		LG.router.navigate("write/"+this.id, {"trigger":true});
	},
	alertOk:function(){
		LG.fileCollection.save();
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	tryOpenFile:function(){
		var options;
		if(LG.userModel.isConnected()){
			if(!LG.fileCollection.selected.isSaved()){
				options = {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) };
				LG.popups.openPopup({"message":LG.Messages.WANT_TO_SAVE,  "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, options);
				this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
			}
			else{
				this.openFile();
			}
		}
		else{
			this.openFile();
		}
	}
});




LG.AGalleryView = LG.AMenuView.extend({
	
	initialize:function(options){
		LG.AMenuView.prototype.initialize.call(this);
		this.options = options;
	},
	bottomView:LG.GalleryBottomView,
	topView:LG.GalleryTopView,
	listView:LG.GalleryListView,
	sideView:LG.GallerySideView,
	removeMenus:function(){
		if(this.galleryTop){
			this.galleryTop.unbind();
			this.galleryTop.close();
			this.galleryTop = null;
		}
		if(this.galleryList){
			this.galleryList.unbind();
			this.galleryList.close();
			this.galleryList = null;
		}
		if(this.gallerySide){
			this.gallerySide.unbind();
			this.gallerySide.close();
			this.gallerySide = null;
		}
	},
	addMenus:function(){
		this.removeMenus();
		this.galleryTop = new this.topView();
		this.galleryList = new this.listView(this.options);
		this.gallerySide = new this.sideView(this.options);
		this.$el.prepend(this.galleryTop.render().$el);
		this.$el.append(this.galleryList.render().$el);
		this.$el.append(this.gallerySide.render().$el);
	},
	onShow:function(){
		this.galleryList.onShow();
		this.gallerySide.onShow();
	},
	render:function(){
		this.loadTemplate(  this.template, {} , {replace:true} );
		this.addMenus();
		return this;
	},
	onHide:function(){
		this.galleryList.onHide();
	},
	beforeClose:function(){
		this.removeMenus();
	},
	events:function(){
		var obj = { };
		return obj;
	}
});


LG.AGalleryRowView = Backbone.View.extend({
	initialize:function(model){
		this.model = model;
	},
	setSelected:function(sel){
		if(sel){
			this.$el.addClass("selected");
		}
		else{
			this.$el.removeClass("selected");
		}
	},
	render:function(){
		var data = this.model.toJSON();
		data.logo = LG.Utils.truncate(data.logo, 20);
		this.loadTemplate(  this.template, data , {replace:true} );
		return this;
	}

});






LG.GalleryView = LG.AGalleryView.extend({
	initialize:function(options){
		options.showName = this.showName;
		LG.AGalleryView.prototype.initialize.call(this, options);
	},
	template:"tpl_gallery",
	showName:"gallery"
});

LG.GalleryRowView = LG.AGalleryRowView.extend({
	initialize:function(model){
		LG.AGalleryRowView.prototype.initialize.call(this, model);
	},
	template:"tpl_galleryrow"
});



LG.LoadView = LG.AGalleryView.extend({
	initialize:function(options){
		options.showName = this.showName;
		LG.AGalleryView.prototype.initialize.call(this, options);
	},
	events:function(){
		var obj = Backbone.View.getTouch( { } );
		return obj;
	},
	template:"tpl_load",
	showName:"load"
});



LG.LoadRowView = LG.AGalleryRowView.extend({
	initialize:function(model){
		LG.AGalleryRowView.prototype.initialize.call(this, model);
	},
	template:"tpl_galleryrow"
});




	
	



// this class handles the lauching of the app

// for phonegap, dom must be ready and device ready, for web just dom ready.
// _started makes sure that the app is launched only once

LG.Launcher = function(){
	_.extend(this, Backbone.Events);
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
	$(window).on("orientationchange", $.proxy(this.onResize, this));
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
	this.bindEvents();
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
	LG.storage = LG.create.storage();
	LG.sounds = new LG.Sounds();
	LG.spinnerModel = new LG.SpinnerModel();
	LG.userModel = new LG.UserModel();
	LG.layoutModel = new LG.LayoutModel();
	LG.fileCollection = new LG.FileCollection();
	LG.graphicsModel = new LG.GraphicsModel();
	LG.imageModel = new LG.ImageModel();
	LG.allFilesCollection = new LG.AllFileCollection();
	LG.spinnerView = new LG.SpinnerView({"model":LG.spinnerModel});
};

LG.Launcher.prototype.launch = function(){
	var h = window.location.hash;
	h = h.replace(/^#/,'');
	window.location.hash = "";
	this.addActivity();
	LG.EventDispatcher.trigger(LG.Events.RESIZE);
	Backbone.history.start();
	LG.router.navigate(h, {"trigger":true});
};

LG.Launcher.prototype.addActivity = function(){
	LG.activityView = new LG.ActivityView();
	$("body > #container").empty().append(LG.activityView.render().$el);
	LG.activityView.afterAdded();
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

LG.Launcher.prototype.storageLoaded = function(){
	this.loadUserId();
	this.login();
};

LG.Launcher.prototype.loadFiles = function(){
	this.listenToOnce(LG.allFilesCollection, "sync", $.proxy(this.allFilesLoaded, this));
	LG.allFilesCollection.load();
};

LG.Launcher.prototype.onLoggedIn = function(){
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

LG.WebLauncher.prototype.login = function(options){
	this.social({"success":$.proxy(this.socialChecked, this)} );
};

LG.WebLauncher.prototype.check = function(){
	return (!this._started && this._domReady );
};





// ipad

LG.IPadLauncher = function(){
	LG.Launcher.apply(this, arguments);
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

LG.IPadLauncher.prototype.bindEvents = function(){
	// also bind to extra PG events
	LG.Launcher.prototype.bindEvents.call(this);
	document.addEventListener("deviceready", $.proxy(this.deviceReady, this) , false);
};

LG.IPadLauncher.prototype.deviceReady = function(){
	this._deviceReady = true;
	if(	this.check() ){
		this._started = true;
		this.startLoad();
	}
};

LG.IPadLauncher.prototype.check = function(){
	// check is different for PG
	return (!this._started && this._domReady  && this._deviceReady);
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

