
// extends LG.AbstractPageView

LG.ActivityView = LG.AbstractPageView.extend({
	template:"tpl_activity",
	name:"activity",
	initialize:function(){
		
	},
	render:function(){
		var _this = this;
		
		this.loadTemplate(  this.template, { }, {replace:true}  );
		
		this.canvasView = new LG.CanvasView();
		this.$el.append(this.canvasView.render().el);
		
		this.writeView = new LG.WriteView();
		this.$el.append(this.writeView.render().el);
		
		this.helpView = new LG.HelpView();
		this.$el.append(this.helpView.render().el);
		
		this.galleryView = new LG.GalleryView({"collection":LG.allFilesCollection});
		this.$el.append(this.galleryView.render().el);
		
		this.filenameView = new LG.FileNameView();
		this.$el.append(this.filenameView.render().el);
		
		this.menuView = new LG.MenuView();
		this.$el.append(this.menuView.render().el);
		
		this.loadView = new LG.LoadView({"collection":LG.fileCollection});	
		this.$el.append(this.loadView.render().el);
		
		this.helpOverlayView = new LG.HelpOverlayView();	
		this.$el.append(this.helpOverlayView.render().el);
		
		
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			
		});
		return obj;
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		this.canvasView.afterAdded();
		this.writeView.afterAdded();
		this.galleryView.afterAdded();
		this.menuView.afterAdded();
		this.loadView.afterAdded();
	}
	
});

