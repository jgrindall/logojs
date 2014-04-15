// extends Backbone.Model
// models a video
LG.Video = Backbone.Model.extend({
	sync:function(){
	
	}
});


// extends Backbone.Collection
// a list of videos
LG.VideoList = Backbone.Collection.extend({
	model: LG.Video,
	sync:function(){
	
	}
});


// Static method to get secure URL (Amazon S3) from server
LG.Video.getSecureURL = function(options){
	var data = {"videoName":options.videodata.path};
	var sessionid = LG.user.get("sessionid");
	var prassoid = LG.catalogue.get("prassoid");
	var treeid = LG.catalogue.get("treeid");
	if(sessionid){
		data.sessionId = sessionid;
	}
	var isFree = LG.catalogue.getTitle(prassoid, treeid).free;
	if(isFree){
		options.success({"status":"true", "mp4VideoUrl":LG.urls.getVideoS3(data.videoName+".mp4"), "webmVideoUrl":LG.urls.getVideoS3(data.videoName+".webm")});
		return;
	}
	else{
		// send the videopath (eg sec1/vl185areaofcircle/vl185areaofcircle2) and the sessionid.
		$.ajax({
			url: LG.urls.getURL("Authenticate","getVideo"),
			data: data,
			timeout:LG.Config.AJAX_TIMEOUT,
			error:function(){
				LG.EventDispatcher.trigger(LG.Events.HIDE_SMALL_SPINNER );
				LG.router.navigate("error", {trigger:true});
			},
			success: function(data){
				data.mp4VideoUrl = decodeURIComponent(data.mp4VideoUrl);
				data.webmVideoUrl = decodeURIComponent(data.webmVideoUrl);
				options.success(data);
			},
			statusCode: {
				404: function() {
					LG.router.navigate("error", {trigger:true});
				}
			},
			dataType: "json"
		});
	}
};

