
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.RedoButtonView = LG.UndoRedoButton.extend({
	template:"tpl_redobutton",
	getDisabled:function(){
		var canRedo = LG.fileCollection.selected.canRedo();
		return !canRedo;
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.EventDispatcher.trigger(LG.Events.RESET_ERROR);
		LG.EventDispatcher.trigger(LG.Events.CLICK_REDO);
	}
	
});
