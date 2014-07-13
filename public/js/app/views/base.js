// base view for all views


Backbone.View.prototype.beforeClose = function () {
	// override this in each specific view
};

Backbone.View.prototype.afterAdded = function () {
	// override this in each specific view
};

Backbone.View.getTouch = function(obj){
	// static function
	var newObj = {};
	var clickEventName, downEventName, upEventName, swipeName, keyUpName;
	if(LG.Config.IS_TOUCH){
		clickEventName = "touchstart";
		downEventName = "touchstart";
		upEventName = "touchend";
		swipeName = "swipe";
	}
	else{
		clickEventName = "click";
		downEventName = "mousedown";
		upEventName = "mouseup";
		swipeName = "swipe";
	}
	keyUpName = "keyup";
	_.each(obj, function(val, key){
		var newKey = key.replace("_click", clickEventName);
		newKey = newKey.replace("_mousedown", downEventName);
		newKey = newKey.replace("_mouseup", upEventName);
		if(swipeName){
			newKey = newKey.replace("_swipe", swipeName);
		}
		newKey = newKey.replace("_keyup", keyUpName);
		newObj[newKey] = val;
	});
	return newObj;
};

Backbone.View.prototype.extendEvents = function (superClass, events) {
	if(_.isFunction(this.events) ){
		return _.extend({}, superClass.prototype.getEvents(),this.events());
	}
	else{
		return _.extend({}, superClass.prototype.getEvents(),this.events);
	}
};
 
Backbone.View.prototype.getEvents = function () {
	// overridden in subclasses!
	if(_.isFunction(this.events) ){
		return this.events();
	}
	else{
		return this.events;
	}
};

Backbone.View.prototype.stopProp = function (e) {
	if(e){
		e.stopPropagation();
		e.preventDefault();
	}
};

Backbone.View.prototype.close = function () {
	// when we delete a view we call close() on it
	// call the beforeClose method, remove the element from the stage
	// and remove listeners
	this.beforeClose();
	this.stopListening();
	this.unbind();
	this.remove();
};

Backbone.View.prototype.output = function(){
	// pretty printing!
	return JSON.stringify(this.toJSON());
};

Backbone.View.prototype.rerender = function(){
	// render and add back at the same position in the parent.
	var parent = this.$el.parent();
	var index = this.$el.index();
	var siblings = parent.children();
	var len = siblings.length;
	var before;
	var after;
	if(len >= 2){
		if(index >= 1){
			before = siblings.eq(index-1);
		}
		if(index <= len - 2){
			after = siblings.eq(index + 1);
		}
	}
	this.$el.remove();
	this.render();
	if(before){
		before.after(this.$el);
	}
	else if(after){
		after.before(this.$el);
	}
	else{
		parent.append(this.$el);
	}
};

Backbone.View.prototype.getTemplate = function (url, data, options) {
	// get compiled template
	var compiledTemplate = LG.templates.getTemplate(url);
	if(!compiledTemplate){
		throw new Error("template "+url+" not found");
	}
	var html = "";
	try{
		html = compiledTemplate(data);
	}
	catch(e){
		throw new Error(url+" template failed "+e.message);
	}
	return html;
};

Backbone.View.prototype.loadTemplate = function (url, data, options) {
	// load template into view.  If replace then use the html itself, rather than adding it to a div
	var html = this.getTemplate(url, data, options);
	options = _.extend({replace:false}, options);  // defaults
	if(options.replace){
		this.setElement(html);  // this will rebind the events on the element
	}
	else{
		this.$el.html(html);
	}
};


// extends Backbone.View - a base class for all "this is a page" views
LG.AbstractPageView = Backbone.View.extend({
	
});



LG.Button = Backbone.View.extend({
	initialize:function(){
		this.model = new LG.ButtonModel();
		this.listenTo(this.model, "change", $.proxy(this.buttonVisChanged, this));
	},
	buttonVisChanged:function(){
		this.rerender();
	},
	getShow:function(){
		return this.model.get("show");
	},
	getDisabled:function(){
		return this.model.get("disabled");
	},
	getData:function(){
		return {};
	},
	render:function(){
		var defaultData, data;
		defaultData = { show: this.getShow(), disabled: this.getDisabled() };
		data = _.extend(defaultData, this.getData());
		//console.log(this+" button :  "+this.template+"   "+JSON.stringify(data));
		this.loadTemplate(this.template, data , {replace:true} );
		return this;
	},
	disableButton:function(data){
		this.model.set( {"disabled":data.disabled} );
	},
	showButton:function(data){
		this.model.set( {"show":data.show} );
	}
});