
LG.GalleryView = LG.AGalleryView.extend({
	initialize:function(options){
		options.showName = this.showName;
		LG.AGalleryView.prototype.initialize.call(this, options);
	},
	preview:function(id){
		if(this.gallerySide){
			this.gallerySide.openPreview(id);
		}
	},
	template:"tpl_gallery",
	showName:"gallery"
});


