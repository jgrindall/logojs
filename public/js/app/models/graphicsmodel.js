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
LG.GraphicsModel.CLR10 = "#ecf0f1";
LG.GraphicsModel.CLR11 = "#95a5a6";
LG.GraphicsModel.CLR12 = "#f39c12";
LG.GraphicsModel.CLR13 = "#d35400";
LG.GraphicsModel.CLR14 = "#c0392b";
LG.GraphicsModel.CLR15 = "#bdc3c7";
LG.GraphicsModel.CLR16 = "#6f7c7d";
LG.GraphicsModel.CLR17 = "#ffffff";
LG.GraphicsModel.CLR18 = "#000000";
LG.GraphicsModel.CLR19 = "#ee00ee";

LG.GraphicsModel.CLRS	=	[LG.GraphicsModel.CLR0, LG.GraphicsModel.CLR1, LG.GraphicsModel.CLR2, LG.GraphicsModel.CLR3, LG.GraphicsModel.CLR4, LG.GraphicsModel.CLR5, LG.GraphicsModel.CLR6, LG.GraphicsModel.CLR7, LG.GraphicsModel.CLR8, LG.GraphicsModel.CLR9, LG.GraphicsModel.CLR10, LG.GraphicsModel.CLR11, LG.GraphicsModel.CLR12, LG.GraphicsModel.CLR13, LG.GraphicsModel.CLR14, LG.GraphicsModel.CLR15, LG.GraphicsModel.CLR16, LG.GraphicsModel.CLR17, LG.GraphicsModel.CLR18, LG.GraphicsModel.CLR19];
LG.GraphicsModel.BG		=	[4, 7, 10,  3,  7, 2,  10, 15, 4, 13, 8, 15, 11, 10, 13, 4, 15, 10, 14, 4,  10, 4, 10, 2,   2, 9, 10, 15, 2, 2,  3,  9, 10, 14, 7, 10, 8, 3, 18];
LG.GraphicsModel.INNER	=	[9, 4, 1,  10,  2, 7,  3, 9, 15, 10, 4, 4,  4,  6,  4,  10, 3, 2, 7, 10,  0, 14, 7, 7, 10, 4, 9, 14,  4, 10, 10, 10, 7, 10, 2,  4,  10, 7, 3];
LG.GraphicsModel.NAMES1	=	["turquoise turq", "green", "blue", "purple", "midnight", "dkturq dkturquoise/darkkturqoise", "darkgreen dkgreen", "yellow", "carrot/orange/org", "red"];
LG.GraphicsModel.NAMES2	=	["snow", "gray grey", "ltorange lightorg/ltorg lightorange", "dkorange darkorg/dkorg darkorange", "terracotta/dkred darkred", "lightgrey ltgrey/lightgray ltgray", "darkgray dkgray/darkgrey dkgrey", "white", "black", "pink"];
LG.GraphicsModel.NAMES =	LG.GraphicsModel.NAMES1.concat(LG.GraphicsModel.NAMES2);
LG.GraphicsModel.DARKTEXT =	[7, 10, 15, 17];
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




