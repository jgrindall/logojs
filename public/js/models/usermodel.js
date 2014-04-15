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
	isConnected:function(){
		// facebook or pwd
		return (this.loggedIn !== false);
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
				_this.set( {"name":data.name, "userid":response.id } );
				_this.fbDataLoaded(response, options);
			},
			"fail":function(){
				options.fail();
			}
		});
	}
	
});
