
LG.WriteBarView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		LG.AMenuView.prototype.initialize.call(this);
	},
	template:"tpl_writebar",
	showName:"writebar",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		return this;
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	},
	revert:function(){
		LG.router.navigate("write", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"revert"
		} );
		return obj;
	}
});


