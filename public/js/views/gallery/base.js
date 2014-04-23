
LG.AGalleryView = LG.AMenuView.extend({
	
	initialize:function(options){
		LG.AMenuView.prototype.initialize.call(this);
		this.options = options;
	},
	bottomView:LG.GalleryBottomView,
	topView:LG.GalleryTopView,
	listView:LG.GalleryListView,
	sideView:LG.GallerySideView,
	removeMenus:function(){
		if(this.galleryTop){
			this.galleryTop.unbind();
			this.galleryTop.close();
			this.galleryTop = null;
		}
		if(this.galleryList){
			this.galleryList.unbind();
			this.galleryList.close();
			this.galleryList = null;
		}
		if(this.gallerySide){
			this.gallerySide.unbind();
			this.gallerySide.close();
			this.gallerySide = null;
		}
	},
	addMenus:function(){
		this.removeMenus();
		this.galleryTop = new this.topView();
		this.galleryList = new this.listView(this.options);
		this.gallerySide = new this.sideView(this.options);
		this.$el.prepend(this.galleryTop.render().$el);
		this.$el.append(this.galleryList.render().$el);
		this.$el.append(this.gallerySide.render().$el);
	},
	onShow:function(){
		this.galleryList.onShow();
		this.gallerySide.onShow();
	},
	render:function(){
		this.loadTemplate(  this.template, {} , {replace:true} );
		this.addMenus();
		return this;
	},
	onHide:function(){
		this.galleryList.onHide();
	},
	beforeClose:function(){
		this.removeMenus();
	},
	events:function(){
		var obj = { };
		return obj;
	}
});


LG.AGalleryRowView = Backbone.View.extend({
	initialize:function(model){
		this.model = model;
	},
	setSelected:function(sel){
		if(sel){
			this.$el.addClass("selected");
		}
		else{
			this.$el.removeClass("selected");
		}
	},
	render:function(){
		var data = this.model.toJSON();
		data.logo = LG.Utils.truncate(data.logo, 20);
		this.loadTemplate(  this.template, data , {replace:true} );
		return this;
	}

});




