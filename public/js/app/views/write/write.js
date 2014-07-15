
LG.WriteView = LG.AMenuView.extend({
	initialize:function(){
		var _this = this;
		this.error = {"show":false, "line":-1};
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 400, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.EventDispatcher, LG.Events.KEYBOARD_DOWN, $.proxy(this.kbDown, this));
		this.listenTo(LG.EventDispatcher, LG.Events.KEYBOARD_UP, $.proxy(this.kbUp, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_ROW, $.proxy(this.showErrorRow, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_RUNTIME, $.proxy(this.showErrorRuntime, this));
		this.listenTo(LG.EventDispatcher, LG.Events.FORCE_LOGO, $.proxy(this.forceLogo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.resize, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESET_ERROR, $.proxy(this.resetError, this));
		this.listenTo(LG.EventDispatcher, LG.Events.TO_BAR, $.proxy(this.toBar, this));
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
	toBar:function(){
		this.$logodiv.blur();
	},
	kbUp:function(){
		LG.Utils.log("kbup");
		this.resetError();
	},
	kbDown:function(){
		window.scrollTo(0,0);
		var h = $("body").height();
		$("body").height(h+1);
		$("body").height(h);
		setTimeout(function(){
			window.scrollTo(0,0);
			$("body").height(h+1);
			$("body").height(h);
		}, 100);
	},
	resize:function(){
		this.onScroll();
	},
	beforeClose:function(){
		this.$logodiv.off("scroll");
	},
	afterAdded:function(){
		this.$logodiv = this.$("#logodiv");
		this.$logonums = this.$("#logonums");
		this.$logodiv.scroll($.proxy(this.onScroll, this));
	},
	forceLogo:function(s){
		this.setLogo(s);
	},
	draw:function(){
		this.save();
		LG.EventDispatcher.trigger(LG.Events.CLICK_DRAW);
		try{
			window.cordova.plugins.Keyboard.close();
		}
		catch(e){
				
		}
	},
	load:function(){
		var logo, fileModel = LG.fileCollection.selected;
		logo = fileModel.get("logo");
		this.setLogo(logo);
	},
	showErrorRuntime:function(msg){
		msg = msg.replace(/Uncaught Error: /g,"Error while running your code: ");
		this.showErrorText(msg);
		this.error = {"show":true, "line":0};
		this.showErrorText(msg);
	},
	showErrorText:function(msg){
		var _this = this;
		setTimeout(function(){
			LG.Utils.log("show error!");
			_this.$(".error").text(msg).addClass("show").css("right", 0);
		}, 200);
		LG.router.navigate("write", {"trigger":true});
		LG.sounds.playError();
	},
	showErrorRow:function(expected, line, offset){
		this.error = {"show":true, "line":line};
		exp = expected[0].value;
		if(exp === ";"){
			msg = "Error on line "+ line +", did you miss off a semi-colon (\";\")?  Check your code!";
		}
		else{
			msg = "Error on line "+ line +", expected: \""+exp+"\". Check your code!";
		}
		this.showErrorText(msg);
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	clean:function(){
		var logo = this.getLogo();
		logo = logo.replace(new RegExp("[^"+LG.WriteView.ALLOWED+"]", 'g'), '');
		this.setLogo(logo);
	},
	save:function(){
		this.clean();
		var data = {"logo":this.getLogo()};
		this.logo = data.logo;
		this.stopListening(LG.fileCollection);
		LG.fileCollection.selected.set(data);
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.drawNums();
	},
	drawNums:function(){
		var numLines = this.$logodiv.val().split("\n").length;
		var s = [];
		for(var i = 1; i<= numLines; i++){
			s.push(i);
		}
		this.$logonums.val(s.join("\n"));
		this.$logonums.scrollTop(this.$logodiv.scrollTop());
	},
	setLogo:function(s){
		this.$logodiv.val(s);
	},
	getLogo:function(){
		return this.$logodiv.val();
	},
	changedText:function(e){
		this.changedTextDeBounce();
	},
	resetError:function(){
		LG.Utils.log("resetError  "+this.error.show);
		var w = this.$el.width();
		if(this.error.show){
			this.$(".error").removeClass("show").css("right", -w);
			this.error = {"show":false, "line":-1};
			LG.Utils.log("removed");
		}
	},
	onScroll:function(){
		this.$logonums.scrollTop(this.$logodiv.scrollTop());
	},
	mouseDown:function(){
		LG.Utils.log("md");
		this.resetError();
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"_mousedown":"mouseDown"
		});
		return obj;
	}
});

LG.WriteView.TOP = 53;

LG.WriteView.ALLOWED = "_a-zA-Z0-9\(\)\.\+\*/\n\r\t ,:=-";

LG.TouchWriteView = LG.WriteView.extend({
	initialize:function(){
		LG.WriteView.prototype.initialize.call(this);
	},
	addShowList:function(){
		var _this = this;
		this.$logodiv.on('focus', function(){
			_this.$logodiv.blur();
		});
	},
	removeShowList:function(){
		this.$logodiv.off('focus');
	},
	onBeforeShow:function(){
		this.$logodiv.attr("disabled", "disabled");
	},
	onShow:function(){
		var _this = this;
		this.addShowList();
		setTimeout(function(){
			_this.removeShowList();
			_this.$logodiv.removeAttr("disabled");
		}, 1000);
	},
	onHide:function(){
		this.removeShowList();
	}
});

LG.NoTouchWriteView = LG.WriteView.extend({
	initialize:function(){
		LG.WriteView.prototype.initialize.call(this);
	}
});




