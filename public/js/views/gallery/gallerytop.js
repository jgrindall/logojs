
// extends Backbone.View - a base class for all "this is a button in the header" views
LG.GalleryTopView = Backbone.View.extend({
	template:"tpl_gallerytop",
	render:function(){
		this.loadTemplate(  this.template, {} , {replace:true} );
		this.cancelButton = new LG.CancelButtonView();
		this.$el.append(this.cancelButton.render().$el);
		return this;
	}
});


