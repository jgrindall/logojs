LG.AMenuView = Backbone.View.extend({	
	initialize:function(){
		var _this = this;
		this.listenTo(LG.layoutModel, "change", $.proxy(this.onLayoutChanged, this));
	},
	showName:"",
	onLayoutChanged:function(){
		var showName = LG.layoutModel.get("show");
		if(showName === this.showName){
			this.onBeforeShow();
			this.$el.addClass("show");
			this.onShow();
		}
		else{
			this.$el.removeClass("show");
			this.onHide();
		}
	},
	onBeforeShow:function(){
		
	},
	onShow:function(){
	
	},
	onHide:function(){
		
	}
});




// extends Backbone.View - a base class for all "this is a button in the header" views
LG.MenuButton = LG.Button.extend({
	
});

