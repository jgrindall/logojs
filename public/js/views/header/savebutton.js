// go back to catalogue

// extends LG.Headerbutton

LG.SaveButtonView = LG.HeaderButton.extend({
	template:"tpl_savebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "sync change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
		if(this.$el.hasClass("disabled")){
			return;
		}
		LG.fileCollection.save({});
	},
	getDisabled:function(){
		var saved = false, fileModel;
		fileModel = LG.fileCollection.selected;
		if(fileModel){
			saved = LG.fileCollection.isSaved();
		}
		return saved;
	},
	render:function(){
		this.loadTemplate(  this.template, { show: this.getShow(), disabled:this.getDisabled()  } , {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});
