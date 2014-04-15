
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
		this.loadButton 		= 	new LG.LoadButtonView ();
		this.helpButton 		= 	new LG.HelpButtonMenuView ();
		this.loginButton 		= 	new LG.LoginButtonView ();
		this.$el.append(this.loadButton.render().el).append(this.galleryButton.render().el).append(this.helpButton.render().el).append(this.loginButton.render().el)
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
	
});

