LG.UserModel = Backbone.Model.extend({
	defaults: {
		name:null,
		userId:null,
		pic:null,
		pwd:null,
		loggedIn:false
	},
	initialize: function(){
		this.clear();
	},
	clear:function(){
		this.set( {"name":null, "userId":null, "pic":null, "pwd":null, "loggedIn":false} );
	},
	loginClicked:function(){
		if(LG.facebook && 1===2){
			if(this.isConnected()){
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
		}
		else{
			if(this.isConnected()){
				this.set({"loggedIn":false});
			}
			else{
				var users = ["100","200","300"];
				var user = users[Math.floor(Math.random()*100)%users.length];
				alert("you are "+user);
				this.set({"loggedIn":true, "userId":user});
			}
		}
	},
	isConnected:function(){
		// facebook or pwd
		return (this.get("loggedIn") !== false);
	},
	fbLoggedIn:function(options){
		this.loadFbData(options);
	},
	fbLoggedOut:function(options){
		this.clear();
		options.success();
	},
	fbDataLoaded:function(data, options){
		var _this = this;
		LG.facebook.getPic({
			"success":function(response){
				_this.set( {"pic":response.data.url} );
				options.success();
			},
			"fail":function(){
				options.success();
			}	
		});
	},
	loadFbData:function(options){
		var _this = this;
		LG.facebook.getMe({
			"success":function(response){
				_this.set( {"name":response.name, "userId":response.id, "loggedIn":"facebook" } );
				_this.fbDataLoaded(response, options);
			},
			"fail":function(){
				options.fail();
			}
		});
	}
	
});
