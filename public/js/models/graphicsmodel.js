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

	