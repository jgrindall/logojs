// compile the templates using underscore for faster rendering

LG.Templates = function() {
	this.compiledTemplates = { };
};

LG.Templates.prototype.init = function(ids){
	var _this = this;
	$.each(ids, function(i, id){
		var html = $('#'+id).html();
		var trim = $.trim(html);
		_this.compiledTemplates[id] = _.template(trim);
	});
};

LG.Templates.prototype.getTemplate = function(id){
	return this.compiledTemplates[id];
};

LG.templates = new LG.Templates();
