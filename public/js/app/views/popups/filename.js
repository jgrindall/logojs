

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
		var name = this.getName(), options, error;
		error = LG.fileCollection.nameOk(name);
		if(error){
			this.$("p.error").text(error);
		}
		else{
			options = {
				"success":function(id){
					LG.router.navigate("write/"+id, {"trigger":true});
					LG.Utils.growl("File saved");
				},
				"error":function(){
					
				}
			};
			LG.fileCollection.saveFileAs(name, options);
		}
	},
	clickCancel:function(e){
		this.stopProp(e);
		window.history.back();
	}
});



