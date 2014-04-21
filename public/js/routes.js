// extends Backbone.Router

// only 4 pages at the moment

LG.Router = Backbone.Router.extend({
	
    routes:{
		""											:	"write",
		"write"										:	"write",
		"write/:id"									:	"write",
		"gallery"									:	"gallery",
		"load"										:	"load",
		"filename"									:	"filename",
		"alert"										:	"alert",
		"help"										:	"help",
		"menu"										:	"menu"
    },
	initialize:function () {
		
    },
	show:function(s){
		if( s != "alert"){
			LG.popups.closePopup();
		}
		LG.layoutModel.set({"show":s});
	},
	write:function(id){
		console.log("file "+id);
		if(id){
			LG.allFilesCollection.loadById(id);
		}
		this.show("write");
	},
	filename:function(){
		this.show("filename");
	},
	load:function(){
		this.show("load");
	},
	help:function(){
		this.show("help");
	},
	menu:function(){
		this.show("menu");
	},
	alert:function(){
		this.show("alert");
	},
	gallery:function(){
		this.show("gallery");
	}
});

