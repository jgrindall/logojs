LG.AUserModel = Backbone.Model.extend({
	defaults: {
		"name":null,
		"userId":null,
		"pic":null,
		"pwd":null,
		"loggedIn":false
	},
	initialize: function(){
		this.clear();
		this.listenTo(this, "change", _.debounce($.proxy(this.persist, this), 1000));
	},
	persist:function(){
		var keys = ["userId"];
		var vals = [this.get("userId")];
		LG.storage.saveAll(keys, vals, function(){});
	},
	clear:function(){
		this.set( {"name":null, "userId":null, "pic":null, "pwd":null, "loggedIn":false} );
	},
	loginClicked:function(){
		if(this.isConnected()){
			this.logout();
		}
		else{
			this.login();
		}
	},
	alertOk:function(){
		window.history.back();
	},
	isConnected:function(){
		return (this.get("loggedIn") !== false);
	}
});



// web

LG.WebUserModel = LG.AUserModel.extend({
	login:function(){
		var _this = this;
		if(LG.facebook){
			LG.facebook.login({
				"success":function(){
					var data = {"message":LG.Messages.SUCCESS, "body":LG.Messages.LOGGED_IN, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				},
				"fail":function(){
					console.log("2 a");
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				}
			});
		}
		else{
			console.log("3 a");
			var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
			LG.popups.openPopup(data, {"ok":$.proxy(this.alertOk, this) });
		}
	},
	logout:function(){
		var _this = this;
		if(LG.facebook){
			LG.facebook.logout({
				"success":function(){
					console.log("success  " + _this+"  "+_this.alertOk+"  "+$.proxy(_this.alertOk, _this));
					var data = {"message":LG.Messages.SUCCESS, "body":LG.Messages.LOGGED_OUT, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				},
				"fail":function(){
					console.log("4 a");
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data, {"ok":$.proxy(_this.alertOk, _this), "cancel":$.proxy(_this.alertOk, _this) });
				}
			});
		}
		else{
			this.clear();
		}
	},
	fbLoggedIn:function(options){
		this.loadFbData(options);
	},
	fbLoggedOut:function(options){
		this.clear();
		options.success();
	},
	loadFbData:function(options){
		var _this = this;
		LG.facebook.getMe({
			"success":function(response){
				LG.facebook.getPic({
					"success":function(pic){
						_this.set( {"name":response.name, "userId":response.id, "loggedIn":"facebook", "pic":pic.data.url} );
						options.success();
					},
					"fail":function(){
						options.fail();
					}	
				});
			},
			"fail":function(){
				options.fail();
			}
		});
	}
});



//ipad

LG.IPadUserModel = LG.AUserModel.extend({
	login:function(){
		
	},
	logout:function(){
		
	}
});




