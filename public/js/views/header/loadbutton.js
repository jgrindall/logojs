// go back to catalogue

// extends LG.Headerbutton

LG.ALoadButtonView = LG.HeaderButton.extend({
	template:"tpl_loadbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
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



// web

LG.WebLoadButtonView  = function(){
	LG.ALoadButtonView.call(this);
};

LG.WebLoadButtonView.prototype = Object.create(LG.ALoadButtonView.prototype);

LG.WebLoadButtonView.prototype.constructor = LG.WebLoadButtonView;

LG.WebLoadButtonView.prototype.getData = function(){
	var loggedIn = LG.userModel.isConnected();
	return {"disabled":!loggedIn};
};


// ipad

LG.IPadLoadButtonView  = function(){
	LG.ALoadButtonView.call(this);
};

LG.IPadLoadButtonView.prototype = Object.create(LG.ALoadButtonView.prototype);

LG.IPadLoadButtonView.prototype.constructor = LG.IPadLoadButtonView;

LG.IPadLoadButtonView.prototype.getData = function(){
	var loggedIn = LG.userModel.isConnected();
	return {"disabled":!loggedIn};
};




