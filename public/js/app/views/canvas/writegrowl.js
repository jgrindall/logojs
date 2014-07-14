
// extends LG.AbstractPageView

LG.WriteGrowlView = Backbone.View.extend({
	template:"tpl_writegrowl",
	
	initialize:function(){
		this.render();
		this.listenTo(LG.EventDispatcher, LG.Events.WRITE_GROWL, $.proxy(this.show, this));
	},
	render:function(){
		this.loadTemplate(  this.template, {"message":LG.Messages.WRITE}, {replace:true}  );
		return this;
	},
	show:function(){
		var now = (new Date()).getTime(), _this = this, diff;
		diff = now - LG.WriteGrowlView.writeTimeStamp; 
		if(diff > 20000 || (diff > 5000 && LG.WriteGrowlView.writeNum <= 3)){
			this.$el.addClass("show");
			setTimeout(function(){
				_this.$el.removeClass("show");
			}, 5000);
			LG.WriteGrowlView.writeNum++;
		}
		LG.WriteGrowlView.writeTimeStamp = now;
	},
	events:function(){
		
	},
	beforeClose:function(){
		
	},
	afterAdded:function(){
		
	}
	
});

LG.WriteGrowlView.writeTimeStamp = (new Date()).getTime();
LG.WriteGrowlView.writeNum = 0;

	
	
