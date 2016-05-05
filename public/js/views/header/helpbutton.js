// go back to catalogue

// extends LG.HeaderButton

LG.HelpButtonView = LG.HeaderButton.extend({
	template:"tpl_helpbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		//this.stopProp(e);
		LG.sounds.playClick();
		//LG.router.navigate("helpoverlay", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
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
		//this.stopProp(e);
		LG.sounds.playClick();
		//LG.router.navigate("help", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {

		});
		return obj;
	
	}
});
