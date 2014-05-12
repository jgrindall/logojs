
// extends LG.AbstractPageView

LG.ActivityView = LG.AbstractPageView.extend({
	template:"tpl_activity",
	name:"activity",
	initialize:function(){
		this.listenTo(LG.EventDispatcher, LG.Events.SHOW_HELP_OVERLAY, 	$.proxy(this.showHelp, this));
		this.listenTo(LG.EventDispatcher, LG.Events.HIDE_HELP_OVERLAY, 	$.proxy(this.hideHelp, this));
		this.listenTo(LG.EventDispatcher, LG.Events.TO_BAR,				$.proxy(this.showBar, this));
	},
	showHelp:function(){
		if(!this.helpOverlayView){
			this.helpOverlayView = new LG.HelpOverlayView();	
			this.$el.append(this.helpOverlayView.render().el);
		}
	},
	showBar:function(){
		LG.router.navigate("writebar", {"trigger":true});
	},
	hideHelp:function(){
		if(this.helpOverlayView){
			this.helpOverlayView.close();
			this.helpOverlayView = null;
		}
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
		
		this.galleryView = new LG.GalleryView({"collection":LG.allFilesCollection});
		this.$el.append(this.galleryView.render().el);
		
		this.filenameView = new LG.FileNameView();
		this.$el.append(this.filenameView.render().el);
		
		/*
		this.contextButtonsView = new LG.ContextButtonsView();
		this.$el.append(this.contextButtonsView.render().el);
		*/
		
		this.menuView = new LG.MenuView();
		this.$el.append(this.menuView.render().el);
		
		this.loadView = new LG.LoadView({"collection":LG.fileCollection});	
		this.$el.append(this.loadView.render().el);
		
		this.mainMenuView = new LG.MainMenuView();	
		this.$el.append(this.mainMenuView.render().el);
		this.mainMenuView.afterAdded();
		
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

