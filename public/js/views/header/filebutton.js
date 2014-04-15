// go back to catalogue

// extends LG.Headerbutton

LG.FileButtonView = LG.HeaderButton.extend({
	template:"tpl_filebutton",
	initialize:function(){
		LG.HeaderButton.prototype.initialize.call(this);
		this.listenTo(LG.fileCollection, "sync change", $.proxy(this.rerender, this));
	},
	onClick:function(e){
		this.stopProp(e);
	},
	render:function(){
		var name = null, saved = false, fileModel;
		fileModel = LG.fileCollection.selected;
		if(fileModel){
			name = fileModel.get("name");
			saved = LG.fileCollection.isSaved();
		}
		this.loadTemplate(  this.template, { show: this.getShow(), disabled:this.getDisabled(), "name":name, "saved": saved } , {replace:true} );
		return this;
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click":"onClick"
		});
		return obj;
	
	}
});

