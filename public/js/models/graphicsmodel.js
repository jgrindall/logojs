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
LG.GraphicsModel.CLR2 = "#3498db";
LG.GraphicsModel.CLR3 = "#9b59b6";
LG.GraphicsModel.CLR4 = "#34495e";
LG.GraphicsModel.CLR5 = "#16a085";
LG.GraphicsModel.CLR6 = "#27ae60";
LG.GraphicsModel.CLR7 = "#2980b9";
LG.GraphicsModel.CLR8 = "#8e44ad";
LG.GraphicsModel.CLR9 = "#2c3e50";
LG.GraphicsModel.CLR10 = "#f1c40f";
LG.GraphicsModel.CLR11 = "#e67e22";
LG.GraphicsModel.CLR12 = "#e74c3c";
LG.GraphicsModel.CLR13 = "#ecf0f1";
LG.GraphicsModel.CLR14 = "#95a5a6";
LG.GraphicsModel.CLR15 = "#f39c12";
LG.GraphicsModel.CLR16 = "#d35400";
LG.GraphicsModel.CLR17 = "#c0392b";
LG.GraphicsModel.CLR18 = "#bdc3c7";
LG.GraphicsModel.CLR19 = "#7f8c8d";



LG.GraphicsModel.CLRS	=	[LG.GraphicsModel.CLR0, LG.GraphicsModel.CLR1, LG.GraphicsModel.CLR2, LG.GraphicsModel.CLR3, LG.GraphicsModel.CLR4, LG.GraphicsModel.CLR5, LG.GraphicsModel.CLR6, LG.GraphicsModel.CLR7, LG.GraphicsModel.CLR8, LG.GraphicsModel.CLR9, LG.GraphicsModel.CLR10, LG.GraphicsModel.CLR11, LG.GraphicsModel.CLR12, LG.GraphicsModel.CLR13, LG.GraphicsModel.CLR14, LG.GraphicsModel.CLR15, LG.GraphicsModel.CLR16, LG.GraphicsModel.CLR17, LG.GraphicsModel.CLR18, LG.GraphicsModel.CLR19];
LG.GraphicsModel.BG		=	[9, 10, 13,  3,  10, 7,   13, 18, 9, 16, 11, 18, 14, 13, 16, 9, 18, 13, 17, 4,  13, 9, 13, 2,   7, 12, 13, 18, 2, 2,  8,  12, 13, 17, 10, 13, 11, 8, 13];
LG.GraphicsModel.INNER	=	[12, 4, 1,  13,  7, 10,  8, 12, 18, 13, 9, 4,  4,  6,  9,  13, 3, 7, 10, 13,  0, 17, 10, 10, 13, 4, 12, 17,  4, 13, 13, 13, 10, 13, 2,  9,  13, 10, 3];



 




