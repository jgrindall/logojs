


LG.AGalleryRowView = Backbone.View.extend({
	initialize:function(model){
		this.model = model;
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	setSelected:function(sel){
		if(sel){
			this.$el.addClass("selected");
		}
		else{
			this.$el.removeClass("selected");
		}
	},
	updateLayout:function(){
		LG.Utils.centreImages(this.$el,  {"right":true});
	},
	render:function(){
		var data = this.model.toJSON();
		//data.logo = LG.Utils.truncate(data.logo, 20);
		this.loadTemplate(  this.template, data , {replace:true} );
		this.updateLayout();
		return this;
	}

});



LG.GalleryRowView = LG.AGalleryRowView.extend({
	initialize:function(model){
		LG.AGalleryRowView.prototype.initialize.call(this, model);
	},
	template:"tpl_galleryrow"
});
