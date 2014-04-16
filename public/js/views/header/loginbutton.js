// go back to catalogue

// extends LG.Headerbutton

LG.LoginButtonView = LG.HeaderButton.extend({
	template:"tpl_loginbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	render:function(){
		var user = LG.userModel.toJSON(), label;
		if(LG.Config.PHONEGAP === "ios"){
			if(LG.userModel.isConnected()){
				label = "Register/Login";
			}
			else{
				label = "Register/Login";
			}
		}
		else{
			if(LG.userModel.isConnected()){
				label = "Logout";
			}
			else{
				label = "Login with Facebook";
			}
		}
		this.loadTemplate(  this.template, { "label":label,"loggedin":user.loggedin, "name":user.name, "email":user.email, "pic":user.pic, "show": this.getShow(), disabled:this.getDisabled()  } , {replace:true} );
		return this;
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

