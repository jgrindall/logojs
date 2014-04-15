
// extends LG.AbstractPageView

LG.ActivityButtonsView = Backbone.View.extend({
	template:"tpl_activitybuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.startButton = new LG.StartButtonView();
		this.stopButton = new LG.StopButtonView();
		this.$el.append(this.startButton.render().el).append(this.stopButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.startButton){
			this.startButton.close();
		}
		if(this.stopButton){
			this.stopButton.close();
		}
		this.startButton = null;
		this.stopButton = null;
	},
	afterAdded:function(){
		
	}
	
});

