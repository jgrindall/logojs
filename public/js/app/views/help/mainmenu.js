
LG.MainMenuView = LG.AMenuView.extend({
	template:"tpl_mainmenu",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	showName:"mainmenu",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .mmblock.mm0":"clickBlock0",
			"_click .mmblock.mm1":"clickBlock1",
			"_click .mmblock.mm2":"clickBlock2",
			"_click .mmblock.mm3":"clickBlock3",
			"_click .mmblock.mm4":"clickBlock4",
			"_click .mmblock.mm5":"clickBlock5",
			"_click span.close":"clickClose"
		} );
		return obj;
	},
	clickClose:function(e){
		this.stopProp(e);
		LG.router.navigate("write", {"trigger":true});
	},
	clickBlock0:function(e){
		this.stopProp(e);
		LG.router.navigate("load", {"trigger":true});
	},
	clickBlock1:function(e){
		this.stopProp(e);
		LG.router.navigate("write", {"trigger":true});
	},
	clickBlock2:function(e){
		this.stopProp(e);
		LG.router.navigate("examples", {"trigger":true});
	},
	clickBlock3:function(e){
		this.stopProp(e);
		LG.router.navigate("help", {"trigger":true});
	},
	clickBlock4:function(e){
		this.stopProp(e);
		LG.router.navigate("helpoverlay", {"trigger":true});
	},
	clickBlock5:function(e){
		this.stopProp(e);
		LG.router.navigate("gallery", {"trigger":true});
	},
	onShow:function(){
		var _this = this;
		setTimeout(function(){
			_this.$el.addClass("move");
		}, 500);
	},
	onHide:function(){
		this.$el.removeClass("move");
	},
	afterAdded:function(){
		
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		return this;
	},
	beforeClose:function(){
	
	}
});

