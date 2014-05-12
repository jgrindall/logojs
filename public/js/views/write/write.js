
LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		this.error = {"show":false, "line":-1};
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 400, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_ROW, $.proxy(this.showErrorRow, this));
		this.listenTo(LG.EventDispatcher, LG.Events.FORCE_LOGO, $.proxy(this.forceLogo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.resize, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESET_ERROR, $.proxy(this.resetError, this));
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
	},
	load:function(){
		var logo, fileModel = LG.fileCollection.selected;
		logo = fileModel.get("logo");
		if(logo != this.logo){
			this.setLogo(logo);
		}
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
		this.$(".error").text(msg).addClass("show");
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	save:function(){
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
		console.log("reset error");
		if(this.error.show){
			this.$(".error").removeClass("show");
			this.error = {"show":false, "line":-1};
		}
	},
	onScroll:function(){
		this.$logonums.scrollTop(this.$logodiv.scrollTop());
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"mousedown":"resetError"
		} );
		return obj;
	}
});

LG.WriteView.TOP = 53;




