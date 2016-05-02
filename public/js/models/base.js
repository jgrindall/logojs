// base view and utility methods

Backbone.Model.prototype.output = function(){
	// pretty printing!
	return JSON.stringify( this.toJSON(), null, "\t" );
};


//extends Backbone.Model

LG.ButtonModel = Backbone.Model.extend({
	// simple button model with one parameter
	defaults:{
		disabled:false,
		show:true
	}
});


Backbone.Collection.prototype.getByProperty = function(propName, propVal){
	var selectedModel = null;
	this.each( function(model){
		if(model.get(propName) == propVal){
			selectedModel = model;
		}
	});
	return selectedModel;
};
