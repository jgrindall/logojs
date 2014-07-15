// go back to catalogue

// extends LG.Headerbutton

LG.SaveButtonView = LG.HeaderButton.extend({
	template:"tpl_savebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change reset", $.proxy(this.rerender, this));
		this.listenTo(LG.userModel, "change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		var data = this.getData();
		LG.sounds.playClick();
		if(data.loggedIn && !data.disabled){
			LG.fileCollection.save({
				"success":function(){
					LG.sounds.playSuccess();
					LG.Utils.growl("File saved");
				}
			});
		}
		else if(!data.loggedIn){
			LG.Utils.growl("Please log in to save your work");
		}
	},
	getData:function(){
		var disable = true, fileModel, loggedIn;
		loggedIn = LG.userModel.isConnected();
		fileModel = LG.fileCollection.selected;
		if(loggedIn){
			disable = fileModel.isSaved();
		}
		return {"loggedIn":loggedIn, "disabled":disable};
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});
