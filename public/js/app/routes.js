// extends Backbone.Router

// only 4 pages at the moment

LG.Router = Backbone.Router.extend({
	
    routes:{
		""											:	"empty",
		"write"										:	"write",
		"writebar"									:	"writebar",
		"write/:id"									:	"write",
		"gallery"									:	"gallery",
		"load"										:	"load",
		"filename"									:	"filename",
		"alert"										:	"alert",
		"help"										:	"help",
		"menu"										:	"menu",
		"helpoverlay"								:	"helpoverlay",
		"examples"									:	"examples"
    },
	initialize:function () {
		
    },
    empty:function(){
    	console.log("empty");
    },
	show:function(s){
		console.log("show "+s);
		if( s != "alert"){
			LG.popups.closePopup();
		}
		if(s != LG.layoutModel.get("show")){
			LG.layoutModel.set({"show":s});
		}
	},
	write:function(id){
		if(id){
			LG.fileOpener.open(id);
		}
		LG.Utils.writeGrowl();
		this.show("write");
	},
	examples:function(){
		this.show("examples");
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
	helpoverlay:function(){
		this.show("helpoverlay");
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
	alertOk:function(){
		LG.router.navigate("menu", {"trigger":true});
	},
	openErrorPage:function(callbacks){
		if(LG.launcher._launched){
			console.log("1 a");
			var data = {"message":LG.Messages.ERROR, "body":LG.Messages.ERROR_BODY, "cancelColor":1, "cancelLabel":"Ok"};
			LG.popups.openPopup(data, {"ok":$.proxy(this.alertOk, this), "cancel":$.proxy(this.alertOk, this) });
		}
	}
});

