

LG.ASelectedFileCollection = LG.APaginatedCollection.extend({
	initialize:function(){
		LG.APaginatedCollection.prototype.initialize.call(this);
		this.addNewModel();
	},
	addNewModel:function(options){
		if(options && options.force){
			this.remove(this.selected);
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new this.model({"dirty":false});
		}
		this.add(this.selected);
	},
	onSync:function(){
		LG.APaginatedCollection.prototype.onSync.call(this);
		this.addNewModel();
	}
});

