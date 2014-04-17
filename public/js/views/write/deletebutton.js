
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.DeleteButtonView = LG.WriteButton.extend({
	template:"tpl_deletebutton",
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
	getDisabled:function(){
		var fileModel = LG.fileCollection.selected;
		if(!fileModel.isNew()){
			return false;
		}
		return true;
	},
	render:function(){
		this.loadTemplate(  this.template, { "disabled":this.getDisabled()  } , {replace:true} );
		return this;
	},
	alertOk:function(){
		LG.fileCollection.deleteCurrentFile();
		LG.router.navigate("write", {"trigger":true});
	},
	alertNo:function(){
		LG.router.navigate("write", {"trigger":true});
	},
	alertCancel:function(){
		LG.router.navigate("write", {"trigger":true});
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
	},
	clickMe:function(e){
		this.stopProp(e);
		var model = LG.fileCollection.selected;
		if(LG.userModel.isConnected()){
			if(!model.isNew()){
				LG.popups.openPopup({"message":LG.Config.WANT_TO_DELETE, "okLabel":"Yes", "noLabel":"No"}, {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) });
			}
		}
	}	
});

