// go back to catalogue

// extends LG.Headerbutton

LG.ExamplesButtonView = LG.HeaderButton.extend({
	template:"tpl_examplesbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("examples", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	}
});

