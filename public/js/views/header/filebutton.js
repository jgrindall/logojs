// go back to catalogue

// extends LG.Headerbutton

LG.FileButtonView = LG.HeaderButton.extend({
	template:"tpl_filebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.TO_BAR);
	},
	getData:function(){
		var name = null, saved = false, fileModel;
		fileModel = LG.fileCollection.selected;
		name = fileModel.get("name");
		saved = LG.fileCollection.selected.isSaved();
		return {"name":name, "saved": saved};
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

