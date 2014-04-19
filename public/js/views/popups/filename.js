

// generic alert message box with ok button

// extends LG.APopUpView

LG.FileNameView = LG.APopUpView.extend({
	showName:"filename",
	initialize:function(){
		LG.APopUpView.prototype.initialize.call(this);
		this.events = this.extendEvents(LG.APopUpView, this.events);
		this.render();
	},
	
	template:"tpl_filename",
	
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click a#cancelbutton":"clickCancel",
			"_click a#okbutton":"clickOk"
		});
		return obj;
	},
	onShow:function(){
		this.$("p.error").text("");
		$("input#filenametext").val("");
	},
	render:function(){
		this.loadTemplate(  this.template, {"error":""} , {replace:true} );
		return this;
	},
	getName:function(){
		return this.$("input#filenametext").val();
	},
	clickOk:function(e){
		this.stopProp(e);
		var name, options;
		name = this.getName();
		options = {
			"success":function(){
				
			},
			"error":function(){
				
			}
		};
		if(LG.fileCollection.nameOk(name)){
			LG.fileCollection.saveFileAs(name, options);
			LG.router.navigate("write", {"trigger":true});
		}
		else{
			this.$("p.error").text("That name is taken, please choose another name");
		}
	},
	clickCancel:function(e){
		this.stopProp(e);
		LG.router.navigate("write", {"trigger":true});
	}
});



