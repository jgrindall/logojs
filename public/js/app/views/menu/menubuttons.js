
// extends LG.AbstractPageView

LG.MenuButtonsView = Backbone.View.extend({
	template:"tpl_menubuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.galleryButton 		= 	new LG.GalleryButtonView();
		this.examplesButton 	= 	new LG.ExamplesButtonView();
		this.refButton 			= 	new LG.RefButtonView();
		this.loadButton 		= 	LG.create.loadButton();
		this.helpButton 		= 	new LG.HelpButtonMenuView ();
		this.loginButton 		= 	LG.create.loginButton();
		this.logoButton			=	new LG.LogoButtonView ();
		this.$el.append(this.helpButton.render().el).append(this.loadButton.render().el).append(this.galleryButton.render().el).append(this.examplesButton.render().el).append(this.refButton.render().el).append(this.loginButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
	
});

