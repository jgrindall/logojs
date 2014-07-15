
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.WriteButtonView = LG.MenuButton.extend({
	initialize:function(){
		LG.MenuButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
	},
	template:"tpl_writebutton",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getData:function(){
		var name = null, fileModel;
		fileModel = LG.fileCollection.selected;
		name = fileModel.get("name");
		return {"label":name || "unsaved file"};
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		LG.router.navigate("write", {"trigger":true});
	}
	
});

