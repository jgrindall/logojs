// compile the templates using underscore for faster rendering

LG.Templates = function(ids, callback) {
	this.ids = ids;
	this.callback = callback;
	this.compiledTemplates = {};
    
	this.init = function(){
		var _this = this;
		$.each(this.ids, function(i, id){
			var html = $('#'+id).html();
			var trim = $.trim(html);
			_this.compiledTemplates[id] = _.template(trim);
		});
		this.callback();
	};
	
    this.getTemplate = function(url) {
        return this.compiledTemplates[url];
    };
 
};



