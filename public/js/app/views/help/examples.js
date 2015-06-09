
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
			LG.Utils.growl(LG.Messages.WRITE);
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
LG.ExamplesView.LOGO.push("fd 100 rt 90\nfd 100 rt 90\nfd 100 rt 90\nfd 100 rt 90");
LG.ExamplesView.LOGO.push("fd 50 penup\nfd 50 pendown\nfd 50 penup\nfd 50 pendown\nfd 50 rt 120\nfd 50 penup\nfd 50 pendown\nfd 50 penup\nfd 50 pendown\nfd 50 rt 120\nfd 50 penup\nfd 50 pendown\nfd 50 penup\nfd 50 pendown\nfd 50 rt 120");
LG.ExamplesView.LOGO.push("bg red\nthick 4\ncolor yellow\nfd 50 rt 45\nthick 6\ncolor green\nfd 70 rt 45\nthick 8\ncolor blue\nfd 90 rt 45\nthick 10\ncolor purple\nfd 110 rt 45\nthick 12\ncolor midnight\nfd 130 rt 45\nthick 14\ncolor black\nfd 150 rt 45");
LG.ExamplesView.LOGO.push("bg orange\ncolor white\nmake \"n 16\nmake \"s 200\nrpt :n[\n    fd :s  rt (180 - 360/:n)\n\]");
LG.ExamplesView.LOGO.push("bg black\ncolor green\nthick 2\nrpt 36 [\n  rpt 180 [\n    fd 2\n    rt 2\n  ]\nrt 10\n]");
LG.ExamplesView.LOGO.push("bg purple\ncolor yellow\nthick 4\nmake \"a 4\nto drawpoly :side :n\n    rpt :n[\n        fd :side rt(360/:n)\n    ]\nend\nrpt 7[\n    drawpoly 35 :a\n    make \"a :a + 3\n]");
LG.ExamplesView.LOGO.push("bg white\ncolor red\nto drawspiral :dist\n  fd :dist\n  rt 90\n  drawspiral (:dist + 5)\nend\ndrawspiral 10");
LG.ExamplesView.LOGO.push("bg green\ncolor dkgreen\nthick 3\nmake \"a 6\nrpt 1500 [\n  fd 15\n  rt :a\n  make \"a :a*1.005\n]");








