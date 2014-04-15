// go back to catalogue

// extends LG.Headerbutton

LG.LoadButtonView = LG.HeaderButton.extend({
	template:"tpl_loadbutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	alertOk:function(){
		LG.fileCollection.save();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		LG.router.navigate("load", {"trigger":true});
	},
	modelSynced:function(){
		alert("modelSynced");
		this.stopListening(LG.fileCollection, "sync");
		LG.router.navigate("load", {"trigger":true});
	},
	onClick:function(e){
		this.stopProp(e);
		if(LG.userModel.isConnected()){
			if(!LG.fileCollection.isSaved()){
				LG.popups.openPopup({"message":LG.Config.WANT_TO_SAVE, "okLabel":"yes", "cancelLabel":"no"}, {"ok":$.proxy(this.alertOk, this), "cancel":$.proxy(this.alertCancel, this) });
				this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
			}
			else{
				LG.router.navigate("load", {"trigger":true});
			}
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

