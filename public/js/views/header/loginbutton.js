// go back to catalogue

// extends LG.Headerbutton

LG.LoginButtonView = LG.HeaderButton.extend({
	template:"tpl_loginbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	render:function(){
		var user = LG.userModel.toJSON(), label = "Login with Facebook";
		if(LG.Config.PHONEGAP === "ios"){
			label = "Register/Login";
		}
		this.loadTemplate(  this.template, { "label":label,"loggedin":user.loggedin, "name":user.name, "email":user.email, "pic":user.pic, "show": this.getShow(), disabled:this.getDisabled()  } , {replace:true} );
		return this;
	},
	onClick:function(e){
		this.stopProp(e);
		if(LG.userModel.get("loggedin")){
			LG.facebook.logout({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					alert("fail");
				}
			});
		}
		else{
			LG.facebook.login({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					alert("fail");
				}
			});
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

