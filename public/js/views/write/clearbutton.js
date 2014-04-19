
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.ClearButtonView = LG.WriteButton.extend({
	template:"tpl_clearbutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "change", $.proxy(this.rerender, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_CLEAR);
		LG.EventDispatcher.trigger(LG.Events.RESET_CANVAS);
	},
	getDisabled:function(){
		var logo = LG.fileCollection.selected.get("logo");
		if(!logo || logo === ""){
			return true;
		}
		return false;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	}
	
});
