// go back to catalogue

// extends LG.Headerbutton

LG.RefButtonView = LG.HeaderButton.extend({
	template:"tpl_refbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("helpoverlay", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	}
});

