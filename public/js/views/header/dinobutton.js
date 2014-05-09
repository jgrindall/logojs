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
		LG.fileCollection.selected.incrementDino();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	}
});

