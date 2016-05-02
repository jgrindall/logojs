
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.HomeButtonView = LG.MenuButton.extend({
	template:"tpl_homebutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("mainmenu", {"trigger":true});
	}
	
});


