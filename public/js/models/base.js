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

		