
LG.HelpOverlayView = LG.AMenuView.extend({
	template:"tpl_helpoverlay",
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click button.next":"clickNext",
			"_click button.copy":"clickCopy",
			"_click button.more":"clickMore",
			"_click button.draw":"clickDraw",
			"_click #cancelbutton":"clickClose",
			"_click":"clickMe"
		} );
		return obj;
	},
	showName:"helpoverlay",
	clickDraw:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW_START);
	},
	clickNext:function(e){
		this.stopProp(e);
	},
	clickMore:function(e){
		this.stopProp(e);
		LG.router.navigate("help", {"trigger":true});
	},
	clickCopy:function(e){
		this.stopProp(e);
	},
	clickClose:function(){
		window.history.back();
	},
	copy:function(){
		var s = "rpt 6[\nfd(100);rt(60);\n]";
		LG.EventDispatcher.trigger(LG.Events.FORCE_LOGO, s);
	},
	clickMe:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.HIDE_HELP_OVERLAY);
	},
	onShow:function(){
	
	},
	onHide:function(){
		
	},
	renderColors:function(){
		var $colors1 = this.$("#colorsref1"), $colors2 = this.$("#colorsref2"), displayName, dark, darkString;
		_.each(LG.GraphicsModel.NAMES1, function(name, i){
			displayName = name.replace(/\//g, "<br/>");
			dark = (LG.GraphicsModel.DARKTEXT.indexOf(i) >= 0);
			darkString = "";
			if(dark){
				darkString = " colornamedark";
			}
			$colors1.append("<div class='colorblock dino"+i+"'><span class='colorname"+darkString+"'>"+displayName+"</span></div>");
		});
		_.each(LG.GraphicsModel.NAMES2, function(name, i){
			displayName = name.replace(/\//g, "<br/>");
			dark = (LG.GraphicsModel.DARKTEXT.indexOf(i + LG.GraphicsModel.NAMES1.length) >= 0);
			darkString = "";
			if(dark){
				darkString = " colornamedark";
			}
			$colors2.append("<div class='colorblock dino"+(i + LG.GraphicsModel.NAMES1.length)+"'><span class='colorname"+darkString+"'>"+displayName+"</span></div>");
		});
	},
	render:function(){
		this.loadTemplate(  this.template, {},  {replace:true}  );
		this.renderColors();
		return this;
	},
	beforeClose:function(){
	
	}
});



