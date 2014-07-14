

LG.AlertView = LG.APopUpView.extend({
	showName:"alert",
	initialize:function(data){
		this.data = data;
		LG.APopUpView.prototype.initialize.call(this);
		this.events = this.extendEvents(LG.APopUpView, this.events);
		this.render();
	},
	
	template:"tpl_alert",
	
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#cancelbutton":"clickCancel",
			"_click a#okbutton":"clickOk",
			"_click a#nobutton":"clickNo",
			"_click #closebutton":"clickCancel"
		});
		return obj;
	},
	render:function(){
		this.loadTemplate(  this.template, this.data , {replace:true} );
		return this;
	},
	clickOk:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_OK);
	},
	clickCancel:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_CANCEL);
	},
	clickNo:function(e){
		this.stopProp(e);
		LG.EventDispatcher.trigger(LG.Events.ALERT_NO);
	},
	onShow:function(){
		
	}
});

