LG.HelpOverlayView = Backbone.View.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		this.page = 0;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button.next":"clickNext",
			"_click button.copy":"clickCopy",
			"_click button.more":"clickMore",
			"_click button.draw":"clickDraw",
			"_click":"clickMe"
		} );
		return obj;
	},
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickNext:function(e){
		this.stopProp(e);
		this.next();
	},
	clickMore:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
		LG.router.navigate("help", {"trigger":true});
	},
	clickCopy:function(e){
		this.stopProp(e);
		this.$("button.draw").css("display", "block");
		this.copy();
	},
	copy:function(){
		var s = "fd(100);rt(90);fd(100);rt(90);fd(100);rt(90);fd(100);rt(90);";
		LG.fileCollection.selected.set({"logo":s});
	},
	next:function(){
		this.$el.removeClass("help"+this.page);
		this.page = (this.page + 1) % LG.HelpOverlayView.NUM_PAGES;
		this.$el.addClass("help"+this.page);
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		return this;
	},
	beforeClose:function(){
	
	}
});

LG.HelpOverlayView.NUM_PAGES = 4;

