LG.HelpOverlayView = Backbone.View.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		var _this = this;
		setInterval(function(){
			if(LG.fileCollection){
				_this.$("p").text("Help!  "+LG.fileCollection.length);
			}
		}, 1000);
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

