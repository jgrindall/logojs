// go back to catalogue

// extends LG.Headerbutton

LG.GalleryButtonView = LG.HeaderButton.extend({
	template:"tpl_gallerybutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
	},
	onClick:function(e){
		this.stopProp(e);
		LG.router.navigate("gallery", {"trigger":true});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	}
});

LG.WebGalleryButton = LG.GalleryButtonView.extend({
	getData:function(){
		return {"disabled":false};
	}
});

LG.IPadGalleryButton = LG.GalleryButtonView.extend({
	getData:function(){
		return {"disabled":true};
	}
});