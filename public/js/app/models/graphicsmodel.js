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
LG.GraphicsModel.CLR10 = "#c0392b";
LG.GraphicsModel.CLR11 = "#f39c12";
LG.GraphicsModel.CLR12 = "#ffffff";
LG.GraphicsModel.CLR13 = "#95a5a6";
LG.GraphicsModel.CLR14 = "#bdc3c7";
LG.GraphicsModel.CLR15 = "#6f7c7d";
LG.GraphicsModel.CLR16 = "#d35400";
LG.GraphicsModel.CLR17 = "#000000";

LG.GraphicsModel.CLRS	=	[LG.GraphicsModel.CLR0, LG.GraphicsModel.CLR1, LG.GraphicsModel.CLR2, LG.GraphicsModel.CLR3, LG.GraphicsModel.CLR4, LG.GraphicsModel.CLR5, LG.GraphicsModel.CLR6, LG.GraphicsModel.CLR7, LG.GraphicsModel.CLR8, LG.GraphicsModel.CLR9, LG.GraphicsModel.CLR10, LG.GraphicsModel.CLR11, LG.GraphicsModel.CLR12, LG.GraphicsModel.CLR13, LG.GraphicsModel.CLR14, LG.GraphicsModel.CLR15, LG.GraphicsModel.CLR16, LG.GraphicsModel.CLR17];
LG.GraphicsModel.BG		=	[4, 7, 12,  3,  7, 2,  12, 14, 4, 16, 8, 15, 13, 12, 16, 4, 14, 12, 10, 4,  12, 4, 16, 2,   2, 9, 12, 14, 2, 2,  3,  9, 12, 10, 7, 16, 8, 3, 17];
LG.GraphicsModel.INNER	=	[9, 4, 1,  16,  2, 7,  3, 9, 14, 12, 4, 4,  4,  6,  4,  12, 3, 2, 7, 12,  0, 10, 7, 7, 12, 4, 9, 10,  4, 12, 12, 12, 7, 12, 2,  4,  12, 7, 3];
LG.GraphicsModel.NAMES	=	["turquoise turq", "green", "blue", "purple", "midnight", "dkturq dkturquoise/darkkturqoise", "darkgreen dkgreen", "yellow", "carrot/orange/org","red","terracotta/dkred darkred", "ltorange lightorg/ltorg lightorange", "white", "gray grey", "lightgrey ltgrey/lightgray ltgray", "darkgray dkgray/darkgrey dkgrey", "dkorange darkorg/dkorg darkorange", "black"];
LG.GraphicsModel.DARKTEXT =	[7, 14, 12];
LG.GraphicsModel.getHex = function(color){
	var r = "#ff0000";
	_.each(LG.GraphicsModel.NAMES, function(s, i){
		s = s.replace(/ /g, "$");
		s = s.replace(/\//g, "$");
		var clrs = s.split("$");
		_.each(clrs, function(c, key){
			if(c === color){
				r = LG.GraphicsModel.CLRS[i];
			}
		});
	});
	return r;
};




