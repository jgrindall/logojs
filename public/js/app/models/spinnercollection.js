
LG.ASpinnerCollection  = Backbone.Collection.extend({
	initialize:function(data){
		Backbone.Collection.prototype.initialize.call(this, data);
		this.listenTo(this, "sync error", $.proxy(this.onLoaded, this));
	},
	onLoaded:function(){
		setTimeout(function(){
			LG.spinnerModel.set({"show":false});
		}, 1000);
	},
	fetch:function(data){
		LG.spinnerModel.set({"show":true});
		Backbone.Collection.prototype.fetch.call(this, data);
	}
});

