
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.NewButtonView = LG.WriteButton.extend({
	template:"tpl_newbutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "sync change", $.proxy(this.rerender, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"clickMe"
		});
		return obj;
	},
	getData:function(){
		return {"disabled":false};
	},
	alertOk:function(){
		LG.fileCollection.save();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		LG.router.navigate("write", {"trigger":true});
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		LG.router.navigate("write", {"trigger":true});
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
	},
	clickMe:function(e){
		this.stopProp(e);
		var loggedIn = LG.userModel.isConnected();
		var fileModel = LG.fileCollection.selected;
		if(!loggedIn){
			// can't save it anyway
			LG.fileCollection.selected.set({"logo":null});
		}
		else{
			if(!LG.fileCollection.selected.isSaved()){
				// unsaved
				LG.popups.openPopup({"message":LG.Config.WANT_TO_SAVE, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
				this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
			}
			else{
				fileModel.reset();
			}
		}
	}
	
});
