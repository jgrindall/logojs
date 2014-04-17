LG.HelpOverlayView = Backbone.View.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		
	},
	events:function(){
		var obj = Backbone.View.getTouch( {	} );
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		return this;
	},
	beforeClose:function(){
	
	}
});

