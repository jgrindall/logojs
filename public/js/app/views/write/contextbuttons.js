
// extends LG.AbstractPageView

LG.ContextButtonsView = Backbone.View.extend({
	template:"tpl_contextbuttons",
	
	initialize:function(){
		this.listenTo(LG.EventDispatcher, LG.Events.SHOW_CONTEXT_BUTTONS, $.proxy(this.show, this));
		this.listenTo(LG.EventDispatcher, LG.Events.HIDE_CONTEXT_BUTTONS, $.proxy(this.hide, this));
		this.render();
	},
	render:function(){
		this.loadTemplate(  this.template, { }, {replace:true}  );
		this.addButtons();
		return this;
	},
	addButtons:function(){
		var i, s, data;
		for(i = 0;i<= LG.ContextButtonsView.BUTTONS.length - 1;i++){
			data = LG.ContextButtonsView.BUTTONS[i];
			s = "<button data-id='"+i+"' class='button transparent context'>"+data.label+"</button>";
			this.$el.append(s);
		}
	},
	show:function(){
		this.$el.addClass("show");
	},
	hide:function(){
		this.$el.removeClass("show");
	},
	select:function(e){
		this.stopProp(e);
		var id, data;
		id = $(e.target).data("id");
		id = parseInt(id, 10);
		if(!isNaN(id)){
			data = LG.ContextButtonsView.BUTTONS[id];
			LG.EventDispatcher.trigger(LG.Events.INSERT, data);
		}
	},
	events:function(){
		var obj = Backbone.View.getTouch( {
			"mousedown button":"select"
		} );
		return obj;
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
});


LG.ContextButtonsView.BUTTONS = [{"text":"fd();", "move":3, "label":"fd"}, {"text":"rt();", "move":3, "label":"rt"}];
