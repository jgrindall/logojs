// go back to catalogue

// extends LG.Headerbutton

LG.CatButtonView = LG.Headerbutton.extend({
	template:"tpl_catbutton",
	initialize:function(){
		_.bindAll(this);
		LG.EventDispatcher.on(LG.Events.ENABLE_BACK, $.proxy(this.enableBack, this));
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, {  } , {replace:true} );
		return this;
	},
	onClick:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("catalogue", {"trigger":true});
	},
	enableBack:function(data){
		if(data.show){
			this.$el.css("display","block");
		}
		else{
			this.$el.css("display","none");
		}
	},
	beforeClose:function(){
		LG.EventDispatcher.off(LG.Events.ENABLE_BACK);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

