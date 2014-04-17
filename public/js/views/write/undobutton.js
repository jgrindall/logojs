
LG.UndoRedoButton = LG.WriteButton.extend({
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "change", $.proxy(this.rerender, this));
	},
	clickMe:function(e){
		
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	}
});

// extends Backbone.View - a base class for all "this is a button in the header" views
LG.UndoButtonView = LG.UndoRedoButton.extend({
	template:"tpl_undobutton",
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_UNDO);
	},
	getDisabled:function(){
		var canUndo = LG.fileCollection.selected.canUndo();
		return !canUndo;
	}
});


