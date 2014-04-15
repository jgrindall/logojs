
LG.MenuView = LG.AMenuView.extend({
	
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	template:"tpl_menu",
	showName:"menu",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.menuButtons = new LG.MenuButtonsView();
		this.menuTop = new LG.MenuTopView();
		this.$el.append(this.menuTop.render().$el).append(this.menuButtons.render().$el);
		this.$el.hammer( {"prevent_mouseevents": false} );
		return this;
	},
	swipeMe:function(e){
		this.stopProp(e);
		if(e.gesture.direction === "right"){
			LG.router.navigate("write", {"trigger":true});
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"_swipe":"swipeMe"
		} );
		return obj;
	}
});




	