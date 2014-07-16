
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
		//LG.Utils.log("new button alert Ok");
		this.listenToOnce(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
		//LG.Utils.log("alertOk, add list, new button");
		LG.fileCollection.save({
				"success":function(){
					LG.sounds.playSuccess();
					LG.Utils.growl("File saved");
				}
			});
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		window.history.back();
	},
	alertNo:function(){
		LG.fileCollection.reloadCurrent();
		this.stopListening(LG.fileCollection, "sync");
		LG.fileOpener.newFile();
		LG.router.navigate("write", {"trigger":true});
	},
	modelSynced:function(){
		//LG.Utils.log("modelSynced");
		this.stopListening(LG.fileCollection, "sync");
		LG.fileOpener.newFile();
		LG.router.navigate("write", {"trigger":true});
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.sounds.playClick();
		var loggedIn = LG.userModel.isConnected();
		var fileModel = LG.fileCollection.selected;
		if(!loggedIn){
			// can't save it anyway 
			LG.fileOpener.newFile();
		}
		else{
			if(!fileModel.isNew() && !fileModel.isSaved()){
				// unsaved
				LG.popups.openPopup({"message":LG.Messages.SAVE_HEADER, "body":LG.Messages.WANT_TO_SAVE, "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
			}
			else{
				// dump the old file, make a new one
				LG.fileOpener.newFile();
			}
		}
	}
	
});
