
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.DeleteButtonView = LG.WriteButton.extend({
	template:"tpl_deletebutton",
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
	getDisabled:function(){
		var fileModel = LG.fileCollection.selected;
		if(fileModel){
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
	alertCancel:function(){
		LG.router.navigate("write", {"trigger":true});
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
		LG.EventDispatcher.trigger(LG.Events.RESTART);
	},
	clickMe:function(e){
		this.stopProp(e);
		if(LG.userModel.isConnected()){
			if(LG.fileCollection.selected){
				LG.popups.openPopup({"message":LG.Config.WANT_TO_DELETE, "okLabel":"yes", "cancelLabel":"no"}, {"ok":$.proxy(this.alertOk, this), "cancel":$.proxy(this.alertCancel, this) });
			}
		}
	}	
});

