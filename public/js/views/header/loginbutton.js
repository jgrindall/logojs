// go back to catalogue

// extends LG.Headerbutton

LG.ALoginButtonView = LG.HeaderButton.extend({
	template:"tpl_loginbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		LG.userModel.loginClicked();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});




// web

LG.WebLoginButtonView  = function(){
	LG.ALoginButtonView.call(this);
};

LG.WebLoginButtonView.prototype = Object.create(LG.ALoginButtonView.prototype);

LG.WebLoginButtonView.prototype.constructor = LG.WebLoginButtonView;

LG.WebLoginButtonView.prototype.getData = function(){
	var user = LG.userModel.toJSON(), label, connected;
	connected = LG.userModel.isConnected();
	if(connected){
		label = "Logout";
	}
	else{
		label = "Facebook login";
	}
	return {"label":label, "name":user.name, "pic":user.pic};
};


// ipad

LG.IPadLoginButtonView  = function(){
	LG.ALoginButtonView.call(this);
};

LG.IPadLoginButtonView.prototype = Object.create(LG.ALoginButtonView.prototype);

LG.IPadLoginButtonView.prototype.constructor = LG.IPadLoginButtonView;

LG.IPadLoginButtonView.prototype.getData = function(){
	return {"label":"", "pic":null, "disabled":true};
};






