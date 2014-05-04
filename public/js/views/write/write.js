
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
		this.logoDiv = this.$("#logodiv");
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
		s = this.getLogo();
		this.setLogo(s);
		okChars = s.substr(0, offset);
		i = LG.Utils.countCharsIn(okChars, '$');
		row = this.logoDiv.children()[i];
		this.error = {"show":true, "row":i};
		$(row).css("background-color", "#FFA07A");
		this.$(".error").text("Error, expected: \""+expected[0].value+"\" check your code!").addClass("show");
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
		LG.fileCollection.selected.set(data);
	},
	setLogo:function(s){
		var html = LG.WriteView.decodeToHtml(s);
		this.logoDiv.html(html);
	},
	getLogo:function(){
		var html, decoded;
		html = this.logoDiv.html();
		html = html.replace(/&nbsp;/g, "");
		html = html.replace(/<br>/g, "");
		decoded = LG.WriteView.decodeFromHtml(html);
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


