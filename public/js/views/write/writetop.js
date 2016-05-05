
// extends LG.AbstractPageView

LG.WriteTopView = Backbone.View.extend({
	template:"tpl_writetop",
	
	initialize:function(){
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.fileButton = new LG.FileButtonView ( );
		this.dinoButton = new LG.DinoButtonView ( );
		this.settingsButton = new LG.SettingsButtonView ( );
		this.helpButton = new LG.HelpButtonView ( );
		this.$el.append(this.dinoButton.render().el).append(this.fileButton.render().el).append(this.helpButton.render().el).append(this.settingsButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.fileButton){
			this.fileButton.close();
		}
		if(this.settingsButton){
			this.settingsButton.close();
		}
		if(this.helpButton){
			this.helpButton.close();
		}
		this.fileButton = null;
		this.settingsButton = null;
		this.helpButton = null;
	},
	afterAdded:function(){
		
	}
	
});
