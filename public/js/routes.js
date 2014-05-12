// extends Backbone.Router

// only 4 pages at the moment

LG.Router = Backbone.Router.extend({
	
    routes:{
		""											:	"write",
		"write"										:	"write",
		"writebar"									:	"writebar",
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
		LG.EventDispatcher.trigger(LG.Events.HIDE_CONTEXT_BUTTONS);
		LG.layoutModel.set({"show":s});
	},
	write:function(id){
		if(id){
			LG.fileOpener.open(id);
		}
		this.show("write");
	},
	filename:function(){
		this.show("filename");
	},
	writebar:function(){
		this.show("writebar");
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
	},
	openErrorPage:function(callbacks){
		if(LG.launcher._launched){
			var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
			LG.popups.openPopup(data, callbacks);
		}
	}
});

