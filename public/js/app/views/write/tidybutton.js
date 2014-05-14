
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.TidyButtonView = LG.WriteButton.extend({
	template:"tpl_tidybutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_TIDY);
	}
	
});


