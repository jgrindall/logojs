

LG.ASelectedFileCollection = LG.APaginatedCollection.extend({
	initialize:function(){
		LG.APaginatedCollection.prototype.initialize.call(this);
		this.addNewModel();
	},
	addNewModel:function(options){
		//LG.Utils.log("addnew");
		if(options && options.force){
			if(this.selected.isNew()){
				this.remove(this.selected);
			}
			this.selected = null;
		}
		if(!this.selected){
			this.selected = new this.model({"dirty":false});
		}
		this.add(this.selected);
		//LG.Utils.log("added "+this.length);
	},
	onLoaded:function(){
		LG.APaginatedCollection.prototype.onLoaded.call(this);
		this.addNewModel();
	}
});

