
LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		this.error = {"show":false, "row":-1};
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 750, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_ROW, $.proxy(this.showErrorRow, this));
		this.listenTo(LG.EventDispatcher, LG.Events.FORCE_LOGO, $.proxy(this.forceLogo, this));
		this.listenTo(LG.EventDispatcher, LG.Events.RESIZE, $.proxy(this.resize, this));
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
		this.redrawHandle();
	},
	afterAdded:function(){
		this.$handle = this.$("#logoscrollhandle");
		this.$scroller = this.$("#logoscroller");
		this.$scrollbar = this.$("#logoscrollbar");
		this.$logodiv = this.$("#logodiv");
		this.redrawHandle();
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
		if(logo != this.logo);{
			this.setLogo(logo);
		}
	},
	showErrorRow:function(expected, offset){
		var s, okChars, i, row, msg, exp;
		s = this.getLogo();
		if(!s){
			return;
		}
		this.setLogo(s);
		okChars = s.substr(0, offset);
		i = LG.Utils.countCharsIn(okChars, LG.WriteView.SEPARATOR);
		row = this.$logodiv.children()[i];
		this.error = {"show":true, "row":i};
		$(row).css("background-color", "#FFA07A");
		exp = expected[0].value;
		if(exp === ";"){
			msg = "Error, did you miss off a semi-colon (\";\")?  Check your code!";
		}
		else{
			msg = "Error, expected: \""+exp+"\" check your code!";
		}
		this.$(".error").text(msg).addClass("show");
		//this.scrollToChild(i);
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
		this.redrawHandle();
	},
	setLogo:function(s){
		console.log("setLogo");
		var html = LG.WriteView.decodeToHtml(s);
		this.$logodiv.html(html);
		this.redrawHandle();
	},
	redrawHandle:function(){
		var h, availableHeight, ratio, top;
		h = this.$logodiv.height();
		availableHeight = this.$scrollbar.height();
		ratio = h / availableHeight;
		console.log(h+" / "+availableHeight);
		if(ratio > 1){
			this.$handle.height(availableHeight / ratio);
		}
		else{
			this.$handle.height( 0 );
		}
		top = this.$logodiv.offset().top + parseInt(this.$logodiv.css("top"), 10) - LG.WriteView.TOP;
		var percentScrolled = - top / (h - availableHeight);
		this.$handle.css("top", percentScrolled * (availableHeight - this.$handle.height()));
		console.log("top "+this.$logodiv.offset().top+", "+this.$logodiv.css("top") + " :   "+percentScrolled+"  -> "+top);
	},
	getLogo:function(){
		var html, decoded;
		html = this.$logodiv.html();
		html = html.replace(/&nbsp;/g, "");
		decoded = LG.WriteView.decodeFromHtml(html);
		return decoded;
	},
	changedText:function(e){
		this.changedTextDeBounce();
	},
	resetError:function(){
		console.log("reset error");
		if(this.error.show){
			var row = this.$logodiv.children()[this.error.row];
			$(row).css("background-color", "transparent").removeAttr("style");
			this.$(".error").removeClass("show");
			this.error = {"show":false, "row":-1};
		}
	},
	checkScroll:function(e){
		this.stopProp(e);
		var h2, y0, y1, percent, top, dy;
		dy = e.pageY - this.startY;
		console.log("dy");
		top = Math.max(0, dy + this.startTop);
		top = Math.min(this.$scrollbar.height() - this.$handle.height(), top);
		console.log(this.$scrollbar.height() +", "+ this.$handle.height()+" top "+top);
		this.$handle.css("top", top);
		this.updateScroll();
	},
	updateScroll:function(){
		var left, top, availableHeight, h;
		availableHeight = this.$scrollbar.height();
		h = this.$handle.height();
		left = this.$logodiv.offset().left;
		top = parseInt(this.$handle.css("top"), 10);
		var percentScrolled = top / (availableHeight - h);
		// if top is zero then offset is zero
		// if top is max (availableHeight - h) then top is -
		var t = -percentScrolled * (this.$logodiv.height() - availableHeight);
		console.log("top "+t+"    "+percentScrolled);
		this.$logodiv.offset({ top: LG.WriteView.TOP, left: left});
		this.$logodiv.css("top", t);
	},
	stopScroll:function(e){
		console.log("stop "+this.scrolling);
		if(this.scrolling){
			$(document).off("mousemove");
			$(document).off("mouseup");
			this.scrolling = false;
		}
	},
	startScroll:function(e){
		this.stopProp(e);
		this.scrolling = true;
		this.startTop = parseInt(this.$handle.css("top"), 10);
		this.offset = e.pageY - LG.WriteView.TOP - this.startTop - this.$handle.height()/2;
		this.startY = e.pageY;
		console.log("offset "+this.startTop+", "+this.offset);
		$(document).on("mousemove", $.proxy(this.checkScroll, this));
		$(document).on("mouseup", $.proxy(this.stopScroll, this));
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"mousedown #logoscrollbar":"startScroll",
			"mousedown":"resetError"
		} );
		return obj;
	}
});

LG.WriteView.SEPARATOR = "$";

LG.WriteView.TOP = 53;

LG.WriteView.decodeFromHtml = function(html){
	var s = "";
	try{
		s = LG.htmlParser.parse(html);
	}
	catch(e){
		console.log("error parsing html "+e.message);
	}
	console.log("decodeFromHtml "+html+" -> "+JSON.stringify(s));
	return s.text;
};

LG.WriteView.formatForGallery = function(logo){
	return logo.split(LG.WriteView.SEPARATOR).join("\n");
};

LG.WriteView.decodeToHtml = function(html){
	if(!html){
		return null;
	}
	var nodes = html.split(LG.WriteView.SEPARATOR);
	_.each(nodes, function(val, i){
		if(val === ""){
			nodes[i] = "<br/>";
		}
	});
	console.log("nodes "+JSON.stringify(nodes));
	var s = nodes.join("</div><div>");
	s = "<div>"+s+"</div>";
	console.log("decodeToHtml "+html+" -> "+JSON.stringify(s)+"   "+s);
	return s;
};






