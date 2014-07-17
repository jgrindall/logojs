
LG.ExamplesView = LG.AMenuView.extend({
	template:"tpl_examples",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.updateLayout, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .imgcontainer":"clickEx",
			"_click #cancelbutton":"clickClose"
		} );
		return obj;
	},
	showName:"examples",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickEx:function(e){
		this.stopProp(e);
		var j = $(e.currentTarget).index();
		var s = LG.ExamplesView.LOGO[j];
		if(s){
			LG.fileOpener.newFile();
			LG.router.navigate("write", {"trigger":true});
			LG.EventDispatcher.trigger(LG.Events.FORCE_LOGO, s);
			LG.Utils.growl("Click on the left panel to draw");
		}
	},
	clickClose:function(){
		LG.sounds.playClick();
		window.history.back();
	},
	clickMe:function(e){
		this.stopProp(e);
		window.history.back();
	},
	onShow:function(){
		this.updateLayout();
	},
	updateLayout : function() {
		LG.Utils.centreImages(this.$el);
	},
	onHide:function(){
		
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {"replace":true}  );
		this.updateLayout();
		return this;
	},
	beforeClose:function(){
	
	}
});

LG.ExamplesView.LOGO = [ ];
LG.ExamplesView.LOGO.push("fd(100) rt(90)\nfd(100) rt(90)\nfd(100) rt(90)\nfd(100) rt(90)");
LG.ExamplesView.LOGO.push("fd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45)\npenup() fd(50) rt(45) pendown()\nfd(50) rt(45) penup() fd(50) rt(45) pendown()");
LG.ExamplesView.LOGO.push("bg(gray)\nthick(4) color(yellow) fd(30)\nthick(6) color(blue) fd(30)\nthick(8) color(orange) fd(30)\nthick(10) color(red) fd(30)");
LG.ExamplesView.LOGO.push("bg(orange)\ncolor(white)\nn:=16\ns=200\nrpt n\n    fd(s) rt(180 - 360/n)\nendrpt");
LG.ExamplesView.LOGO.push("bg(blue)\ncolor(yellow)\nthick(10)\nn=4\nproc drawsquare\n    rpt n\n        fd(100) rt(90)\n    endrpt\nendproc\nrpt 8\n    drawsquare()\n    rt(45)\nendrpt");
LG.ExamplesView.LOGO.push("a=5\nproc drawpoly(side, n)\n    rpt n\n        fd(side) rt(360/n)\n    endrpt\nendproc\nrpt 10\n    drawpoly(25,a)\n    a=a+4\nendrpt\n");
LG.ExamplesView.LOGO.push("bg(blue) color(white)\nrpt 90 fd(1)rt(1) endrpt\nrt(270)\nrpt 180 fd(1)rt(1) endrpt\nrt(270)\nrpt 90 fd(1)rt(1) endrpt");
LG.ExamplesView.LOGO.push("a=10\nrpt 120\n  fd(15) rt(a)\n  a=a*1.02\nendrpt");








