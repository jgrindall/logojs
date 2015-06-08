
// extends LG.AbstractPageView

LG.ActivityView = LG.AbstractPageView.extend({
	template:"tpl_activity",
	name:"activity",
	initialize:function(){
		this.listenTo(LG.EventDispatcher, LG.Events.TO_BAR,				$.proxy(this.showBar, this));
	},
	showBar:function(){
		LG.router.navigate("writebar", {"trigger":true});
	},
	render:function(){
		
		this.loadTemplate(  this.template, { }, {replace:true}  );
		
		this.canvasView = new LG.CanvasView();
		this.$el.append(this.canvasView.render().el);
		
		this.writeView = LG.create.writeView();
		this.$el.append(this.writeView.render().el);
		
		this.writeBarView = new LG.WriteBarView();
		this.$el.append(this.writeBarView.render().el);
		
		this.helpView = new LG.HelpView();
		this.$el.append(this.helpView.render().el);
		
		this.galleryView = new LG.GalleryView({"collection":LG.allFilesCollection, "title":"Back", "listView":LG.GalleryListView});
		this.$el.append(this.galleryView.render().el);
		
		this.filenameView = new LG.FileNameView();
		this.$el.append(this.filenameView.render().el);
		
		this.helpOverlayView = new LG.HelpOverlayView();	
		this.$el.append(this.helpOverlayView.render().el);
		
		this.menuView = new LG.MenuView();
		this.$el.append(this.menuView.render().el);
		
		this.loadView = new LG.LoadView({"collection":LG.fileCollection, "title":"Back", "listView":LG.GalleryLoadListView});	
		this.$el.append(this.loadView.render().el);
		
		this.examplesView = new LG.ExamplesView();	
		this.$el.append(this.examplesView.render().el);
		
		
		
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

