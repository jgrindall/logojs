
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.NewButtonView = LG.WriteButton.extend({
	template:"tpl_newbutton",
	initialize:function(){
		LG.WriteButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "add sync change", $.proxy(this.rerender, this));
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
		this.listenToOnce(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
		LG.fileCollection.save();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		window.history.back();
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.newFile();
		LG.router.navigate("write", {"trigger":true});
	},
	newFile:function(){
		LG.fileCollection.addNewModel({"force":true});
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
			this.newFile();
		}
		else{
			if(!fileModel.isSaved()){
				// unsaved
				LG.popups.openPopup({"message":LG.Config.WANT_TO_SAVE,  "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
			}
			else{
				// dump the old file, make a new one
				this.newFile();
			}
		}
	}
	
});
