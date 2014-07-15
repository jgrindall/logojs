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
		s = s.replace(" ", "$");
		s = s.replace("/", "$");
		var clrs = s.split("$");
		_.each(clrs, function(c, key){
			if(c === color){
				r = LG.GraphicsModel.CLRS[i];
			}
		});
	});
	return r;
};




