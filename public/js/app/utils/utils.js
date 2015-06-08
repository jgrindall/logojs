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
		"closeTemplate":"kujghg",
		"position":"top-left",
		"life":5000
	};
	$.jGrowl(msg, data);
};

$.jGrowl.defaults.pool = 1;
$.jGrowl.defaults.closeTemplate = "<div>XYX</div>";
$.jGrowl.defaults.life = 10000;

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
	if(window.console && LG.Config.DEBUG){
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



