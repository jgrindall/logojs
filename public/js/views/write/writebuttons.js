
// extends LG.AbstractPageView

LG.WriteButtonsView = Backbone.View.extend({
	template:"tpl_writebuttons",
	
	initialize:function(){
		_.bindAll(this);
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.undoButton = new LG.UndoButtonView();
		this.redoButton = new LG.RedoButtonView();
		this.clearButton = new LG.ClearButtonView();
		this.saveButton = 	new LG.SaveButtonView ();
		this.deleteButton = new LG.DeleteButtonView ();
		this.newButton = new LG.NewButtonView ();
		this.$el.append(this.saveButton.render().el).append(this.newButton.render().el).append(this.undoButton.render().el).append(this.redoButton.render().el).append(this.clearButton.render().el).append(this.deleteButton.render().el);
		return this;
	},
	events:function(){
		
	},
	beforeClose:function(){
		if(this.redoButton){
			this.redoButton.close();
		}
		if(this.undoButton){
			this.undoButton.close();
		}
		if(this.clearButton){
			this.clearButton.close();
		}
		this.redoButton = null;
		this.clearButton = null;
		this.undoButton = null;
	},
	afterAdded:function(){
		
	}
	
});

