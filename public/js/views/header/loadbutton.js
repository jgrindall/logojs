// go back to catalogue

// extends LG.Headerbutton

LG.LoadButtonView = LG.HeaderButton.extend({
	template:"tpl_loadbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	getData:function(){
		var loggedIn = LG.userModel.isConnected();
		console.log("loadbutton "+loggedIn);
		return {"disabled":!loggedIn};
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("load", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button:not(.disabled)":"onClick"
		});
		return obj;
	
	}
});

