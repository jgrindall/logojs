LG.AGalleryLRButtonView = LG.Button.extend({
	initialize:function(){
		LG.Button.prototype.initialize.call(this);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		this.trigger("navigatelr");
	}
});


LG.CancelButtonView = LG.Button.extend({
	initialize:function(){
		LG.Button.prototype.initialize.call(this);
	},
	template:"tpl_cancelbutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.router.navigate("menu", {"trigger":true});
	}
});


LG.GalleryLeftButtonView = LG.AGalleryLRButtonView.extend({
	initialize:function(){
		LG.AGalleryLRButtonView.prototype.initialize.call(this);
	},
	template:"tpl_galleryleftbutton"
});


LG.GalleryRightButtonView = LG.AGalleryLRButtonView.extend({
	initialize:function(){
		LG.AGalleryLRButtonView.prototype.initialize.call(this);
	},
	template:"tpl_galleryrightbutton"
});


