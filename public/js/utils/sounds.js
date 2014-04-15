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

LG.sounds = new LG.Sounds();

