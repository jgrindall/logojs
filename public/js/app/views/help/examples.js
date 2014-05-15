
LG.ExamplesView = LG.AMenuView.extend({
	template:"tpl_examples",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button.next":"clickNext",
			"_click button.copy":"clickCopy",
			"_click button.more":"clickMore",
			"_click button.draw":"clickDraw",
			"_click .close":"clickClose",
			"_click":"clickMe"
		} );
		return obj;
	},
	showName:"examples",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickNext:function(e){
		this.stopProp(e);
	},
	clickMore:function(e){
		this.stopProp(e);
		LG.router.navigate("help", {"trigger":true});
	},
	clickCopy:function(e){
		this.stopProp(e);
	},
	clickClose:function(){
		window.history.back();
	},
	copy:function(){
		var s = "rpt 6[\nfd(100);rt(60);\n]";
		LG.EventDispatcher.trigger(LG.Events.FORCE_LOGO, s);
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
	},
	onShow:function(){
		this.updateLayout();
	},
	updateLayout : function() {
		LG.Utils.centreImages(this.$el);
	},
	onHide:function(){
		
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.updateLayout();
		return this;
	},
	beforeClose:function(){
	
	}
});


