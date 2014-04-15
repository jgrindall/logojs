// storage
// on the web, use the localStorage
// on the iPad, use the secure keychain


LG.AbstractStorage = function(){
	this.cache = {};
};

LG.AbstractStorage.getNewKey = function(key){
	key = LG.Config.PRODUCT_ID+key;
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

LG.WebStorage.prototype = new LG.AbstractStorage();

LG.WebStorage.prototype.constructor = LG.AbstractStorage;

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

LG.IPadStorage.prototype = new LG.AbstractStorage();

LG.IPadStorage.prototype.constructor = LG.AbstractStorage;

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

LG.NoSupportStorage.prototype = new LG.AbstractStorage();

LG.NoSupportStorage.prototype.constructor = LG.AbstractStorage;

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

LG.CookieStorage.prototype = new LG.AbstractStorage();

LG.CookieStorage.prototype.constructor = LG.AbstractStorage;

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



///////////////////////////////////

if(LG.Config.PHONEGAP === "ios"){
	LG.storage = new LG.IPadStorage();
}
else if(LG.Utils.supportsLocalStorage()){
	LG.storage = new LG.WebStorage();
}
else if(LG.Utils.supportsCookies()){
	LG.storage = new LG.CookieStorage();
}
else{
	LG.storage = new LG.NoSupportStorage();
}
