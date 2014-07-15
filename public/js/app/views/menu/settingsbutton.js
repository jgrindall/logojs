
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.SettingsButtonView = LG.MenuButton.extend({
	template:"tpl_settingsbutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("menu", {"trigger":true});
	}
	
});


