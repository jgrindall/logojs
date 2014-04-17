
LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 750, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		LG.EventDispatcher.on(LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		LG.EventDispatcher.bind(LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
	},
	template:"tpl_write",
	showName:"write",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.writeButtons = new LG.WriteButtonsView();
		this.writeTop = new LG.WriteTopView();
		this.$el.append(this.writeButtons.render().$el).append(this.writeTop.render().$el);
		return this;
	},
	draw:function(){
		this.save();
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW);
	},
	load:function(){
		this.setLogo(LG.fileCollection.selected.get("logo"));
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	save:function(){
		var data = {"logo":this.getLogo()};
		alert("saving it in the model "+JSON.stringify(data));
		LG.fileCollection.selected.set(data);
	},
	setLogo:function(s){
		this.$("textarea").val(s);
	},
	getLogo:function(){
		return this.$("textarea").val();
	},
	changedText:function(e){
		if(e.which === 186 || e.which === 13 || e.which === 32){
			LG.fileCollection.selected.set({"logo":this.getLogo()});
		}
		else{
			this.changedTextDeBounce();
			if(Math.random() < 0.3){
				LG.Utils.growl("Click here to draw your program!");
			}
		}
	},
	swipeMe:function(e){
		this.stopProp(e);
		if(e.gesture.direction === "right"){
			LG.router.navigate("menu", {"trigger":true});
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



