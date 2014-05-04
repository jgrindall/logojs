
LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
		this.error = {"show":false, "row":-1};
		LG.AMenuView.prototype.initialize.call(this);
		this.changedTextDeBounce = $.debounce( 500, $.proxy(this.save, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_CLEAR, $.proxy(this.clear, this));
		this.listenTo(LG.fileCollection, "add change sync", $.proxy(this.load, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_TIDY, $.proxy(this.tidy, this));
		this.listenTo(LG.EventDispatcher, LG.Events.CLICK_DRAW_START, $.proxy(this.draw, this));
		this.listenTo(LG.EventDispatcher, LG.Events.ERROR_ROW, $.proxy(this.showErrorRow, this));
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
		var fileModel = LG.fileCollection.selected;
		this.setLogo(fileModel.get("logo"));
	},
	showErrorRow:function(expected, offset){
		var s, okChars, i, row;
		this.reset();
		s = this.getLogo();
		okChars = s.substr(0, offset);
		i = LG.Utils.countCharsIn(okChars, '$');
		row = this.$("#logodiv").children()[i];
		this.error = {"show":true, "row":i};
		$(row).css("background", "pink");
		console.log("set error "+JSON.stringify(this.error));
		this.$(".error").text("Error, expected: \""+expected[0].value+"\" check your code!").css("display", "block");
	},
	clear:function(){
		this.setLogo("");
		this.changedTextDeBounce();
	},
	save:function(){
		var data = {"logo":this.getLogo()};
		LG.fileCollection.selected.set(data);
	},
	setLogo:function(s){
		var html = LG.WriteView.decodeToHtml(s);
		this.$("#logodiv").html(html);
	},
	getLogo:function(){
		var html, decoded;
		html = this.$("#logodiv").html();
		html = html.replace(/&nbsp;/g, "");
		html = html.replace(/<br>/g, "");
		decoded = LG.WriteView.decodeFromHtml(html);
		console.log("html is "+html+" decoded is "+decoded);
		return decoded;
	},
	changedText:function(e){
		if(e.which === 186 || e.which === 13 || e.which === 32){
			LG.fileCollection.selected.set({"logo":this.getLogo()});
		}
		else{
			this.changedTextDeBounce();
		}
	},
	reset:function(){
		console.log("RESET "+JSON.stringify(this.error));
		if(this.error.show){
			var row = this.$("#logodiv").children()[this.error.row];
			$(row).css("background", "none");
			this.$(".error").css("display", "none");
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

LG.WriteView.decodeFromHtml = function(html){
	var s = "";
	try{
		s = LG.htmlParser.parse(html);
	}
	catch(e){
		console.log("error parsing html "+e.message);
	}
	return s.text;
};

LG.WriteView.decodeToHtml = function(html){
	var nodes = html.split("$");
	var s = nodes.join("</div><div>");
	s = "<div>"+s+"</div>";
};


