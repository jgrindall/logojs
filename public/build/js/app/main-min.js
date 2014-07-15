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

LG.Utils.centreImage = function($img, options){
	var p, w, h;
	p = $img.parent();
	if(!p || !$img){
		return;
	}
	w = p.width();
	h = p.height();
	if(w > h){
		if(options && options.left){
			$img.width(h).height(h).css("left", 0).css("right", "auto").css("top", 0);
		}
		else if(options && options.right){
			$img.width(h).height(h).css("right", 0).css("left", "auto").css("top", 0);
		}
		else{
			$img.width(h).height(h).css("left", (w - h)/2).css("right", "auto").css("top", 0);
		}
	}
	else{
		$img.width(w).height(w).css("top", (h - w)/2).css("left", 0);
	}
};

LG.Utils.getPG = function(){
	var vars, protocolRegExp, protocol, navRegExp, nav;
	varsExist = (window.cordova || window.PhoneGap || window.phonegap);
	protocolRegExp = /^file:\/{3}[^\/]/i;
	protocol = protocolRegExp.test(window.location.href);
	var ispg = varsExist && protocol;
	if(ispg){
		return "ios";
	}
	else{
		return false;
	}
};

LG.Utils.countCharsIn = function(s, match){
	var c = 0, i;
	for(i = 0;i <= s.length-1;i++){
		if(s.charAt(i) === match){
			c++;
		}
	}
	return c;
};

LG.Utils.centreImages = function($el, options){
	$("img.centre", $el).each(function(){
		var $img = $(this);
		$(this).load(function(){
			LG.Utils.centreImage($img, options);
		});
		LG.Utils.centreImage($img, options);
	});
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

LG.Utils.writeGrowl = function(){
	LG.EventDispatcher.trigger(LG.Events.WRITE_GROWL);
};

LG.Utils.growl = function(msg){
	// open a little popup message
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
		"position":"top-left",
		"life":1500
	
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
LG.Config.PHONEGAP = LG.Utils.getPG();

LG.Config.FAKE_PHONEGAP = true;

LG.Config.IS_TOUCH = LG.Utils.isTouch();

LG.Config.PARSER_VISIT = "js/app/parser/visit.js";

// preload and compile the html using this list - should be faster
LG.Config.TEMPLATES = ["tpl_writegrowl", "tpl_homebutton","tpl_examplesbutton", "tpl_refbutton", "tpl_examples","tpl_writebar","tpl_galleryside","tpl_helpoverlay","tpl_dinobutton","tpl_spinner","tpl_gallerypage","tpl_helpbuttonmenu","tpl_help","tpl_newbutton","tpl_deletebutton","tpl_writetop","tpl_menutop","tpl_writebutton","tpl_settingsbutton","tpl_cancelbutton","tpl_menubuttons","tpl_menu","tpl_loadrow","tpl_load","tpl_gallerylist","tpl_gallerybottom","tpl_gallerytop","tpl_galleryleftbutton","tpl_galleryrightbutton","tpl_loadbutton","tpl_galleryrow","tpl_gallery","tpl_filename","tpl_alert","tpl_savebutton","tpl_helpbutton","tpl_tidybutton","tpl_clearbutton","tpl_gallerybutton", "tpl_logobutton", "tpl_loginbutton","tpl_filebutton","tpl_textbutton","tpl_undobutton","tpl_redobutton","tpl_startbutton","tpl_pausebutton","tpl_stopbutton","tpl_header","tpl_write","tpl_writebuttons","tpl_canvas","tpl_activitybuttons","tpl_activity"];

LG.Config.PRODUCT_ID = "logojs";

LG.baseUrl = "";

if(LG.Config.PHONEGAP){
	//LG.baseUrl = "http://cryptic-sea-4360.herokuapp.com";
	LG.baseUrl = "http://localhost:5000";
}

LG.Messages = {};
LG.Messages.WANT_TO_SAVE = "Do you want to save your current file?";
LG.Messages.SURE = "Are you sure?";
LG.Messages.WANT_TO_DELETE = "Are you sure you want to delete this file?";
LG.Messages.ERROR = "Error!";
LG.Messages.ERROR_BODY = "An error has occured connecting to the internet. You cannot save or load files without an internet connection.";
LG.Messages.SUCCESS = "Success";
LG.Messages.LOGGED_IN = "You are now logged in";
LG.Messages.WRITE = "Write your code and then tap anywhere to draw";
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


LG.Browser = {};

LG.Browser.touchY = 0;

LG.Browser.textAreas = ["logodiv"];

LG.Browser.configureScroll = function(){
	$(document).bind("touchstart", function(e){
		var currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
		LG.Browser.touchY = currentY;
		$target = $(e.target);
		if(LG.Browser.textAreas.indexOf($target.attr("id") >= 0)){
			LG.EventDispatcher.trigger(LG.Events.RESET_ERROR);
		}
	});
	$(document).bind("touchmove", function(e) {
		var currentY, allowScroll = true, dir, $target, containerHeight, textHeight, scrollTop, baseTop, atBase;
		$target = $(e.target);
		currentY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
        dir = "down";
		if(currentY < LG.Browser.touchY){
			dir = "up";
		}
		if(LG.Browser.textAreas.indexOf($target.attr("id") >= 0)){
			containerHeight = $target.height();
			textHeight = $target[0].scrollHeight;
			scrollTop = $target.scrollTop();
			baseTop = containerHeight * (1 - (containerHeight/textHeight));
			atBase = (scrollTop >= baseTop);
			if(textHeight <= containerHeight){
				allowScroll = false;
			}
			else if(dir === "up" && atBase){
				allowScroll = false;
			}
			else if(dir === "down" && scrollTop <= 0){
				allowScroll = false;
			}
		}
		else{
			allowScroll = false;
		}
		if(!allowScroll){
			e.preventDefault();
		}
		LG.Browser.touchY = currentY;
	});
};

LG.Browser.AUTH = "Basic " + btoa("logoUserName" + ":" + "logoPassword");

$.ajaxSetup({
	headers: {
		'Authorization': LG.Browser.AUTH
	},
	statusCode: {
		404: function(){
			
		}
	},
	cache:false
});

LG.BrowserDetect.init();

if(LG.Config.IS_TOUCH){
	LG.Browser.configureScroll();
}



// handle popup menus

LG.Network = {};

LG.Network.FACEBOOK = false;
LG.Network.FILESYSTEM = false;
LG.Network.FILE_ENTRY = false;

LG.FileSystem = function(){
	this.reader = false;
	this.reading = false;
	this.filesFolder = false;
	this.options = false;
	this.fileContents = false;
};

LG.FileSystem.prototype.deleteFile = function(model, options){
	//alert("delete");
	var filename = "file_"+model.get("name")+".txt";
	this.filesFolder.getFile(filename, {create: false}, $.proxy(this.gotFileDeleteEntry, this, model, options), $.proxy(this.failFileDeleteEntry, this, options));
};

LG.FileSystem.prototype.gotFileDeleteEntry = function(model, options, fileEntry){
	fileEntry.remove($.proxy(this.onFileDeleteSuccess, this, options), $.proxy(this.onFileDeleteError, this, options));
};

LG.FileSystem.prototype.onFileDeleteSuccess = function(options){
	options.success();
};

LG.FileSystem.prototype.onFileDeleteError = function(options){
	options.error();
};

LG.FileSystem.prototype.failFileDeleteEntry = function(options, error){
	options.fail();
};

LG.FileSystem.prototype.gotFileSaveEntry = function(model, options, fileEntry){
	fileEntry.createWriter($.proxy(this.onMakeWriterSuccess, this, model, options), $.proxy(this.onMakeWriterFail, this));		
};

LG.FileSystem.prototype.failFileSaveEntry = function(options, error){
	options.fail();
};

LG.FileSystem.prototype.onMakeWriterFail = function(options, error) {
	options.fail();
};

LG.FileSystem.prototype.onMakeWriterSuccess = function(model, options, writer) {
	writer.write(JSON.stringify(model));
    writer.abort();
    options.success();
};

LG.FileSystem.prototype.saveFile = function(model, options){
	var filename = "file_"+model.get("name")+".txt";
	this.filesFolder.getFile(filename, {create: true}, $.proxy(this.gotFileSaveEntry, this, model, options), $.proxy(this.failFileSaveEntry, this, options));
};

LG.FileSystem.prototype.readFiles = function(options){
	this.options = options;
	if(!this.filesFolder || this.reading){
		options.fail();
	}
	else{
		this.reading = true;
		this.fileReader = new FileReader();
		this.fileReader.onloadend = $.proxy(this.fileIsRead, this);
		this.fileReader.onerror = $.proxy(this.fileIsReadError, this);
		var success = $.proxy(this.readSuccess, this);
		var fail = $.proxy(this.readFail, this);
		var reader = this.filesFolder.createReader();
		reader.readEntries(success, fail);
	}
};

LG.FileSystem.prototype.fileIsRead = function(e){
	try{
		var obj = $.parseJSON(e.target.result);
		if(obj.name && obj.logo && obj.userId){
			this.fileContents[this.numLoaded] = obj;
		}
		else{
			this.fileContents[this.numLoaded] = null;
		}
    	this.readNext();
    }
    catch(e){
    	LG.Utils.log("parse failed");
    	this.options.fail();
    }
};

LG.FileSystem.prototype.fileIsReadError = function(){
	this.fileContents[this.numLoaded] = null;
    this.readNext();
};

LG.FileSystem.prototype.readFileSuccess = function(file){
	this.fileReader.readAsText(file);
};

LG.FileSystem.prototype.readFileFail = function(){
	this.reading = false;
	this.options.success(this.fileContents);
};

LG.FileSystem.prototype.readNext = function() {
	this.numLoaded++;
	if(this.numLoaded == this.numToLoad){
		this.reading = false;
		this.options.success(this.fileContents);
	}
	else{
		var entry = this.entries[this.numLoaded];
		var success = $.proxy(this.readFileSuccess, this);
		var fail = $.proxy(this.readFileFail, this);
		entry.file(success, fail);
	}
};

LG.FileSystem.prototype.readSuccess = function(entries) {
	this.fileContents = [];
	this.entries = entries;
	this.numToLoad = entries.length;
	this.numLoaded = -1;
	this.readNext();
};

LG.FileSystem.prototype.readFail = function(error) {
   	this.options.fail(error);
};

LG.FileSystem.prototype.init = function(options){
	this.options = options;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $.proxy(this.onFileSystemSuccess, this), $.proxy(this.onFileSystemFail, this));
};

LG.FileSystem.prototype.onFileSystemSuccess = function(fs){
	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, $.proxy(this.onFileResolveSuccess, this), $.proxy(this.onFileResolveFail, this));
};

LG.FileSystem.prototype.onFileSystemFail = function(error){
	this.options.fail();
};

LG.FileSystem.prototype.onFileResolveSuccess = function(dir){
	var directoryReader = dir.createReader();
	directoryReader.readEntries($.proxy(this.readAppStorageDirSuccess, this), $.proxy(this.readAppStorageDirFail, this));
};

LG.FileSystem.prototype.onFileResolveFail = function(error){
	this.options.fail();
};

LG.FileSystem.prototype.onMakeDirectorySuccess = function(filesFolder){
	this.filesFolder = filesFolder;
	this.options.success();
};

LG.FileSystem.prototype.onMakeDirectoryFail = function(){
	this.options.fail();
};

LG.FileSystem.prototype.readAppStorageDirSuccess = function(entries) {
	var entry;
	for (var i = 0; i < entries.length; i++) {
		if(entries[i].name === "Library"){
			entry = entries[i];
			break;
		}
	}
	if(entry){
		entry.getDirectory("files", {create: true, exclusive: false}, $.proxy(this.onMakeDirectorySuccess, this), $.proxy(this.onMakeDirectoryFail, this)); 
	}
	else{
		this.options.fail();
	}
};

LG.FileSystem.prototype.readAppStorageDirFail = function(error) {
   	this.options.fail();
};

LG.fileSystem = new LG.FileSystem();

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
	this.store = new Keychain();
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
	this.sfx = ["img/sfx/whooshup", "img/sfx/click", "img/sfx/error", "img/sfx/success"];
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
		""											:	"empty",
		"write"										:	"write",
		"writebar"									:	"writebar",
		"write/:id"									:	"write",
		"gallery"									:	"gallery",
		"load"										:	"load",
		"filename"									:	"filename",
		"alert"										:	"alert",
		"help"										:	"help",
		"menu"										:	"menu",
		"helpoverlay"								:	"helpoverlay",
		"examples"									:	"examples"
    },
	initialize:function () {
		
    },
    empty:function(){
    	
    },
	show:function(s){
		if( s != "alert"){
			LG.popups.closePopup();
		}
		if(s != LG.layoutModel.get("show")){
			LG.layoutModel.set({"show":s});
		}
	},
	write:function(id){
		if(id){
			LG.fileOpener.open(id);
		}
		LG.Utils.writeGrowl();
		this.show("write");
	},
	examples:function(){
		this.show("examples");
	},
	filename:function(){
		this.show("filename");
	},
	writebar:function(){
		this.show("writebar");
	},
	load:function(){
		this.show("load");
	},
	help:function(){
		this.show("help");
	},
	helpoverlay:function(){
		this.show("helpoverlay");
	},
	menu:function(){
		this.show("menu");
	},
	alert:function(){
		this.show("alert");
	},
	gallery:function(){
		this.show("gallery");
	},
	alertOk:function(){
		LG.router.navigate("menu", {"trigger":true});
	},
	openErrorPage:function(callbacks){
		if(LG.launcher._launched){
			var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
			LG.popups.openPopup(data, {"ok":$.proxy(this.alertOk, this), "cancel":$.proxy(this.alertOk, this) });
		}
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
LG.Events.ALERT_CLOSED			=	"LG::alertClosed";
LG.Events.ERROR_ROW				=	"LG::errorRow";
LG.Events.ERROR_RUNTIME			=	"LG:errorRuntime";
LG.Events.FORCE_LOGO			=	"LG::forceLogo";
LG.Events.RESET_ERROR			=	"LG::resetError";
LG.Events.INSERT				=	"LG::insert";
LG.Events.TO_BAR				=	"LG::toBar";
LG.Events.RESUME				=	"LG::pause";
LG.Events.PAUSE					=	"LG::resume";
LG.Events.WRITE_GROWL			=	"LG::writeGrowl";
LG.Events.KEYBOARD_UP			=	"LG::keyboardUp";
LG.Events.KEYBOARD_DOWN			=	"LG::keyboardDown";

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


LG.Utils.logoparser = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = [],
        peg$c2 = function(st) {
        	var obj={type:"start", children:[]};
        	for(var i=0;i<=st.length-1;i++){
        		obj.children.push(st[i]);
        	}
        	return obj;
        },
        peg$c3 = function(f1) {
        	return {type:"insidestmt", children:[f1]};
        },
        peg$c4 = function(f2) {
        	return {type:"insidestmt", children:[f2]};
        },
        peg$c5 = function(f3) {
        	return {type:"insidestmt", children:[f3]};
        },
        peg$c6 = function(f4) {
        	return {type:"insidestmt", children:[f4]};
        },
        peg$c7 = function(p) {
        	return p;
        },
        peg$c8 = function(c) {
        	return c;
        },
        peg$c9 = function(b) {
        	return b;
        },
        peg$c10 = function(t) {
        	return t;
        },
        peg$c11 = function(f5) {
        	return {type:"insidestmt", children:[f5]};
        },
        peg$c12 = "penup",
        peg$c13 = { type: "literal", value: "penup", description: "\"penup\"" },
        peg$c14 = "(",
        peg$c15 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c16 = ")",
        peg$c17 = { type: "literal", value: ")", description: "\")\"" },
        peg$c18 = function() {
        return {"type":"penupstmt"};
        },
        peg$c19 = "pendown",
        peg$c20 = { type: "literal", value: "pendown", description: "\"pendown\"" },
        peg$c21 = "Pendown",
        peg$c22 = { type: "literal", value: "Pendown", description: "\"Pendown\"" },
        peg$c23 = function() {
        	return {"type":"pendownstmt"};
        },
        peg$c24 = "color",
        peg$c25 = { type: "literal", value: "color", description: "\"color\"" },
        peg$c26 = "Color",
        peg$c27 = { type: "literal", value: "Color", description: "\"Color\"" },
        peg$c28 = function(c) {
        	return {"type":"colorstmt", "color":c};
        },
        peg$c29 = "bg",
        peg$c30 = { type: "literal", value: "bg", description: "\"bg\"" },
        peg$c31 = "Bg",
        peg$c32 = { type: "literal", value: "Bg", description: "\"Bg\"" },
        peg$c33 = function(c) {
        	return {"type":"bgstmt", "color":c};
        },
        peg$c34 = "thickness",
        peg$c35 = { type: "literal", value: "thickness", description: "\"thickness\"" },
        peg$c36 = "thick",
        peg$c37 = { type: "literal", value: "thick", description: "\"thick\"" },
        peg$c38 = "Thick",
        peg$c39 = { type: "literal", value: "Thick", description: "\"Thick\"" },
        peg$c40 = "Thickness",
        peg$c41 = { type: "literal", value: "Thickness", description: "\"Thickness\"" },
        peg$c42 = function(e) {
        	return {"type":"thickstmt", "children":[e]};
        },
        peg$c43 = "turquoise",
        peg$c44 = { type: "literal", value: "turquoise", description: "\"turquoise\"" },
        peg$c45 = "turq",
        peg$c46 = { type: "literal", value: "turq", description: "\"turq\"" },
        peg$c47 = "green",
        peg$c48 = { type: "literal", value: "green", description: "\"green\"" },
        peg$c49 = "blue",
        peg$c50 = { type: "literal", value: "blue", description: "\"blue\"" },
        peg$c51 = "purple",
        peg$c52 = { type: "literal", value: "purple", description: "\"purple\"" },
        peg$c53 = "midnight",
        peg$c54 = { type: "literal", value: "midnight", description: "\"midnight\"" },
        peg$c55 = "darkkturqoise",
        peg$c56 = { type: "literal", value: "darkkturqoise", description: "\"darkkturqoise\"" },
        peg$c57 = "dkturq",
        peg$c58 = { type: "literal", value: "dkturq", description: "\"dkturq\"" },
        peg$c59 = "dkturquoise",
        peg$c60 = { type: "literal", value: "dkturquoise", description: "\"dkturquoise\"" },
        peg$c61 = "darkgreen",
        peg$c62 = { type: "literal", value: "darkgreen", description: "\"darkgreen\"" },
        peg$c63 = "dkgreen",
        peg$c64 = { type: "literal", value: "dkgreen", description: "\"dkgreen\"" },
        peg$c65 = "yellow",
        peg$c66 = { type: "literal", value: "yellow", description: "\"yellow\"" },
        peg$c67 = "carrot",
        peg$c68 = { type: "literal", value: "carrot", description: "\"carrot\"" },
        peg$c69 = "orange",
        peg$c70 = { type: "literal", value: "orange", description: "\"orange\"" },
        peg$c71 = "org",
        peg$c72 = { type: "literal", value: "org", description: "\"org\"" },
        peg$c73 = "red",
        peg$c74 = { type: "literal", value: "red", description: "\"red\"" },
        peg$c75 = "snow",
        peg$c76 = { type: "literal", value: "snow", description: "\"snow\"" },
        peg$c77 = "gray",
        peg$c78 = { type: "literal", value: "gray", description: "\"gray\"" },
        peg$c79 = "grey",
        peg$c80 = { type: "literal", value: "grey", description: "\"grey\"" },
        peg$c81 = "ltorange",
        peg$c82 = { type: "literal", value: "ltorange", description: "\"ltorange\"" },
        peg$c83 = "lightorange",
        peg$c84 = { type: "literal", value: "lightorange", description: "\"lightorange\"" },
        peg$c85 = "lightorg",
        peg$c86 = { type: "literal", value: "lightorg", description: "\"lightorg\"" },
        peg$c87 = "ltorg",
        peg$c88 = { type: "literal", value: "ltorg", description: "\"ltorg\"" },
        peg$c89 = "dkorange",
        peg$c90 = { type: "literal", value: "dkorange", description: "\"dkorange\"" },
        peg$c91 = "darkorg",
        peg$c92 = { type: "literal", value: "darkorg", description: "\"darkorg\"" },
        peg$c93 = "dkorg",
        peg$c94 = { type: "literal", value: "dkorg", description: "\"dkorg\"" },
        peg$c95 = "darkorange",
        peg$c96 = { type: "literal", value: "darkorange", description: "\"darkorange\"" },
        peg$c97 = "terracotta",
        peg$c98 = { type: "literal", value: "terracotta", description: "\"terracotta\"" },
        peg$c99 = "dkred",
        peg$c100 = { type: "literal", value: "dkred", description: "\"dkred\"" },
        peg$c101 = "darkred",
        peg$c102 = { type: "literal", value: "darkred", description: "\"darkred\"" },
        peg$c103 = "ltgray",
        peg$c104 = { type: "literal", value: "ltgray", description: "\"ltgray\"" },
        peg$c105 = "ltgrey",
        peg$c106 = { type: "literal", value: "ltgrey", description: "\"ltgrey\"" },
        peg$c107 = "lightgray",
        peg$c108 = { type: "literal", value: "lightgray", description: "\"lightgray\"" },
        peg$c109 = "lightgrey",
        peg$c110 = { type: "literal", value: "lightgrey", description: "\"lightgrey\"" },
        peg$c111 = "darkgray",
        peg$c112 = { type: "literal", value: "darkgray", description: "\"darkgray\"" },
        peg$c113 = "darkgrey",
        peg$c114 = { type: "literal", value: "darkgrey", description: "\"darkgrey\"" },
        peg$c115 = "dkgrey",
        peg$c116 = { type: "literal", value: "dkgrey", description: "\"dkgrey\"" },
        peg$c117 = "dkgray",
        peg$c118 = { type: "literal", value: "dkgray", description: "\"dkgray\"" },
        peg$c119 = "white",
        peg$c120 = { type: "literal", value: "white", description: "\"white\"" },
        peg$c121 = "black",
        peg$c122 = { type: "literal", value: "black", description: "\"black\"" },
        peg$c123 = function(f, a) {
        	return {type:"callfnstmt", name:f.name, args:a};
        },
        peg$c124 = "fd",
        peg$c125 = { type: "literal", value: "fd", description: "\"fd\"" },
        peg$c126 = "Fd",
        peg$c127 = { type: "literal", value: "Fd", description: "\"Fd\"" },
        peg$c128 = "FD",
        peg$c129 = { type: "literal", value: "FD", description: "\"FD\"" },
        peg$c130 = function(num) {
        	return {type:"fdstmt", children:[num]};
        },
        peg$c131 = "rt",
        peg$c132 = { type: "literal", value: "rt", description: "\"rt\"" },
        peg$c133 = "Rt",
        peg$c134 = { type: "literal", value: "Rt", description: "\"Rt\"" },
        peg$c135 = "RT",
        peg$c136 = { type: "literal", value: "RT", description: "\"RT\"" },
        peg$c137 = function(num) {
        	return {type:"rtstmt", children:[num]};
        },
        peg$c138 = "rpt",
        peg$c139 = { type: "literal", value: "rpt", description: "\"rpt\"" },
        peg$c140 = "Rpt",
        peg$c141 = { type: "literal", value: "Rpt", description: "\"Rpt\"" },
        peg$c142 = "RPT",
        peg$c143 = { type: "literal", value: "RPT", description: "\"RPT\"" },
        peg$c144 = "endrpt",
        peg$c145 = { type: "literal", value: "endrpt", description: "\"endrpt\"" },
        peg$c146 = "Endrpt",
        peg$c147 = { type: "literal", value: "Endrpt", description: "\"Endrpt\"" },
        peg$c148 = function(num, list) {
        	return {type:"rptstmt", children:[num,list]};
        },
        peg$c149 = function(l) {
            var obj={};
        	obj.type="insidefnlist";
        	obj.children=[];
        	for(var i=0;i<=l.length-1;i++){
        		obj.children.push(l[i]);
        	}
        	return obj;
        },
        peg$c150 = ":=",
        peg$c151 = { type: "literal", value: ":=", description: "\":=\"" },
        peg$c152 = function(v, e) {
        	return {type:"makestmt", children:[v,e]};
        },
        peg$c153 = "proc",
        peg$c154 = { type: "literal", value: "proc", description: "\"proc\"" },
        peg$c155 = "Proc",
        peg$c156 = { type: "literal", value: "Proc", description: "\"Proc\"" },
        peg$c157 = "endproc",
        peg$c158 = { type: "literal", value: "endproc", description: "\"endproc\"" },
        peg$c159 = "Endproc",
        peg$c160 = { type: "literal", value: "Endproc", description: "\"Endproc\"" },
        peg$c161 = function(f, a, s) {
                 return {type:"definefnstmt", name:f.name, args:a, stmts:s};
        },
        peg$c162 = function(f, s) {
                 return {type:"definefnstmt", name:f.name, args:null, stmts:s};
        },
        peg$c163 = /^[a-z]/,
        peg$c164 = { type: "class", value: "[a-z]", description: "[a-z]" },
        peg$c165 = function(n) {
        	return {type:"vardef", name:n.toString()};
        },
        peg$c166 = function(c, e) {
        var allchildren = c.children;
        return {type:"expressionlist", children:allchildren.concat([e])};
        },
        peg$c167 = function(e) {
        return {type:"expressionlist", children:[e]};
        },
        peg$c168 = function() {
        return {type:"expressionlist", children:[]};
        },
        peg$c169 = function(c, v) {
        var allchildren = c.children;
        return {type:"arglist", children:allchildren.concat([v])};
        },
        peg$c170 = function(v) {
        return {type:"arglist", children:[v]};
        },
        peg$c171 = function() {
        return {type:"arglist", children:[]};
        },
        peg$c172 = function(v) {
        return {type:"csvarglist", children:v};
        },
        peg$c173 = function(e) {
        	return {type:"csvexpressionlist", children:e};
        },
        peg$c174 = ",",
        peg$c175 = { type: "literal", value: ",", description: "\",\"" },
        peg$c176 = function(v) {
        	return {type:"varname", name:v.name};
        },
        peg$c177 = function(e) {
        	return e;
        },
        peg$c178 = /^[a-zA-Z]/,
        peg$c179 = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
        peg$c180 = /^[a-zA-Z0-9_]/,
        peg$c181 = { type: "class", value: "[a-zA-Z0-9_]", description: "[a-zA-Z0-9_]" },
        peg$c182 = function(c0, c1) {
        	return {type:"fnname", name:c0.toString()+c1.toString()};
        },
        peg$c183 = function(m, pm) {
        	var obj={};
        	obj.type="expression";
        	obj.children=[];
        	obj.children.push(m);
        	for(var i=0;i<=pm.length-1;i++){
        		obj.children.push(pm[i]);
        	}
        	return obj;
        },
        peg$c184 = function(p) {
        	return {type:"plusorminus", children:[p]};
        },
        peg$c185 = function(m) {
        	return {type:"plusorminus", children:[m]};
        },
        peg$c186 = function(u, td) {
        	var obj={};
        	obj.type="multexpression";
        	obj.children=[];
        	obj.children.push(u);
                if(td.children.length >= 1){
        	     obj.children.push(td);
                }
        	return obj;
        },
        peg$c187 = function(t) {
        	var obj={};
        	obj.type="timesordivterms";
        	obj.children=[];
        	for(var i=0;i<=t.length-1;i++){
        		obj.children.push(t[i]);
        	}
        	return obj;
        },
        peg$c188 = function(t) {
        	return {type:"timesordivterm", children:[t]};
        },
        peg$c189 = function(d) {
        	return {type:"timesordivterm", children:[d]};
        },
        peg$c190 = "+",
        peg$c191 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c192 = function(m) {
        	return {type:"plusexpression", children:[m]};
        },
        peg$c193 = "-",
        peg$c194 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c195 = function(m) {
        	return {type:"minusexpression", children:[m]};
        },
        peg$c196 = function(n) {
        	return {type:"unaryexpression", children:[n]};
        },
        peg$c197 = function(num) {
        	return {type:"unaryexpression", children:[num]};
        },
        peg$c198 = function(n) {
        	return {type:"negate", children:[n]};
        },
        peg$c199 = "*",
        peg$c200 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c201 = function(u) {
        	return {type:"timesterm", children:[u]};
        },
        peg$c202 = "/",
        peg$c203 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c204 = function(u) {
        	return {type:"divterm", children:[u]};
        },
        peg$c205 = function(n) {
        	return {type:"numberexpression", children:[n]};
        },
        peg$c206 = function(e) {
        	return {type:"numberexpression", children:[e]};
        },
        peg$c207 = function(v) {
        	return {type:"numberexpression", children:[v]};
        },
        peg$c208 = ".",
        peg$c209 = { type: "literal", value: ".", description: "\".\"" },
        peg$c210 = /^[0-9]/,
        peg$c211 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c212 = function(d) {
          	var s = "0.", i;
          	for(i = 0; i <= d.length-1; i++){
        		s+=d[i];
          	}   
          	return {type:"number",value:parseFloat(s, 10)  };  
        },
        peg$c213 = function(d1, d2) {
          	var s1 = "", s2 = "", i;
          	for(i = 0; i<=d1.length-1;i++){
            	s1+=d1[i];
          	}   
         	for(i = 0; i<=d2.length-1;i++){
            	s2+=d2[i];
          	}   
          return {type:"number",value:parseFloat(s1+'.'+s2, 10)  };  
        },
        peg$c214 = function(d) {
        	return {type:"number",value:parseInt(d.join(""), 10)};
        },
        peg$c215 = function(c0, c1) {
        	return {type:"varname",name:c0.toString()+c1.toString()};
        },
        peg$c216 = /^[ \t\r\n]/,
        peg$c217 = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseoutsidestmt();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseoutsidestmt();
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c2(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseoutsidestmt() {
      var s0;

      s0 = peg$parseinsidestmt();
      if (s0 === peg$FAILED) {
        s0 = peg$parsedefinefnstmt();
      }

      return s0;
    }

    function peg$parseinsidestmt() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsefdstmt();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c3(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsesep();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsesep();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsertstmt();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parsesep();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsesep();
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c4(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsesep();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsesep();
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parserptstmt();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$parsesep();
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsesep();
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c5(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsesep();
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsesep();
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsemakestmt();
              if (s2 !== peg$FAILED) {
                s3 = [];
                s4 = peg$parsesep();
                while (s4 !== peg$FAILED) {
                  s3.push(s4);
                  s4 = peg$parsesep();
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c6(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = [];
              s2 = peg$parsesep();
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parsesep();
              }
              if (s1 !== peg$FAILED) {
                s2 = peg$parsepenupstmt();
                if (s2 !== peg$FAILED) {
                  s3 = [];
                  s4 = peg$parsesep();
                  while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    s4 = peg$parsesep();
                  }
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c7(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = [];
                s2 = peg$parsesep();
                while (s2 !== peg$FAILED) {
                  s1.push(s2);
                  s2 = peg$parsesep();
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$parsependownstmt();
                  if (s2 !== peg$FAILED) {
                    s3 = [];
                    s4 = peg$parsesep();
                    while (s4 !== peg$FAILED) {
                      s3.push(s4);
                      s4 = peg$parsesep();
                    }
                    if (s3 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c7(s2);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = [];
                  s2 = peg$parsesep();
                  while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    s2 = peg$parsesep();
                  }
                  if (s1 !== peg$FAILED) {
                    s2 = peg$parsecolorstmt();
                    if (s2 !== peg$FAILED) {
                      s3 = [];
                      s4 = peg$parsesep();
                      while (s4 !== peg$FAILED) {
                        s3.push(s4);
                        s4 = peg$parsesep();
                      }
                      if (s3 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c8(s2);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = [];
                    s2 = peg$parsesep();
                    while (s2 !== peg$FAILED) {
                      s1.push(s2);
                      s2 = peg$parsesep();
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parsebgstmt();
                      if (s2 !== peg$FAILED) {
                        s3 = [];
                        s4 = peg$parsesep();
                        while (s4 !== peg$FAILED) {
                          s3.push(s4);
                          s4 = peg$parsesep();
                        }
                        if (s3 !== peg$FAILED) {
                          peg$reportedPos = s0;
                          s1 = peg$c9(s2);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      s1 = [];
                      s2 = peg$parsesep();
                      while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        s2 = peg$parsesep();
                      }
                      if (s1 !== peg$FAILED) {
                        s2 = peg$parsethickstmt();
                        if (s2 !== peg$FAILED) {
                          s3 = [];
                          s4 = peg$parsesep();
                          while (s4 !== peg$FAILED) {
                            s3.push(s4);
                            s4 = peg$parsesep();
                          }
                          if (s3 !== peg$FAILED) {
                            peg$reportedPos = s0;
                            s1 = peg$c10(s2);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        s1 = [];
                        s2 = peg$parsesep();
                        while (s2 !== peg$FAILED) {
                          s1.push(s2);
                          s2 = peg$parsesep();
                        }
                        if (s1 !== peg$FAILED) {
                          s2 = peg$parsecallfnstmt();
                          if (s2 !== peg$FAILED) {
                            s3 = [];
                            s4 = peg$parsesep();
                            while (s4 !== peg$FAILED) {
                              s3.push(s4);
                              s4 = peg$parsesep();
                            }
                            if (s3 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c11(s2);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsepenupstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c12) {
          s2 = peg$c12;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c13); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c16;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c17); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseeoline();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c18();
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsependownstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c19) {
          s2 = peg$c19;
          peg$currPos += 7;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c20); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c21) {
            s2 = peg$c21;
            peg$currPos += 7;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c22); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s6 = peg$c16;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c17); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseeoline();
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c23();
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsecolorstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c24) {
          s2 = peg$c24;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c26) {
            s2 = peg$c26;
            peg$currPos += 5;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsecolor();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parsesep();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsesep();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s8 = peg$c16;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseeoline();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c28(s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsebgstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c29) {
          s2 = peg$c29;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c31) {
            s2 = peg$c31;
            peg$currPos += 2;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsecolor();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parsesep();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsesep();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s8 = peg$c16;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseeoline();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c33(s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsethickstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c34) {
          s2 = peg$c34;
          peg$currPos += 9;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c35); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c36) {
            s2 = peg$c36;
            peg$currPos += 5;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c37); }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c38) {
              s2 = peg$c38;
              peg$currPos += 5;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c39); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 9) === peg$c40) {
                s2 = peg$c40;
                peg$currPos += 9;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c41); }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseexpression();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parsesep();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsesep();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s8 = peg$c16;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseeoline();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c42(s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsecolor() {
      var s0;

      if (input.substr(peg$currPos, 9) === peg$c43) {
        s0 = peg$c43;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c45) {
          s0 = peg$c45;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c47) {
            s0 = peg$c47;
            peg$currPos += 5;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c48); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c49) {
              s0 = peg$c49;
              peg$currPos += 4;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c50); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c51) {
                s0 = peg$c51;
                peg$currPos += 6;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c52); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 8) === peg$c53) {
                  s0 = peg$c53;
                  peg$currPos += 8;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c54); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 13) === peg$c55) {
                    s0 = peg$c55;
                    peg$currPos += 13;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c56); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6) === peg$c57) {
                      s0 = peg$c57;
                      peg$currPos += 6;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c58); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 11) === peg$c59) {
                        s0 = peg$c59;
                        peg$currPos += 11;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c60); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 9) === peg$c61) {
                          s0 = peg$c61;
                          peg$currPos += 9;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c62); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 7) === peg$c63) {
                            s0 = peg$c63;
                            peg$currPos += 7;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c64); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c65) {
                              s0 = peg$c65;
                              peg$currPos += 6;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c66); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 6) === peg$c67) {
                                s0 = peg$c67;
                                peg$currPos += 6;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c68); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c69) {
                                  s0 = peg$c69;
                                  peg$currPos += 6;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c70); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 3) === peg$c71) {
                                    s0 = peg$c71;
                                    peg$currPos += 3;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c72); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 3) === peg$c73) {
                                      s0 = peg$c73;
                                      peg$currPos += 3;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c74); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 4) === peg$c75) {
                                        s0 = peg$c75;
                                        peg$currPos += 4;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c76); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 4) === peg$c77) {
                                          s0 = peg$c77;
                                          peg$currPos += 4;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 4) === peg$c79) {
                                            s0 = peg$c79;
                                            peg$currPos += 4;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c80); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 8) === peg$c81) {
                                              s0 = peg$c81;
                                              peg$currPos += 8;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c82); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 11) === peg$c83) {
                                                s0 = peg$c83;
                                                peg$currPos += 11;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 8) === peg$c85) {
                                                  s0 = peg$c85;
                                                  peg$currPos += 8;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c86); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 5) === peg$c87) {
                                                    s0 = peg$c87;
                                                    peg$currPos += 5;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c88); }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 8) === peg$c89) {
                                                      s0 = peg$c89;
                                                      peg$currPos += 8;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c90); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 7) === peg$c91) {
                                                        s0 = peg$c91;
                                                        peg$currPos += 7;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c92); }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 5) === peg$c93) {
                                                          s0 = peg$c93;
                                                          peg$currPos += 5;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 10) === peg$c95) {
                                                            s0 = peg$c95;
                                                            peg$currPos += 10;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c96); }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 10) === peg$c97) {
                                                              s0 = peg$c97;
                                                              peg$currPos += 10;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c98); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 5) === peg$c99) {
                                                                s0 = peg$c99;
                                                                peg$currPos += 5;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c100); }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 7) === peg$c101) {
                                                                  s0 = peg$c101;
                                                                  peg$currPos += 7;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c102); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 6) === peg$c103) {
                                                                    s0 = peg$c103;
                                                                    peg$currPos += 6;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c104); }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 6) === peg$c105) {
                                                                      s0 = peg$c105;
                                                                      peg$currPos += 6;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c106); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 9) === peg$c107) {
                                                                        s0 = peg$c107;
                                                                        peg$currPos += 9;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 9) === peg$c109) {
                                                                          s0 = peg$c109;
                                                                          peg$currPos += 9;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c110); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 8) === peg$c111) {
                                                                            s0 = peg$c111;
                                                                            peg$currPos += 8;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 8) === peg$c113) {
                                                                              s0 = peg$c113;
                                                                              peg$currPos += 8;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c114); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 6) === peg$c115) {
                                                                                s0 = peg$c115;
                                                                                peg$currPos += 6;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c116); }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 6) === peg$c117) {
                                                                                  s0 = peg$c117;
                                                                                  peg$currPos += 6;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c118); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 5) === peg$c119) {
                                                                                    s0 = peg$c119;
                                                                                    peg$currPos += 5;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c120); }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 5) === peg$c121) {
                                                                                      s0 = peg$c121;
                                                                                      peg$currPos += 5;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c122); }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsecallfnstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsefnname();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s4 = peg$c14;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseexpressionlist();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parsesep();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsesep();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s8 = peg$c16;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseeoline();
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c123(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsefdstmt() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c124) {
        s1 = peg$c124;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c125); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c126) {
          s1 = peg$c126;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c127); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c128) {
            s1 = peg$c128;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c129); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsesep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsesep();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c14;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c15); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseexpression();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c16;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseeoline();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c130(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsertstmt() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c131) {
        s1 = peg$c131;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c132); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c133) {
          s1 = peg$c133;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c134); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c135) {
            s1 = peg$c135;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c136); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsesep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsesep();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c14;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c15); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseexpression();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c16;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseeoline();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c137(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parserptstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c138) {
        s1 = peg$c138;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c139); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c140) {
          s1 = peg$c140;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c141); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c142) {
            s1 = peg$c142;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c143); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsesep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsesep();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseexpression();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsesep();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsesep();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseinsidefnlist();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parsesep();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parsesep();
                }
                if (s6 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c144) {
                    s7 = peg$c144;
                    peg$currPos += 6;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c145); }
                  }
                  if (s7 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6) === peg$c146) {
                      s7 = peg$c146;
                      peg$currPos += 6;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c147); }
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parsesep();
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$parsesep();
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c148(s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseinsidefnlist() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseinsidestmt();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseinsidestmt();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c149(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsemakestmt() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsevardef();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsesep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsesep();
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c150) {
            s3 = peg$c150;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c151); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsesep();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsesep();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseexpression();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseeoline();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c152(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsedefinefnstmt() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c153) {
        s1 = peg$c153;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c154); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c155) {
          s1 = peg$c155;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c156); }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsesep();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsesep();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefnname();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsesep();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsesep();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s5 = peg$c14;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c15); }
              }
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parsesep();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parsesep();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsearglist();
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parsesep();
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$parsesep();
                    }
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 41) {
                        s9 = peg$c16;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c17); }
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = [];
                        s11 = peg$parsesep();
                        while (s11 !== peg$FAILED) {
                          s10.push(s11);
                          s11 = peg$parsesep();
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parseinsidefnlist();
                          if (s11 !== peg$FAILED) {
                            if (input.substr(peg$currPos, 7) === peg$c157) {
                              s12 = peg$c157;
                              peg$currPos += 7;
                            } else {
                              s12 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c158); }
                            }
                            if (s12 === peg$FAILED) {
                              if (input.substr(peg$currPos, 7) === peg$c159) {
                                s12 = peg$c159;
                                peg$currPos += 7;
                              } else {
                                s12 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c160); }
                              }
                            }
                            if (s12 !== peg$FAILED) {
                              s13 = [];
                              s14 = peg$parsesep();
                              while (s14 !== peg$FAILED) {
                                s13.push(s14);
                                s14 = peg$parsesep();
                              }
                              if (s13 !== peg$FAILED) {
                                peg$reportedPos = s0;
                                s1 = peg$c161(s3, s7, s11);
                                s0 = s1;
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4) === peg$c153) {
          s1 = peg$c153;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c154); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c155) {
            s1 = peg$c155;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c156); }
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parsesep();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parsesep();
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsefnname();
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parsesep();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parsesep();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseinsidefnlist();
                if (s5 !== peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c157) {
                    s6 = peg$c157;
                    peg$currPos += 7;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c158); }
                  }
                  if (s6 === peg$FAILED) {
                    if (input.substr(peg$currPos, 7) === peg$c159) {
                      s6 = peg$c159;
                      peg$currPos += 7;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c160); }
                    }
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    s8 = peg$parsesep();
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parsesep();
                    }
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c162(s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parsevardef() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c163.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c164); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c165(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseexpressionlist() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsecsvexpressionlist();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexpression();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c166(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsesep();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsesep();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseexpression();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parsesep();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsesep();
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c167(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsesep();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsesep();
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c168();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsearglist() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsecsvarglist();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevarname();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c169(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parsesep();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsesep();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsevarname();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parsesep();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsesep();
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c170(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          s2 = peg$parsesep();
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parsesep();
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c171();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsecsvarglist() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsevarnamecomma();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsevarnamecomma();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c172(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsecsvexpressionlist() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseexpressioncomma();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseexpressioncomma();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c173(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsevarnamecomma() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevarname();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c174;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c175); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c176(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseexpressioncomma() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexpression();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c174;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c175); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsesep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsesep();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c177(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsefnname() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c178.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c179); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c178.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c179); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c180.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c181); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c180.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c181); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c182(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseexpression() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsemultexpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseplusorminus();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseplusorminus();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c183(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseplusorminus() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseplusexpression();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c184(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseminusexpression();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c185(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsemultexpression() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseunaryexpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsetimesordivterms();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c186(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsetimesordivterms() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsetimesordivterm();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsetimesordivterm();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c187(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsetimesordivterm() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsetimesterm();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c188(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsedivterm();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c189(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseplusexpression() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c190;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c191); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsemultexpression();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c192(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseminusexpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s2 = peg$c193;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c194); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsemultexpression();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c195(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseunaryexpression() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsenegate();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c196(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsenumberexpression();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c197(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsenegate() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 45) {
          s2 = peg$c193;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c194); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsenumberexpression();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c198(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsetimesterm() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s2 = peg$c199;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c200); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseunaryexpression();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c201(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsedivterm() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s2 = peg$c202;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c203); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseunaryexpression();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c204(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsenumberexpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsesep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsesep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenumber();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsesep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsesep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c205(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
          s1 = peg$c14;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseexpression();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s3 = peg$c16;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c206(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsevarname();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c207(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c208;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c209); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c210.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c211); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c210.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c211); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c212(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c210.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c211); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c210.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c211); }
            }
          }
        } else {
          s1 = peg$c0;
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s2 = peg$c208;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c209); }
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c210.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c211); }
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c210.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c211); }
                }
              }
            } else {
              s3 = peg$c0;
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c213(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = [];
          if (peg$c210.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c211); }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (peg$c210.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c211); }
              }
            }
          } else {
            s1 = peg$c0;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c214(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsevarname() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c178.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c179); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c178.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c179); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c180.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c181); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c180.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c181); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c215(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsesep() {
      var s0;

      if (peg$c216.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c217); }
      }

      return s0;
    }

    function peg$parseeoline() {
      var s0, s1;

      s0 = [];
      s1 = peg$parsesep();
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsesep();
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

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

LG.output.MAX_SIZE = 100000;

LG.output.BATCH_SIZE = 96;

LG.output.TIMEOUT = 100;

LG.Command = function(data){
	this.data = data;
};

LG.Command.prototype.execute = function(context, position){
	this.context = context;
	this.graphics = this.context.graphics;
	this.position = position;
};





LG.ShapeCommand = function(data){
	LG.Command.call(this, data);
};

LG.ShapeCommand.prototype = Object.create(LG.Command.prototype);
LG.ShapeCommand.prototype.constructor = LG.ShapeCommand;

LG.ShapeCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
};





LG.FdCommand = function(data){
	LG.ShapeCommand.call(this, data);
};

LG.FdCommand.prototype = Object.create(LG.ShapeCommand.prototype);
LG.FdCommand.prototype.constructor = LG.FdCommand;

LG.FdCommand.prototype.execute = function(context, position){
	LG.ShapeCommand.prototype.execute.apply(this, arguments);
	var endX = this.position.x + Math.cos(this.position.theta)*this.data.amount;
	var endY = this.position.y + Math.sin(this.position.theta)*this.data.amount;
	this.graphics.setStrokeStyle(this.position.thickness, "round", "round");
	this.graphics.beginStroke(this.position.color);
	if(position.pen === "up"){
		this.graphics.moveTo(endX, endY);
	}
	else{
		this.graphics.moveTo(this.position.x, this.position.y);
		this.graphics.lineTo(endX, endY);
	}
	this.position.x = endX;
	this.position.y = endY;
};


LG.FdCommand.prototype.output = function(){
	return "fd " +this.data.amount;
};


LG.RtCommand = function(data){
	LG.Command.call(this, data);
};

LG.RtCommand.prototype = Object.create(LG.Command.prototype);
LG.RtCommand.prototype.constructor = LG.RtCommand;

LG.RtCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	var endPosition = {"theta": this.position.theta + this.data.amount*Math.PI/180, "x":this.position.x , "y":this.position.y };
	this.position.theta = endPosition.theta;
};

LG.RtCommand.prototype.output = function(){
	return "rt " +this.data.amount;
};




LG.PenUpCommand = function(){
	LG.Command.call(this);
};

LG.PenUpCommand.prototype = Object.create(LG.Command.prototype);
LG.PenUpCommand.prototype.constructor = LG.PenUpCommand;

LG.PenUpCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.pen = "up";
	
};

LG.PenUpCommand.prototype.output = function(){
	return "penup ";
};



LG.PenDownCommand = function(){
	LG.Command.call(this);
};

LG.PenDownCommand.prototype = Object.create(LG.Command.prototype);
LG.PenDownCommand.prototype.constructor = LG.PenDownCommand;

LG.PenDownCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.pen = "down";
};

LG.PenDownCommand.prototype.output = function(){
	return "pendown";
};



LG.BgCommand = function(data){
	LG.Command.call(this, data);
};

LG.BgCommand.prototype = Object.create(LG.Command.prototype);
LG.BgCommand.prototype.constructor = LG.BgCommand;

LG.BgCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	var hex = LG.GraphicsModel.getHex(this.data.color);
	position.bg = hex;
};

LG.BgCommand.prototype.output = function(){
	return "bg " +this.data.color;
};





LG.ColorCommand = function(data){
	LG.Command.call(this, data);
};

LG.ColorCommand.prototype = Object.create(LG.Command.prototype);
LG.ColorCommand.prototype.constructor = LG.ColorCommand;

LG.ColorCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	var hex = LG.GraphicsModel.getHex(this.data.color);
	position.color = hex;
};

LG.ColorCommand.prototype.output = function(){
	return "color " +this.data.color;
};




LG.ThicknessCommand = function(data){
	LG.Command.call(this, data);
};

LG.ThicknessCommand.prototype = Object.create(LG.Command.prototype);
LG.ThicknessCommand.prototype.constructor = LG.ThicknessCommand;

LG.ThicknessCommand.prototype.execute = function(context, position){
	LG.Command.prototype.execute.apply(this, arguments);
	position.thickness = this.data.amount;
};

LG.ThicknessCommand.prototype.output = function(){
	return "thick " +this.data.amount;
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
	initialize: function(data){
		this.restart();
		this.editing = false;
		this.listenTo(this, "change:logo change:dino", $.proxy(this.modelChanged, this));
	},
	restart:function(options){
		this.history = [  this.getValues()  ];
		this.pointer = 0;
	},
	getValues : function(){
		var obj = {};
		obj["logo"] = this.get("logo");
		obj["dino"] = this.get("dino");
		return obj;
	},
	saveState:function(){
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
	modelChanged:function(){
		if(this.editing){
			return;
		}
		this.saveState();
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
		LG.Utils.log("undo "+this.id+"    :  "+this.canUndo()+"  "+this.pointer);
		if(!this.canUndo()){
			return;
		}
		this.pointer = this.pointer - 1;
		this.reload();
	},
	redo:function(){
		LG.Utils.log("redo "+this.canRedo()+"  "+this.pointer);
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
	idAttribute: "_id", 
	urlRoot:function(){
		return LG.baseUrl + "/files";
	},
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
		d2 = (d1 + 1) % LG.GraphicsModel.BG.length;
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
		this.dirty = false;
		this.trigger("change");
	},
	isNew:function(){
		var id = this.get("_id");
		if(id){
			return false;
		}
		return true;
	}
});



LG.IPadFileModel = LG.FileModel.extend({
	save:function(data, options){
		var callbacks = {"success":$.proxy(this.saveSuccess, this, options), "fail":$.proxy(this.saveFail, this, options)};
		var id = ( this.get("_id") || LG.Utils.getUuid() );
		this.set(_.extend(data, {"_id":id}));
		LG.fileSystem.saveFile(this, callbacks);
    },
    destroy:function(options){
    	LG.Utils.log("ipad destroy");
    	var callbacks = {"success":$.proxy(this.deleteSuccess, this, options), "fail":$.proxy(this.deleteFail, this, options)};
    	LG.fileSystem.deleteFile(this, callbacks);
    },
    deleteSuccess:function(options){
    	options.success();
    },
    deleteFail:function(options){
    	options.fail();
    },
    saveSuccess:function(options){
    	var id = this.get("_id");
    	var response = {"_id":id};
    	this.set({"dirty":false});
    	options.success(this, response);
    	this.trigger("change");
    	this.trigger("sync");
    },
    saveFail:function(options){
    	LG.Utils.log("saveFail");
    	options.error();
    }
});

LG.ASpinnerCollection  = Backbone.Collection.extend({
	initialize:function(data){
		Backbone.Collection.prototype.initialize.call(this, data);
		this.listenTo(this, "sync error", $.proxy(this.onLoaded, this));
	},
	onLoaded:function(){
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
			if(this.selected){
				this.remove(this.selected);
			}
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new this.model({"dirty":false});
		}
		this.add(this.selected);
	},
	onLoaded:function(){
		LG.APaginatedCollection.prototype.onLoaded.call(this);
		this.addNewModel();
	}
});



LG.AFileCollection  = LG.ASelectedFileCollection.extend({
	model:LG.FileModel,
	url:function(){
		return LG.baseUrl + "/files";
	},
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
	name:"your",
	initialize:function(){
		LG.AFileCollection.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change:loggedIn", $.proxy(this.onLoginChanged, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_UNDO, $.proxy(this.undo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_REDO, $.proxy(this.redo, this));
	},
	undo:function(){
		this.selected.undo();
	},
	redo:function(){
		this.selected.redo();
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
			this.load({
				"success":function(){
					// TODO LG.Utils.log("logo was " + logo+" & "+dino+", do I need to load it again?");
				},
				"error":function(){
					LG.router.openErrorPage({"cancel":function(){
						LG.router.navigate("write", {"trigger":true});
					}});
				}
			});
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
		LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
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
		if(this.selected.get("_id") != id){
			selectedModel = this.getByProperty("_id", id);
			if(selectedModel){
				this.loadModel(selectedModel);
			}
			LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
		}
	},
	deleteCurrentFile:function(callback){
		LG.Utils.log("deleteCurrentFile");
		var _this = this, options;
		options = {
			"success":function(){
				LG.sounds.playSuccess();
				LG.Utils.growl("File deleted");
				_this.addNewModel({"force":true});
				callback.success();
			},
			"fail":function(){
				//alert("error deleting");
			}
		};
		if(this.selected.isNew()){
			this.selected.set({"logo":null});
		}
		else{
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
		LG.EventDispatcher.trigger(LG.Events.CAPTURE_IMAGE);
		data = {"dino":LG.fileCollection.selected.get("dino"), "name":name, "logo":LG.fileCollection.selected.get("logo"), "img":LG.imageModel.get("img"), "userId":LG.userModel.get("userId")};
		this.selected.set(data);
		options = {
			"success":function(model, response){
				model.set({"_id":response._id});
				model.set({"id":response._id});
				_this.add(model);
				callback.success(response._id);
			},
			"error":function(){
				callback.error();
			}
		};
		this.selected.save(data, options);
	}
});



LG.IPadFileCollection = LG.FileCollection.extend({
	model:LG.IPadFileModel,
	fetch:function(){
		LG.fileSystem.readFiles({"success":$.proxy(this.readSuccess, this), "fail":$.proxy(this.readFail, this)});
	},
	readSuccess:function(entries) {
		if(entries){
    		this.reset(entries);
    		this.trigger("sync");
    	}
	},
	readFail:function(error) {
   		//alert("Failed to list directory contents: " + error.code);
	}
});

LG.AllFileCollection = LG.AFileCollection.extend({
	name:"all",
	initialize:function(){
		this.page = 0;
		this.num = 0;
		LG.AFileCollection.prototype.initialize.call(this);
	},
	getData:function(){
		var data = _.extend(LG.AFileCollection.prototype.getData.call(this), {"userId": null});
		return data;
	}
});




LG.FileOpener = function(){
	_.extend(this, Backbone.Events);
};

LG.FileOpener.prototype.open = function(id){
	LG.Utils.log("open "+id);
	var oldModel, oldModelYours, yours = false, userId;
	oldModel = LG.allFilesCollection.getByProperty("_id", id);
	oldModelYours = LG.fileCollection.getByProperty("_id", id);
	if(!oldModel && !oldModelYours){
		// doesn't exist at all!
		return;
	}
	if(!LG.userModel.isConnected()){
		// not logged in at all
		LG.fileCollection.openOthers(oldModel.toJSON());
	}
	else{
		userId = LG.userModel.get("userId");
		if(oldModelYours && oldModelYours.get("userId") === userId){
			LG.fileCollection.loadById(id);
		}
		else{
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
	var options, currentId;
	this.id = id;
	currentId = LG.fileCollection.selected.get("_id");
	if(currentId === id){
		LG.sounds.playError();
		LG.Utils.growl("File already open");
		window.history.back();
	}
	else if(LG.userModel.isConnected()){
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
// extends Backbone.Model

LG.GraphicsModel = Backbone.Model.extend({
	initialize:function(){
		this.set({"bg":LG.GraphicsModel.CLRS[LG.GraphicsModel.BG[0]]});
		this.set({"inner":LG.GraphicsModel.CLRS[LG.GraphicsModel.INNER[0]]});
		this.listenTo(LG.fileCollection, "add  sync change", $.proxy(this.changeColor, this));
	},
	changeColor:function(){
		var c = LG.fileCollection.selected.get("dino");
		this.set({"bg":LG.GraphicsModel.CLRS[LG.GraphicsModel.BG[c]]});
		this.set({"inner":LG.GraphicsModel.CLRS[LG.GraphicsModel.INNER[c]]});
	},
	getBg:function(){
		return this.get("bg");
	},
	getInner:function(){
		return this.get("inner");
	},
	getThickness:function(){
		return 5;
	}
});


LG.GraphicsModel.CLR0 = "#1abc9c";
LG.GraphicsModel.CLR1 = "#2ecc71";
LG.GraphicsModel.CLR2 = "#2f88ca";
LG.GraphicsModel.CLR3 = "#9b59b6";
LG.GraphicsModel.CLR4 = "#34495e";
LG.GraphicsModel.CLR5 = "#16a085";
LG.GraphicsModel.CLR6 = "#27ae60";
LG.GraphicsModel.CLR7 = "#f1c40f";
LG.GraphicsModel.CLR8 = "#e67e22";
LG.GraphicsModel.CLR9 = "#e74c3c";
LG.GraphicsModel.CLR10 = "#95a5a6";
LG.GraphicsModel.CLR11 = "#f39c12";
LG.GraphicsModel.CLR12 = "#d35400";
LG.GraphicsModel.CLR13 = "#c0392b";
LG.GraphicsModel.CLR14 = "#bdc3c7";
LG.GraphicsModel.CLR15 = "#6f7c7d";
LG.GraphicsModel.CLR16 = "#ffffff";
LG.GraphicsModel.CLR17 = "#000000";

LG.GraphicsModel.CLRS	=	[LG.GraphicsModel.CLR0, LG.GraphicsModel.CLR1, LG.GraphicsModel.CLR2, LG.GraphicsModel.CLR3, LG.GraphicsModel.CLR4, LG.GraphicsModel.CLR5, LG.GraphicsModel.CLR6, LG.GraphicsModel.CLR7, LG.GraphicsModel.CLR8, LG.GraphicsModel.CLR9, LG.GraphicsModel.CLR10, LG.GraphicsModel.CLR11, LG.GraphicsModel.CLR12, LG.GraphicsModel.CLR13, LG.GraphicsModel.CLR14, LG.GraphicsModel.CLR15, LG.GraphicsModel.CLR16, LG.GraphicsModel.CLR17, LG.GraphicsModel.CLR18];
LG.GraphicsModel.BG		=	[4, 7, 16,  3,  7, 2,  16, 14, 4, 12, 8, 15, 10, 16, 12, 4, 14, 16, 13, 4,  16, 4, 16, 2,   2, 9, 16, 14, 2, 2,  3,  9, 16, 13, 7, 16, 8, 3, 17];
LG.GraphicsModel.INNER	=	[9, 4, 1,  16,  2, 7,  3, 9, 14, 16, 4, 4,  4,  6,  4,  16, 3, 2, 7, 16,  0, 13, 7, 7, 16, 4, 9, 13,  4, 16, 16, 16, 7, 16, 2,  4,  16, 7, 3];
LG.GraphicsModel.NAMES	=	["turquoise turq", "green", "blue", "purple", "midnight", "dkturq dkturquoise/darkkturqoise", "darkgreen dkgreen", "yellow", "carrot/orange/org","red","gray grey", "ltorange lightorg/ltorg lightorange", "dkorange darkorg/dkorg darkorange", "terracotta/dkred darkred", "lightgrey ltgrey/lightgray ltgray", "darkgray dkgray/darkgrey dkgrey", "white", "black"];
LG.GraphicsModel.DARKTEXT =	[7, 14, 16];
LG.GraphicsModel.getHex = function(color){
	var r = "#ff0000";
	_.each(LG.GraphicsModel.NAMES, function(s, i){
		var clrs = s.split("/");
		_.each(clrs, function(c, key){
			if(c === color){
				r = LG.GraphicsModel.CLRS[i];
			}
		});
	});
	return r;
};




LG.AUserModel = Backbone.Model.extend({
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
	alertOk:function(){
		window.history.back();
	},
	isConnected:function(){
		return (this.get("loggedIn") !== false);
	}
});



// web

LG.WebUserModel = LG.AUserModel.extend({
	login:function(){
		var _this = this;
		if(LG.facebook){
			LG.facebook.login({
				"success":function(){
					var data = {"message":LG.Messages.SUCCESS, "body":LG.Messages.LOGGED_IN, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				},
				"fail":function(){
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				}
			});
		}
		else{
			var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
			LG.popups.openPopup(data, {"ok":$.proxy(this.alertOk, this) });
		}
	},
	logout:function(){
		var _this = this;
		if(LG.facebook){
			LG.facebook.logout({
				"success":function(){
					var data = {"message":LG.Messages.SUCCESS, "body":LG.Messages.LOGGED_OUT, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				},
				"fail":function(){
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
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

LG.IPadUserModel = LG.AUserModel.extend({
	login:function(){
		
	},
	logout:function(){
		
	},
	isConnected:function(){
		return true;
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
		this.loadTemplate(this.template, data , {replace:true} );
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
};

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
};

LG.IPadLoginButtonView.prototype = Object.create(LG.ALoginButtonView.prototype);

LG.IPadLoginButtonView.prototype.constructor = LG.IPadLoginButtonView;

LG.IPadLoginButtonView.prototype.getData = function(){
	return {"label":"", "pic":null, "disabled":true};
};






// go back to catalogue

// extends LG.Headerbutton

LG.ExamplesButtonView = LG.HeaderButton.extend({
	template:"tpl_examplesbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("examples", {"trigger":true});
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

LG.RefButtonView = LG.HeaderButton.extend({
	template:"tpl_refbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("helpoverlay", {"trigger":true});
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

LG.WebGalleryButton = LG.GalleryButtonView.extend({
	getData:function(){
		return {"disabled":false};
	}
});

LG.IPadGalleryButton = LG.GalleryButtonView.extend({
	getData:function(){
		return {"disabled":true};
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
		LG.sounds.playClick();
		LG.router.navigate("helpoverlay", {"trigger":true});
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
		LG.sounds.playClick();
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
		this.listenTo(LG.fileCollection, "add sync change reset", $.proxy(this.rerender, this));
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		var data = this.getData();
		LG.sounds.playClick();
		if(data.loggedIn && !data.disabled){
			LG.fileCollection.save({
				"success":function(){
					LG.sounds.playSuccess();
					LG.Utils.growl("File saved");
				}
			});
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
		LG.sounds.playClick();
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
};

LG.WebLoadButtonView.prototype = Object.create(LG.ALoadButtonView.prototype);

LG.WebLoadButtonView.prototype.constructor = LG.WebLoadButtonView;

LG.WebLoadButtonView.prototype.getData = function(){
	var loggedIn = LG.userModel.isConnected();
	return {"disabled":!loggedIn};
};


// ipad

LG.IPadLoadButtonView  = function(){
	LG.ALoadButtonView.call(this);
};

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
		LG.EventDispatcher.trigger(LG.Events.TO_BAR);
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
		this.listenTo(LG.fileCollection, "add  sync change", $.proxy(this.rerender, this));
	},
	getData:function(){
		var i, c1, c2;
		i = LG.fileCollection.selected.get("dino");
		c1 = LG.GraphicsModel.BG[i];
		c2 = LG.GraphicsModel.INNER[i];
		return {"bg":c1, "inner":c2};
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.fileCollection.selected.incrementDino();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
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
	this.cache(-size, -size, 2*size, 2*size);
	this.drawMe( LG.graphicsModel.getInner() );
	this.snapToPixel = true;
};

LG.Easel.Turtle.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Turtle.prototype.constructor = LG.Easel.Turtle;

LG.Easel.Turtle.prototype.drawMe = function(clr) {
	if(this.clr != clr){
		var g = this.graphics;
		g.clear();
		g.setStrokeStyle(0);
		g.beginStroke(clr);
		g.beginFill(clr);
		g.moveTo(-this.size,-this.size);
		g.lineTo(this.size,0);
		g.lineTo(-this.size,this.size);
		g.lineTo(-this.size,-this.size);
		g.endFill();
		this.clr = clr;
		this.updateCache();
	}
};


LG.Easel.Turtle.prototype.initialize = function(size) {
	createjs.Shape.prototype.initialize.call(this);
	this.size = size;
};


window.LG.Easel = window.LG.Easel || {};

LG.Easel.Bg = function() {
	this.initialize();
};

LG.Easel.Bg.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Bg.prototype.constructor = LG.Easel.Bg;

LG.Easel.Bg.prototype.drawMe = function(clr){
	var g, w, h;
	g = this.graphics;
	w = LG.canvasModel.get("width");
	h = LG.canvasModel.get("height");
	g.clear();
	g.beginFill(clr).drawRect(0, 0, w, h);
};

LG.Easel.Bg.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};






window.LG.Easel = window.LG.Easel || {};

LG.Easel.Commands = function() {
	this.initialize();
	this.snapToPixel = true;
};

LG.Easel.Commands.prototype = Object.create(createjs.Shape.prototype);
LG.Easel.Commands.prototype.constructor = LG.Easel.Commands;

LG.Easel.Commands.prototype.initialize = function() {
	createjs.Shape.prototype.initialize.call(this);
};

LG.Easel.Commands.prototype.toBitmap = function(canvas) {
	this.draw(canvas.getContext("2d"));
	this.graphics.clear();
};





// extends LG.AbstractPageView

LG.ActivityView = LG.AbstractPageView.extend({
	template:"tpl_activity",
	name:"activity",
	initialize:function(){
		this.listenTo(LG.EventDispatcher, LG.Events.TO_BAR,				$.proxy(this.showBar, this));
	},
	showBar:function(){
		LG.router.navigate("writebar", {"trigger":true});
	},
	render:function(){
		
		this.loadTemplate(  this.template, { }, {replace:true}  );
		
		this.canvasView = new LG.CanvasView();
		this.$el.append(this.canvasView.render().el);
		
		this.writeGrowlView = new LG.WriteGrowlView();	
		this.$el.append(this.writeGrowlView.render().el);
		
		this.writeView = LG.create.writeView();
		this.$el.append(this.writeView.render().el);
		
		this.writeBarView = new LG.WriteBarView();
		this.$el.append(this.writeBarView.render().el);
		
		this.helpView = new LG.HelpView();
		this.$el.append(this.helpView.render().el);
		
		this.galleryView = new LG.GalleryView({"collection":LG.allFilesCollection, "title":"Gallery"});
		this.$el.append(this.galleryView.render().el);
		
		this.filenameView = new LG.FileNameView();
		this.$el.append(this.filenameView.render().el);
		
		this.helpOverlayView = new LG.HelpOverlayView();	
		this.$el.append(this.helpOverlayView.render().el);
		
		this.menuView = new LG.MenuView();
		this.$el.append(this.menuView.render().el);
		
		this.loadView = new LG.LoadView({"collection":LG.fileCollection, "title":"Your files"});	
		this.$el.append(this.loadView.render().el);
		
		this.examplesView = new LG.ExamplesView();	
		this.$el.append(this.examplesView.render().el);
		
		
		
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
		this.listenTo(LG.EventDispatcher,	LG.Events.TICK,					$.proxy(this.tick, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_DRAW,			$.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CLICK_STOP,			$.proxy(this.stop, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESIZE,				$.proxy(this.onResize, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.RESET_CANVAS,			$.proxy(this.reset, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.PAUSE,				$.proxy(this.pause, this));
		this.listenTo(LG.EventDispatcher,	LG.Events.CAPTURE_IMAGE,		$.proxy(this.capture, this));
		this.listenTo(LG.layoutModel,		"change",						$.proxy(this.onLayoutChanged, this));
		this.listenTo(LG.graphicsModel,		"change:bg",					$.proxy(this.reset, this));
		this.listenTo(LG.graphicsModel,		"change:inner",					$.proxy(this.reset, this));
		this.listenTo(LG.canvasModel,		"change",						$.proxy(this.reset, this));
	},
	template:"tpl_canvas",
	render:function(){
		this.loadTemplate(this.template, LG.canvasModel.toJSON(), {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	pause:function(){
		this.stop();
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
		var s = LG.layoutModel.get("show");
		if(s === "write" || s === "writebar"){
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
		w = $("body").width();
		h = $("body").height();
		this.$el.width(w).height(h);
		LG.canvasModel.set({"width":w, "height":h});
	},
	afterAdded:function(){
		this.turtlecanvas = document.getElementById("turtlecanvas");
		this.bgcanvas = document.getElementById("bgcanvas");
		this.commandscanvas = document.getElementById("commandscanvas");
		this.$turtlecanvas = $(this.turtlecanvas);
		this.$bgcanvas = $(this.bgcanvas);
		this.$commandscanvas = $(this.commandscanvas);
		this.addChildren();
		this.reset();
	},
	removeAllChildren:function(){
		this.turtlestage.removeAllChildren();
		this.commandsstage.removeAllChildren();
		this.bgstage.removeAllChildren();
		// clear up
	},
	makeStages:function(){
		this.turtlestage = new createjs.Stage(this.turtlecanvas);
		this.turtlestage.snapToPixelEnabled = true;
		this.bgstage = new createjs.Stage(this.bgcanvas);
		this.commandsstage = new createjs.Stage(this.commandscanvas);
		this.commandsstage.snapToPixelEnabled = true;
	},
	makeTurtle:function(){
		this.turtle = new LG.Easel.Turtle(10);
		this.turtlecontainer = new createjs.Container();
		this.turtlecontainer.addChild(this.turtle);
		this.turtlestage.addChild(this.turtlecontainer);
	},
	makeBg:function(){
		this.bg = new LG.Easel.Bg();
		this.bgcontainer = new createjs.Container();
		this.bmpcontainer = new createjs.Container();
		this.bgcontainer.addChild(this.bg);
		this.bgstage.addChild(this.bgcontainer);
		this.bgstage.addChild(this.bmpcontainer);
	},
	makeCommands:function(){
		this.commands = new LG.Easel.Commands();
		this.commandscontainer = new createjs.Container();
		this.commandscontainer.addChild(this.commands);
		this.commandsstage.addChild(this.commandscontainer);
	},
	addChildren:function(){
		this.makeStages();
		this.makeTurtle();
		this.makeBg();
		this.makeCommands();
		this.reset();
	},
	reset:function(){
		this.stop();
		var w = LG.canvasModel.get("width");
		var h = LG.canvasModel.get("height");
		this.$(".easelcanvas").attr("width", w).attr("height", h);
		this.position = {"theta":-Math.PI/2, x:w/2 - 100, y:h/2, "pen":"down", "bg":LG.graphicsModel.getBg(), "color":LG.graphicsModel.getInner(), "thickness":5};
		this.commands.graphics.clear();
		this.bmpcontainer.removeAllChildren();
		this.tick();
	},
	tick:function(){
		if(this.turtle && this.position){
			this.turtle.x = this.position.x;
			this.turtle.y = this.position.y;
			this.turtle.rotation = this.position.theta*180/Math.PI;
			this.turtle.drawMe(this.position.color);
		}
		if(this.bg && this.position){
			this.bg.drawMe(this.position.bg);
		}
		this.turtlestage.update();
		this.bgstage.update();
		this.commandsstage.update();
	},
	stop:function(){
		this.ended = false;
		this.active = false;
	},
	onMessage:function(msg){
		var data = msg.data, command, size;
		//LG.Utils.log("Worker said : " + JSON.stringify(msg.data));
		if(data.type === "command"){
			if(data.name === "fd"){
				command = new LG.FdCommand({"amount":data.amount});
			}
			else if(data.name === "rt"){
				command = new LG.RtCommand({"amount":data.amount});
			}
			else if(data.name === "penup"){
				command = new LG.PenUpCommand();
			}
			else if(data.name === "pendown"){
				command = new LG.PenDownCommand();
			}
			else if(data.name === "bg"){
				command = new LG.BgCommand({"color":data.color});
			}
			else if(data.name === "color"){
				command = new LG.ColorCommand({"color":data.color});
			}
			else if(data.name === "thick"){
				command = new LG.ThicknessCommand({"amount":data.amount});
			}
			this.output.add(command);
			size = this.output.size();
			if(size >= LG.output.MAX_SIZE){
				this.worker.terminate();
				this.ended = true;
			}
		}
		else if(data.type === "message"){
			this.onError(data);
		}
		else if(data.type === "end"){
			this.ended = true;
		}
	},
	draw:function(){
		this.reset();
		this.active = true;
		this.ended = false;
		this.bmpcontainer.removeAllChildren();
		this.output = new LG.output();
		this.commandIndex = 0;
		var logo = LG.fileCollection.selected.get("logo");
		var tree;
		try {
			tree = LG.Utils.logoparser.parse(logo);
		}
		catch(e){
			LG.Utils.log("Error "+JSON.stringify(e));
			this.showError(e.expected, e.line, e.offset);
			this.active = false;
		}
		if(tree){
			LG.EventDispatcher.trigger(LG.Events.TO_BAR);
			try{
				this.process(tree);
			}
			catch(e){
				LG.Utils.log("e: "+e);
			}
		}
	},
	showError:function(expected, line, offset){
		LG.EventDispatcher.trigger(LG.Events.ERROR_ROW, expected, line, offset);
	},
	onError:function(obj){
		this.stop();
		LG.EventDispatcher.trigger(LG.Events.ERROR_RUNTIME, obj.message);
	},
	process:function(tree){
		this.worker = new Worker(LG.Config.PARSER_VISIT);
		this.worker.onmessage = $.proxy(this.onMessage, this);
		this.worker.onerror = $.proxy(this.onError, this);
		this.worker.postMessage(  {"type":"tree", "tree":tree}  );
		var _this = this;
		LG.spinnerModel.set({"show":true});
		setTimeout(function(){
			LG.spinnerModel.set({"show":false});
			setTimeout($.proxy(_this.drawBatch, _this), LG.output.TIMEOUT);
		}, 500);
	},
	capture:function(){
		var context, data, tempCanvas, tempContext, img, x0, y0;
		context = this.bgcanvas.getContext("2d");
		x0 = Math.max(0, (this.bgcanvas.width - LG.CanvasView.SNAPSHOT_WIDTH)/2 );
		y0 = (this.bgcanvas.height - LG.CanvasView.SNAPSHOT_HEIGHT)/2;
		y0 = Math.max(0, y0 - LG.CanvasView.SNAPSHOT_HEIGHT/3);
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
		LG.sounds.playSuccess();
		this.active = false;
		this.ended = true;
		this.flush();
		this.trigger(LG.Events.DRAW_FINISHED);
	},
	flush:function(){
		var flushbmp = new createjs.Bitmap(this.commandscanvas);
		flushbmp.cache(0, 0, this.bgcanvas.width, this.bgcanvas.height);
		this.bmpcontainer.addChild(flushbmp);
		this.commands.graphics.clear();
		this.tick();
		LG.Utils.log("flushed "+this.bmpcontainer.getNumChildren());
	},
	drawBatch:function(){
		var size = this.output.size(), i;
		var max = Math.min(size - 1, LG.output.BATCH_SIZE - 1);
		if(size >= 1){
			for(i = 0; i <= max; i++){
				var command = this.output.at(this.commandIndex);
				if(command){
					command.execute(this.commands, this.position);
					this.commandIndex++;
				}
			}
			this.tick();
			if(this.commandIndex % LG.CanvasView.FLUSH_INTERVAL === 0){
				this.flush();
			}
		}
		var done = (!this.active || (this.ended && (this.commandIndex >= this.output.size() - 1) ));
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
LG.CanvasView.FLUSH_INTERVAL = 5000;

LG.CanvasModel = Backbone.Model.extend({
	defaults:{
		width:300,
		height:300
	}
});


// extends LG.AbstractPageView

LG.WriteGrowlView = Backbone.View.extend({
	template:"tpl_writegrowl",
	
	initialize:function(){
		this.render();
		this.listenTo(LG.EventDispatcher, LG.Events.WRITE_GROWL, $.proxy(this.show, this));
	},
	render:function(){
		this.loadTemplate(  this.template, {"message":LG.Messages.WRITE}, {replace:true}  );
		return this;
	},
	show:function(){
		var now = (new Date()).getTime(), _this = this, diff;
		diff = now - LG.WriteGrowlView.writeTimeStamp; 
		if(diff > 20000 || (diff > 5000 && LG.WriteGrowlView.writeNum <= 3)){
			this.$el.addClass("show");
			setTimeout(function(){
				_this.$el.removeClass("show");
			}, 5000);
			LG.WriteGrowlView.writeNum++;
		}
		LG.WriteGrowlView.writeTimeStamp = now;
	},
	events:function(){
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
	
});

LG.WriteGrowlView.writeTimeStamp = (new Date()).getTime();
LG.WriteGrowlView.writeNum = 0;

	
	
LG.AMenuView = Backbone.View.extend({	
	initialize:function(){
		var _this = this;
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
	},
	showName:"",
	onLayoutChanged:function(){
		var showName = LG.layoutModel.get("show");
		if(showName === this.showName){
			this.onBeforeShow();
			this.$el.addClass("show");
			this.onShow();
		}
		else{
			this.$el.removeClass("show");
			this.onHide();
		}
	},
	onBeforeShow:function(){
		
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
		this.galleryButton 		= 	LG.create.galleryButton();
		this.examplesButton 	= 	new LG.ExamplesButtonView();
		this.refButton 			= 	new LG.RefButtonView();
		this.loadButton 		= 	LG.create.loadButton();
		this.helpButton 		= 	new LG.HelpButtonMenuView ();
		this.loginButton 		= 	LG.create.loginButton();
		this.logoButton			=	new LG.LogoButtonView ();
		this.$el.append(this.helpButton.render().el).append(this.loadButton.render().el).append(this.galleryButton.render().el).append(this.examplesButton.render().el).append(this.refButton.render().el).append(this.loginButton.render().el);
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
	initialize:function(){
		LG.MenuButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	template:"tpl_writebutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getData:function(){
		var name = null, fileModel;
		fileModel = LG.fileCollection.selected;
		name = fileModel.get("name");
		return {"label":name || "unsaved file"};
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
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
		LG.sounds.playClick();
		LG.router.navigate("menu", {"trigger":true});
	}
	
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.HomeButtonView = LG.MenuButton.extend({
	template:"tpl_homebutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("mainmenu", {"trigger":true});
	}
	
});


LG.Popups = function(){

};

LG.Popups.prototype.openPopup = function(data, callbacks){
	var _this = this, defaultData = {"message":"", "body":"", "okLabel":null, "noLabel":null, "cancelLabel":"Cancel"};
	callbacks = callbacks || {};
	data = _.extend(defaultData, data);
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
			"_click a#nobutton":"clickNo",
			"_click #closebutton":"clickCancel"
		});
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, this.data , {replace:true} );
		return this;
	},
	clickOk:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.EventDispatcher.trigger(LG.Events.ALERT_OK);
	},
	clickCancel:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.EventDispatcher.trigger(LG.Events.ALERT_CANCEL);
	},
	clickNo:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
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
			"_click a#okbutton":"clickOk",
			"_click #closebutton":"clickClose"
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
					LG.sounds.playSuccess();
					LG.Utils.growl("File saved");
				},
				"error":function(){
					LG.router.openErrorPage({"cancel":function(){
						LG.router.navigate("write", {"trigger":true});
					}});
				}
			};
			LG.fileCollection.saveFileAs(name, options);
		}
	},
	clickClose:function(e){
		this.stopProp(e);
		window.history.back();
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
		this.error = {"show":false, "line":-1};
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 400, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.EventDispatcher, LG.Events.KEYBOARD_DOWN, $.proxy(this.kbDown, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_ROW, $.proxy(this.showErrorRow, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_RUNTIME, $.proxy(this.showErrorRuntime, this));
		this.listenTo(LG.EventDispatcher, LG.Events.FORCE_LOGO, $.proxy(this.forceLogo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.resize, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESET_ERROR, $.proxy(this.resetError, this));
		this.listenTo(LG.EventDispatcher, LG.Events.TO_BAR, $.proxy(this.toBar, this));
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
	toBar:function(){
		this.$logodiv.blur();
	},
	kbDown:function(){
		window.scrollTo(0,0);
		var h = $("body").height();
		$("body").height(h+1);
		$("body").height(h);
		setTimeout(function(){
			window.scrollTo(0,0);
			$("body").height(h+1);
			$("body").height(h);
		}, 100);
	},
	resize:function(){
		this.onScroll();
	},
	beforeClose:function(){
		this.$logodiv.off("scroll");
	},
	afterAdded:function(){
		this.$logodiv = this.$("#logodiv");
		this.$logonums = this.$("#logonums");
		this.$logodiv.scroll($.proxy(this.onScroll, this));
	},
	forceLogo:function(s){
		this.setLogo(s);
	},
	draw:function(){
		this.save();
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW);
	},
	load:function(){
		LG.Utils.log("LOAD");
		var logo, fileModel = LG.fileCollection.selected;
		logo = fileModel.get("logo");
		//if(logo != this.logo){
			this.setLogo(logo);
		//}
	},
	showErrorRuntime:function(msg){
		msg = msg.replace(/Uncaught Error: /g,"Error while running your code: ");
		this.showErrorText(msg);
		this.error = {"show":true, "line":0};
		this.showErrorText(msg);
	},
	showErrorText:function(msg){
		alert("ERROR");
		var _this = this;
		LG.router.navigate("write", {"trigger":true});
		LG.sounds.playError();
		setTimeout(function(){
			_this.$(".error").text(msg).addClass("show");
		}, 100);
	},
	showErrorRow:function(expected, line, offset){
		this.error = {"show":true, "line":line};
		exp = expected[0].value;
		if(exp === ";"){
			msg = "Error on line "+ line +", did you miss off a semi-colon (\";\")?  Check your code!";
		}
		else{
			msg = "Error on line "+ line +", expected: \""+exp+"\". Check your code!";
		}
		this.showErrorText(msg);
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	clean:function(){
		var logo = this.getLogo();
		console.log("replace   "+logo+"  "+LG.WriteView.ALLOWED);
		logo = logo.replace(new RegExp("[^"+LG.WriteView.ALLOWED+"]", 'g'), '');
		console.log(" gives "+logo);
		this.setLogo(logo);
	},
	save:function(){
		this.clean();
		var data = {"logo":this.getLogo()};
		this.logo = data.logo;
		this.stopListening(LG.fileCollection);
		LG.fileCollection.selected.set(data);
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.drawNums();
	},
	drawNums:function(){
		var numLines = this.$logodiv.val().split("\n").length;
		var s = [];
		for(var i = 1; i<= numLines; i++){
			s.push(i);
		}
		this.$logonums.val(s.join("\n"));
		this.$logonums.scrollTop(this.$logodiv.scrollTop());
	},
	setLogo:function(s){
		this.$logodiv.val(s);
	},
	getLogo:function(){
		return this.$logodiv.val();
	},
	changedText:function(e){
		this.changedTextDeBounce();
	},
	resetError:function(){
		if(this.error.show){
			this.$(".error").removeClass("show");
			this.error = {"show":false, "line":-1};
		}
	},
	onScroll:function(){
		this.$logonums.scrollTop(this.$logodiv.scrollTop());
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"mousedown":"resetError"
		});
		return obj;
	}
});

LG.WriteView.TOP = 53;

LG.WriteView.ALLOWED = "_a-zA-Z0-9\(\)\.\+\*/-";

LG.TouchWriteView = LG.WriteView.extend({
	initialize:function(){
		LG.WriteView.prototype.initialize.call(this);
	},
	addShowList:function(){
		var _this = this;
		this.$logodiv.on('focus', function(){
			_this.$logodiv.blur();
		});
	},
	removeShowList:function(){
		this.$logodiv.off('focus');
	},
	onBeforeShow:function(){
		this.$logodiv.attr("disabled", "disabled");
	},
	onShow:function(){
		var _this = this;
		this.addShowList();
		setTimeout(function(){
			_this.removeShowList();
			_this.$logodiv.removeAttr("disabled");
		}, 1000);
	},
	onHide:function(){
		this.removeShowList();
	}
});

LG.NoTouchWriteView = LG.WriteView.extend({
	initialize:function(){
		LG.WriteView.prototype.initialize.call(this);
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
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.fileButton = new LG.FileButtonView ( );
		this.dinoButton = new LG.DinoButtonView ( );
		this.settingsButton = new LG.SettingsButtonView ( );
		this.helpButton = new LG.HelpButtonView ( );
		this.$el.append(this.dinoButton.render().el).append(this.fileButton.render().el).append(this.helpButton.render().el).append(this.settingsButton.render().el);
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
		if(this.helpButton){
			this.helpButton.close();
		}
		this.fileButton = null;
		this.settingsButton = null;
		this.helpButton = null;
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
		LG.sounds.playClick();
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
		LG.sounds.playClick();
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
		LG.sounds.playClick();
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

LG.WriteBarView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		LG.AMenuView.prototype.initialize.call(this);
	},
	template:"tpl_writebar",
	showName:"writebar",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		return this;
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	},
	revert:function(){
		LG.router.navigate("write", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"revert"
		} );
		return obj;
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
		LG.sounds.playClick();
		var model = LG.fileCollection.selected;
		if(LG.userModel.isConnected()){
			if(!model.isNew()){
				LG.popups.openPopup({"message":LG.Messages.SURE, "body":LG.Messages.WANT_TO_DELETE, "okColor":2, "noColor":1, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
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
		LG.sounds.playClick();
		var loggedIn = LG.userModel.isConnected();
		var fileModel = LG.fileCollection.selected;
		if(!loggedIn){
			// can't save it anyway 
			this.newFile();
		}
		else{
			if(!fileModel.isSaved()){
				// unsaved
				LG.popups.openPopup({"message":LG.Messages.WANT_TO_SAVE, "body":LG.Messages.WANT_TO_SAVE, "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
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
		LG.sounds.playClick();
		window.history.back();
	},
	updateLayout : function() {
		if(this.wrapper && this.scroller && this.myScroll){
			var wrapperWidth = this.wrapper.width(), wrapperHeight = this.wrapper.height();
			this.$(".helpcontainer").width(wrapperWidth - 1).height(wrapperHeight - 1);
			this.scroller.css('width',  this.$(".helpcontainer").length * wrapperWidth + 1);
			this.myScroll.refresh();
		}
		LG.Utils.centreImages(this.$el);
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.scroller = this.$("#helpscroller");
		this.wrapper = this.$("#helpwrapper");
		LG.Utils.centreImages(this.$el);
		return this;
	},
	onShow:function(){
		this.initScroll();
		this.$("img#anim").attr("src", "img/video/video.gif");
	},
	onHide:function(){
		this.$("img#anim").attr("src", "").removeAttr("src");
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


LG.HelpOverlayView = LG.AMenuView.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click #cancelbutton":"clickClose"
		} );
		return obj;
	},
	showName:"helpoverlay",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	updateLayout : function() {
		if(this.wrapper && this.scroller && this.myScroll){
			var wrapperWidth = this.wrapper.width(), wrapperHeight = this.wrapper.height();
			this.$(".helpcontainer").width(wrapperWidth - 1).height(wrapperHeight - 1);
			this.scroller.css('width',  this.$(".helpcontainer").length * wrapperWidth + 1);
			this.myScroll.refresh();
		}
	},
	clickClose:function(){
		LG.sounds.playClick();
		window.history.back();
	},
	onShow:function(){
		this.initScroll();
	},
	onHide:function(){
		
	},
	renderColors:function(){
		var $colors1, $colors2, $colors3, $colors, displayName, dark, darkString;
		$colors1 = this.$("tr.colors:nth-child(1)");
		$colors2 = this.$("tr.colors:nth-child(2)");
		$colors3 = this.$("tr.colors:nth-child(3)");
		$colors = [$colors1, $colors2, $colors3];
		_.each(LG.GraphicsModel.NAMES, function(name, i){
			displayName = name.replace(/\//g, "<br/>");
			dark = (LG.GraphicsModel.DARKTEXT.indexOf(i) >= 0);
			darkString = "";
			if(dark){
				darkString = " colornamedark";
			}
			var index = Math.floor(i/6);
			$colors[index].append("<td class='colorblock dino"+i+"'><span class='colorname"+darkString+"'>"+displayName+"</span></td>");
		});
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.scroller = this.$("#refscroller");
		this.wrapper = this.$("#refwrapper");
		this.renderColors();
		return this;
	},
	initScroll:function(){
		LG.Utils.log("init scroll");
		var _this = this;
		this.myScroll = new IScroll("#refwrapper", {snap:".helpcontainer", scrollbars:true, scrollX:true, scrollY:false, interactiveScrollbars:true, momentum:false});
		this.updateLayout();
	},
	beforeClose:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	}
});







LG.ExamplesView = LG.AMenuView.extend({
	template:"tpl_examples",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .imgcontainer":"clickEx",
			"_click #cancelbutton":"clickClose"
		} );
		return obj;
	},
	showName:"examples",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickEx:function(e){
		this.stopProp(e);
		var j = $(e.currentTarget).index();
		var s = LG.ExamplesView.LOGO[j];
		if(s){
			LG.router.navigate("write", {"trigger":true});
			LG.EventDispatcher.trigger(LG.Events.FORCE_LOGO, s);
			LG.Utils.growl("Click on the left panel to draw");
		}
	},
	clickClose:function(){
		LG.sounds.playClick();
		window.history.back();
	},
	clickMe:function(e){
		this.stopProp(e);
		window.history.back();
	},
	onShow:function(){
		this.updateLayout();
	},
	updateLayout : function() {
		LG.Utils.centreImages(this.$el);
	},
	onHide:function(){
		
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {"replace":true}  );
		this.updateLayout();
		return this;
	},
	beforeClose:function(){
	
	}
});

LG.ExamplesView.LOGO = [ ];
LG.ExamplesView.LOGO.push("fd(100) rt(90)\nfd(100) rt(90)\nfd(100) rt(90)\nfd(100) rt(90)");
LG.ExamplesView.LOGO.push("fd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45) penup() fd(50) rt(45) pendown()");
LG.ExamplesView.LOGO.push("bg(gray)\nthick(4) color(yellow) fd(30)\nthick(6) color(blue) fd(30)\nthick(8) color(orange) fd(30)\nthick(10) color(red) fd(30)");
LG.ExamplesView.LOGO.push("bg(orange)\ncolor(white)\nn:=16\ns:=200\nrpt n\n    fd(s) rt(180 - 360/n)\nendrpt");
LG.ExamplesView.LOGO.push("bg(blue)\ncolor(yellow)\nthick(10)\nn:=4\nproc drawsquare\n    rpt n\n        fd(100) rt(90)\n    endrpt\nendproc\nrpt 8\n    drawsquare()\n    rt(45)\nendrpt");
LG.ExamplesView.LOGO.push("a:=5\nproc drawpoly(side, n)\n    rpt n\n        fd(side) rt(360/n)\n    endrpt\nendproc\nrpt 10\n    drawpoly(25,a)\n    a:=a+4\nendrpt\n");
LG.ExamplesView.LOGO.push("bg(blue) color(white)\nrpt 90 fd(1)rt(1) endrpt\nrt(270)\nrpt 180 fd(1)rt(1) endrpt\nrt(270)\nrpt 90 fd(1)rt(1) endrpt");
LG.ExamplesView.LOGO.push("a:=10\nrpt 120\n  fd(15) rt(a)\n  a:=a*1.02\nendrpt");








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
		LG.sounds.playClick();
		window.history.back();
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
		this.collection = options.collection;
		this.showName = options.showName;
		this.perPage = LG.GalleryListView.NUMY;
		this.scrollPos = 0;
	},
	template:"tpl_gallerylist",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_mousedown .galleryrow":"clickItemDown",
			"_mouseup .galleryrow":"clickItemUp"
		});
		return obj;
	},
	removeAllPages:function(){
		_.each(this.pages, function(page, key){
			page.close();
		});
		this.pages = [ ];
	},
	clickItemDown:function(e){
		//this.stopProp(e);
		this.time = (new Date()).getTime();
		LG.Utils.log("click down "+this.scrolling+"  "+this.time);
	},
	clickItemUp:function(e){
		//this.stopProp(e);
		var timeNow, diff;
		timeNow = (new Date()).getTime();
		diff = (timeNow - this.time);
		LG.Utils.log("click up "+diff);
		if(diff < 120){
			LG.sounds.playClick();
			var idToOpen = $(e.currentTarget).data("id");
			this.myScroll.scrollTo(0, 0);
			this.trigger(LG.Events.PREVIEW_FILE, idToOpen);
		}
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
		this.listenTo(this.collection, "add sync reset", _.debounce($.proxy(this.addFiles, this)), 500);
		this.collection.load({
			"error":function(){
				LG.router.openErrorPage({"cancel":function(){
					LG.router.navigate("write", {"trigger":true});
				}});
			},
			"success":function(){
				
			}
		});
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
	scrollStart:function(){
		LG.Utils.log("start");
	},
	scrollEnd:function(){
		var wrapperWidth = this.wrapper.width(), w, p, _this = this;
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
			this.myScroll = new IScroll("#listwrapper"+this.showName, {"scrollbars":true, "snap":".gallerypage", "scrollX":true, "scrollY":false, "interactiveScrollbars":true, "momentum":true});
			this.myScroll.on("scrollEnd", $.proxy(this.scrollEnd, this));
			this.myScroll.on("scrollStart", $.proxy(this.scrollStart, this));
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
	initialize:function(options){
		this.options = options;
	},
	template:"tpl_gallerytop",
	render:function(){
		this.loadTemplate(  this.template, {"title":this.options.title} , {replace:true} );
		this.cancelButton = new LG.CancelButtonView();
		this.$el.append(this.cancelButton.render().$el);
		return this;
	}
});



// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GallerySideView = Backbone.View.extend({
	initialize:function(){
		this.model = {"logo":null, "name":null, "_id":null};
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	openPreview:function(id){
		var _this = this;
		this.id = id;
		this.model = LG.allFilesCollection.getByProperty("_id", id).toJSON();
		this.rerender();
		this.$el.addClass("show");
		setTimeout(function(){
			_this.$(".galleryside").addClass("show");
		}, 50);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#okbutton":"clickOk",
			"_click img.centre":"clickOk",
			"_click a#cancelbutton":"clickCancel",
			"_click button#cancelbuttontop":"clickCancel"
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
		this.logFile(LG.baseUrl + "/view");
 	},
	render:function(){
		var model, logo;
		logo = this.model.logo;
		model = _.extend({}, this.model, {"okColor":1, "logo":logo, "noColor":1, "okLabel":"Open file", "noLabel":"Cancel"});
		this.loadTemplate(  this.template, model , {replace:true} );
		this.updateLayout();
		return this;
	},
	updateLayout:function(){
		LG.Utils.centreImages(this.$el);
	},
	hide:function(){
		this.$el.removeClass("show");
		this.$(".galleryside").removeClass("show");
	},
	onShow:function(){
		this.hide();
	},
	onHide:function(){
		this.hide();
	},
	tryOpenFile:function(){
		LG.fileOpener.openFromGallery(this.id);
	}
});





LG.AGalleryRowView = Backbone.View.extend({
	initialize:function(model){
		this.model = model;
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	setSelected:function(sel){
		if(sel){
			this.$el.addClass("selected");
		}
		else{
			this.$el.removeClass("selected");
		}
	},
	updateLayout:function(){
		LG.Utils.centreImages(this.$el,  {"right":true});
	},
	render:function(){
		var data = this.model.toJSON();
		this.loadTemplate(  this.template, data , {replace:true} );
		this.updateLayout();
		return this;
	}

});



LG.GalleryRowView = LG.AGalleryRowView.extend({
	initialize:function(model){
		LG.AGalleryRowView.prototype.initialize.call(this, model);
	},
	template:"tpl_galleryrow"
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
			this.stopListening(this.galleryList, LG.Events.PREVIEW_FILE);
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
		this.galleryTop = new this.topView({"title":this.options.title});
		this.galleryList = new this.listView(this.options);
		this.listenTo(this.galleryList, LG.Events.PREVIEW_FILE, $.proxy(this.preview, this));
		this.gallerySide = new this.sideView(this.options);
		this.$el.prepend(this.galleryTop.render().$el);
		this.$el.append(this.galleryList.render().$el);
		this.$el.append(this.gallerySide.render().$el);
	},
	preview:function(id){
	
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
		this.gallerySide.onHide();
	},
	beforeClose:function(){
		this.removeMenus();
	},
	events:function(){
		var obj = { };
		return obj;
	}
});

LG.GalleryView = LG.AGalleryView.extend({
	initialize:function(options){
		options.showName = this.showName;
		LG.AGalleryView.prototype.initialize.call(this, options);
	},
	preview:function(id){
		if(this.gallerySide){
			this.gallerySide.openPreview(id);
		}
	},
	template:"tpl_gallery",
	showName:"gallery"
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
	preview:function(id){
		LG.fileOpener.openFromGallery(id);
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
	//alert("file system fail");	
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
