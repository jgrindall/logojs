
LG.WriteView = LG.AMenuView.extend({
	
	initialize:function(){
		var _this = this;
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
	showErrorRow:function(msg, offset){
		var i = 0, n = 0;
		var info = LG.WriteView.getLogoInfo(this.getLogo());
		for(i = 0; i <= info.blocks.length - 1;i++){
			n += info.blocks[i].length;
			if(n >= offset){
				break;
			}
		}
		if(i >= 1){
			i -= 1;
		}
		var row = this.$("#logodiv").children()[i];
		$(row).css("background", "pink");
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
		this.$("#logodiv").html(s);
	},
	getLogo:function(){
		var l = this.$("#logodiv").html();
		return l;
	},
	changedText:function(e){
		return;
		if(e.which === 186 || e.which === 13 || e.which === 32){
			LG.fileCollection.selected.set({"logo":this.getLogo()});
		}
		else{
			this.changedTextDeBounce();
		}
	},
	clickMe:function(e){
		alert("click me");
		this.stopProp(e);
		var c = this.$("#logodiv").children();
		_.each(c, function(row, index){
			$(row).css("background", "transparent");
		});
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_keyup":"changedText",
			"click":"clickMe"
		} );
		return {};
	}
});


LG.WriteView.getLogoInfo = function(html){
	console.log("html is "+html);
	var $a = $("<div>"+html+"</div>");
	var info = {"blocks":[ ]}, spacedString = "";
	spacedString = html.split("<")[0];
	info.blocks.push(  {"type":"block", "length":spacedString.length, "text":spacedString}  );
	var c = $a.children("div");
	c.each(function(){
		var inside = $(this).text();
		info.blocks.push({"type":"block", "length":inside.length, "text":inside});
		spacedString += (inside + "\n");
	});
	info.spacedString = spacedString;
	return info;
	
};
