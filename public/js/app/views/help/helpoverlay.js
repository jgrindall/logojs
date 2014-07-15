
LG.HelpOverlayView = LG.AMenuView.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click #cancelbutton":"clickClose"
		} );
		return obj;
	},
	showName:"helpoverlay",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	updateLayout : function() {
		if(this.wrapper && this.scroller && this.myScroll){
			var wrapperWidth = this.wrapper.width(), wrapperHeight = this.wrapper.height();
			this.$(".helpcontainer").width(wrapperWidth - 1).height(wrapperHeight - 1);
			this.scroller.css('width',  this.$(".helpcontainer").length * wrapperWidth + 1);
			this.myScroll.refresh();
		}
	},
	clickClose:function(){
		LG.sounds.playClick();
		window.history.back();
	},
	onShow:function(){
		this.initScroll();
	},
	onHide:function(){
		
	},
	renderColors:function(){
		var $colors1, $colors2, $colors3, $colors, displayName, dark, darkString;
		$colors1 = this.$("tr.colors:nth-child(1)");
		$colors2 = this.$("tr.colors:nth-child(2)");
		$colors3 = this.$("tr.colors:nth-child(3)");
		$colors = [$colors1, $colors2, $colors3];
		_.each(LG.GraphicsModel.NAMES, function(name, i){
			displayName = name.replace(/\//g, "<br/>");
			dark = (LG.GraphicsModel.DARKTEXT.indexOf(i) >= 0);
			darkString = "";
			if(dark){
				darkString = " colornamedark";
			}
			var index = Math.floor(i/6);
			$colors[index].append("<td class='colorblock dino"+i+"'><span class='colorname"+darkString+"'>"+displayName+"</span></td>");
		});
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.scroller = this.$("#refscroller");
		this.wrapper = this.$("#refwrapper");
		this.renderColors();
		return this;
	},
	initScroll:function(){
		console.log("init scroll");
		var _this = this;
		this.myScroll = new IScroll("#refwrapper", {snap:".helpcontainer", scrollbars:true, scrollX:true, scrollY:false, interactiveScrollbars:true, momentum:false});
		this.updateLayout();
	},
	beforeClose:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	}
});






