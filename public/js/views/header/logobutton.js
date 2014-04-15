// go back to catalogue

// extends LG.HeaderButton

LG.LogoButtonView = LG.HeaderButton.extend({
	template:"tpl_logobutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		alert("text");
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

