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
	isConnected:function(){
		return (this.get("loggedIn") !== false);
	}
});



// web

LG.WebUserModel = LG.AUserModel.extend({
	login:function(){
		var users = ["100","200","300"], user;
		if(LG.facebook){
			LG.facebook.login({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data);
				}
			});
		}
		else{
			user = users[Math.floor(Math.random()*100) % users.length];
			alert("you are "+user);
			this.set({"loggedIn":"facebook", "userId":user, "name":"n"+user});
		}
	},
	logout:function(){
		if(LG.facebook){
			LG.facebook.logout({
				"success":function(){
					alert("ok");
				},
				"fail":function(){
					var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
					LG.popups.openPopup(data);
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




