
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
	},
	template:"tpl_write",
	showName:"write",
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.writeButtons = new LG.WriteButtonsView();
		this.writeTop = new LG.WriteTopView();
		this.$el.append(this.writeButtons.render().$el).append(this.writeTop.render().$el);
		this.logoDiv = this.$("#logodiv");
		return this;
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
		row = this.logoDiv.children()[i];
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
		this.scrollToChild(i);
	},
	scrollToChild:function(index){
		var h = 0, rows = this.logoDiv.children(), top = this.logoDiv.scrollTop();
		for(var i = 0; i <= index - 1; i++){
			h += $(rows[i]).height();
		}
		if(top > h && top < h + this.$().height()){
			// already visible
		}
		else{
			this.logoDiv.scrollTop(h);
		}
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
	},
	setLogo:function(s){
		var html = LG.WriteView.decodeToHtml(s);
		this.logoDiv.html(html);
	},
	getLogo:function(){
		var html, decoded;
		html = this.logoDiv.html();
		html = html.replace(/&nbsp;/g, "");
		//html = html.replace(/<br>/g, "");
		decoded = LG.WriteView.decodeFromHtml(html);
		return decoded;
	},
	changedText:function(e){
		if(e.which === 186 || e.which === 13 || e.which === 32){
			this.save();
		}
		else{
			this.changedTextDeBounce();
		}
	},
	reset:function(){
		if(this.error.show){
			var row = this.$("#logodiv").children()[this.error.row];
			$(row).css("background-color", "transparent").removeAttr("style");
			this.$(".error").removeClass("show");
			this.error = {"show":false, "row":-1};
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"mousedown":"reset"
		} );
		return obj;
	}
});

LG.WriteView.SEPARATOR = "$";

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


