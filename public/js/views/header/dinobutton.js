// go back to catalogue

// extends LG.Headerbutton

LG.DinoButtonView = LG.HeaderButton.extend({
	template:"tpl_dinobutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "change:dino", $.proxy(this.rerender, this));
		this.listenTo(LG.fileCollection, "change", $.proxy(this.rerender, this));
	},
	getData:function(){
		alert("get data dino");
		return {"dino":LG.fileCollection.selected.get("dino")};
	},
	onClick:function(e){
		this.stopProp(e);
		LG.fileCollection.selected.incrementDino();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;L
	}
});

