LG.Popups = function(){

};

LG.Popups.prototype.openPopup = function(data, callbacks){
	var _this = this, defaultData = {"message":"", "body":"", "okLabel":null, "noLabel":null, "cancelLabel":"Cancel"};
	callbacks = callbacks || {};
	data = _.extend(defaultData, data);
	this.alertView = new LG.AlertView(data);
	$("#activity").append(this.alertView.render().el);
	LG.router.navigate("alert", {"trigger":true});
	console.log("open " + JSON.stringify(data) + "   "+JSON.stringify(callbacks));
	LG.EventDispatcher.on(LG.Events.ALERT_OK, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_OK);
		if(_.isFunction(callbacks.ok)){
			callbacks.ok();
		}
	});
	
	LG.EventDispatcher.on(LG.Events.ALERT_CANCEL, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_CANCEL);
		if(_.isFunction(callbacks.cancel)){
			callbacks.cancel();
		}
	});
	LG.EventDispatcher.on(LG.Events.ALERT_NO, function(){
		LG.EventDispatcher.off(LG.Events.ALERT_NO);
		if(_.isFunction(callbacks.no)){
			callbacks.no();
		}
	});
};

LG.Popups.prototype.closePopup = function(){
	if(this.alertView){
		this.alertView.close();
		this.alertView = null;
		LG.EventDispatcher.off(LG.Events.ALERT_OK);
		LG.EventDispatcher.off(LG.Events.ALERT_CANCEL);
		LG.EventDispatcher.off(LG.Events.ALERT_NO);
	}
};

LG.popups = new LG.Popups();

LG.APopUpView = LG.AMenuView.extend({
	initialize:function(){
		LG.AMenuView.prototype.initialize.call(this);
	},
	events:function(){
		var obj ;
		if(LG.Config.IS_TOUCH){
			obj = {
				"keypress input":"onKeyPress"
			};
		}
		else{
			obj = {
				"click input":"stopProp",
				"click .popupcontents":"clickCancel",
				"keypress input":"onKeyPress"
			};
		}
		return obj;
	},
	clickCancel:function(e){
		this.stopProp(e);
		window.history.back();
	},
	onKeyPress:function(e){
		if(e.which === 13){
			this.onEnterPress();
		}
	}
});
