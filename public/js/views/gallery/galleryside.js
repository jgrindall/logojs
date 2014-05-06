
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GallerySideView = Backbone.View.extend({
	initialize:function(){
		this.model = {"logo":null, "name":null, "_id":null};
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	openPreview:function(id){
		var _this = this;
		this.id = id;
		this.model = LG.allFilesCollection.getByProperty("_id", id).toJSON();
		this.rerender();
		this.$el.addClass("show");
		setTimeout(function(){
			_this.$(".galleryside").addClass("show");
		}, 50);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#okbutton":"clickOk",
			"_click img.centre":"clickOk",
			"_click a#cancelbutton":"clickCancel",
			"_click button#cancelbuttontop":"clickCancel"
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
		this.logFile(LG.baseUrl + "/view");
 	},
	render:function(){
		var model, logo;
		logo = this.model.logo;
		if(logo){
			logo = LG.WriteView.formatForGallery(logo);
		}
		var model = _.extend({}, this.model, {"okColor":1, "logo":logo, "noColor":1, "okLabel":"Open file", "noLabel":"Cancel"});
		this.loadTemplate(  this.template, model , {replace:true} );
		this.updateLayout();
		return this;
	},
	updateLayout:function(){
		LG.Utils.centreImages(this.$el);
	},
	hide:function(){
		this.$el.removeClass("show");
		this.$(".galleryside").removeClass("show");
	},
	onShow:function(){
		this.hide();
	},
	onHide:function(){
		this.hide();
	},
	tryOpenFile:function(){
		LG.fileOpener.openFromGallery(this.id);
	}
});


