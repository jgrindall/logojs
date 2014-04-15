// go back to catalogue

// extends LG.Headerbutton

LG.TextButtonView = LG.HeaderButton.extend({
	template:"tpl_textbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		
	},
	
	render:function(){
		this.loadTemplate(  this.template, { show: this.getShow(), disabled: this.getDisabled() } , {replace:true} );
		return this;
	},
	onClick:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_TEXT);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

