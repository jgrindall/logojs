LG.LoadView = LG.AGalleryView.extend({
	initialize:function(options){
		options.showName = this.showName;
		LG.AGalleryView.prototype.initialize.call(this, options);
	},
	events:function(){
		var obj = Backbone.View.getTouch( { } );
		return obj;
	},
	template:"tpl_load",
	showName:"load"
});



LG.LoadRowView = LG.AGalleryRowView.extend({
	initialize:function(model){
		LG.AGalleryRowView.prototype.initialize.call(this, model);
	},
	template:"tpl_galleryrow"
});




	
	


