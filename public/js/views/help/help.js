LG.HelpView = LG.AMenuView.extend({
	template:"tpl_help",
	showName:"help",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click #cancelbutton":"clickCancel"
		});
		return obj;
	},
	clickCancel:function(){
		LG.sounds.playClick();
		window.history.back();
	},
	updateLayout : function() {
		if(this.wrapper && this.scroller && this.myScroll){
			var wrapperWidth = this.wrapper.width(), wrapperHeight = this.wrapper.height();
			this.$(".helpcontainer").width(wrapperWidth - 1).height(wrapperHeight - 1);
			this.scroller.css('width',  this.$(".helpcontainer").length * wrapperWidth + 1);
			this.myScroll.refresh();
		}
		LG.Utils.centreImages(this.$el);
	},
	render:function(){
		this.loadTemplate(  this.template, {"web":!LG.Config.PHONEGAP},  {replace:true}  );
		this.scroller = this.$("#helpscroller");
		this.wrapper = this.$("#helpwrapper");
		LG.Utils.centreImages(this.$el);
		return this;
	},
	onShow:function(){
		this.initScroll();
		this.$("img#anim").attr("src", "img/video/video.gif");
	},
	onHide:function(){
		this.$("img#anim").attr("src", "").removeAttr("src");
	},
	beforeClose:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	},
	initScroll:function(){
		var _this = this;
		this.myScroll = new IScroll("#helpwrapper", {snap:".helpcontainer", scrollbars:true, scrollX:true, scrollY:false, interactiveScrollbars:true, momentum:false});
		this.updateLayout();
	}
});
