LG.PageModel = Backbone.Model.extend({
	defaults:{
		numPages:1,
		maxPage:1
	}
});

LG.APaginatedCollection  = LG.ASpinnerCollection.extend({
	initialize:function(data){
		LG.ASpinnerCollection.prototype.initialize.call(this, data);
		this.pageModel = new LG.PageModel();
	},
	parse: function(response) {
		this.pageModel.set({"numPages":parseInt(response.numPages, 10), "maxPage":parseInt(response.maxPage, 10)});
		return response.files;
	},
	nextPage:function(){
		var c = this.pageModel.get("numPages");
		if(  (c + 1) <= this.pageModel.get("maxPage")){
			this.pageModel.set({"numPages": c + 1});
			this.load();
		}
	},
	getData:function(){
		var data = {};
		data.numPages = this.pageModel.get("numPages");
		data.perPage = LG.APaginatedCollection.PER_PAGE;
		return data;
	}
});

LG.APaginatedCollection.PER_PAGE = 24;
