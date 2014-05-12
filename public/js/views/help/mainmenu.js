LG.MainMenuView = Backbone.View.extend({
	template:"tpl_mainmenu",
	initialize:function(){
		
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .mmblock.mm0":"clickBlock0",
			"_click .mmblock.mm1":"clickBlock1",
			"_click .mmblock.mm2":"clickBlock2",
			"_click .mmblock.mm3":"clickBlock3"
		} );
		return obj;
	},
	clickBlock0:function(e){
		this.stopProp(e);
		this.close();
	},
	clickBlock1:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.SHOW_HELP_OVERLAY);
		this.close();
	},
	clickBlock2:function(e){
		this.stopProp(e);
		this.close();
	},
	clickBlock3:function(e){
		this.stopProp(e);
		this.close();
	},
	afterAdded:function(){
		var _this = this;
		setTimeout(function(){
			_this.$el.addClass("show");
		}, 1500);
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		return this;
	},
	beforeClose:function(){
	
	}
});

