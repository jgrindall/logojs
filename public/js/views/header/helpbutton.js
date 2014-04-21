// go back to catalogue

// extends LG.HeaderButton

LG.HelpButtonView = LG.HeaderButton.extend({
	template:"tpl_helpbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.SHOW_HELP_OVERLAY);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

LG.HelpButtonMenuView = LG.HeaderButton.extend({
	template:"tpl_helpbuttonmenu",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("help", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});
