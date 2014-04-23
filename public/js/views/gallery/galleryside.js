
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GallerySideView = Backbone.View.extend({
	initialize:function(){
		this.model = {"logo":null, "name":null, "_id":null};
		this.listenTo(LG.EventDispatcher, LG.Events.PREVIEW_FILE, $.proxy(this.preview, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#okbutton":"clickOk",
			"_click a#cancelbutton":"clickCancel"
		});
		return obj;
	},
	template:"tpl_galleryside",
	clickOk:function(e){
		this.stopProp(e);
		this.logOpen();
		this.tryOpenFile();
	},
	clickCancel:function(e){
		this.stopProp(e);
		this.hide();
	},
	logFile:function(url){
		$.ajax({
			url: url,
			type:"post",
			data: {"_id":this.id},
			error:function(jqXHR, textStatus, errorThrown){
				
			},
			success: function(data, textStatus, request){
				
			}
		});
	},
	logOpen:function(){
		this.logFile("/view");
 	},
	logVote:function(){
		this.logFile("/vote");
 	},
	preview:function(id){
		this.id = id;
		this.model = LG.allFilesCollection.getByProperty("_id", id).toJSON();
		this.rerender();
		this.$el.addClass("show");
	},
	render:function(){
		var model = _.extend(this.model, {"okColor":2, "noColor":1, "okLabel":"Open file", "noLabel":"Cancel"});
		this.loadTemplate(  this.template, model , {replace:true} );
		return this;
	},
	hide:function(){
		this.$el.removeClass("show");
	},
	onShow:function(){
		this.hide();
	},
	openFile:function(){
		LG.router.navigate("write/"+this.id, {"trigger":true});
	},
	alertOk:function(){
		LG.fileCollection.save();
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	modelSynced:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	tryOpenFile:function(){
		var options;
		if(LG.userModel.isConnected()){
			if(!LG.fileCollection.selected.isSaved()){
				options = {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) };
				LG.popups.openPopup({"message":LG.Messages.WANT_TO_SAVE,  "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, options);
				this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
			}
			else{
				this.openFile();
			}
		}
		else{
			this.openFile();
		}
	}
});


