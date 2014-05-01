// simple utility to check browser
// --------------------------


LG.BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)	|| this.searchVersion(navigator.appVersion)	|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		this.ie9 = (this.browser==="Explorer" && this.version<=9);
		this.ie8 = (this.browser==="Explorer" && this.version<=8);
		this.chrome = (this.browser==="Chrome");
		this.safari = (this.browser==="Safari");
		this.firefox = (this.browser==="Firefox");
		this.opera = (this.browser==="Opera");
		this.mp4first = !(this.firefox || this.opera);
		this.useVideoImage = !(this.firefox || this.opera);
	},
	searchString: function (data) {
		var i, dataString, dataProp;
		for ( i=0;i<data.length;i++)	{
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1){
					return data[i].identity;
				}
			}
			else if (dataProp){
				return data[i].identity;
			}
		}
		return null;
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) {
			return null;
		}
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{	
			// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.userAgent,
			subString: "iPhone",
			identity: "iPhone/iPod/iPad"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};



if(LG.Config.IS_TOUCH){
	$(document).bind("touchmove",function(e) {
		e.preventDefault();
	});
}

$.ajaxSetup({
	// always go here if we get a 404 on the backend
	statusCode: {
		404: function(){
			
		}
	},
	cache:false
});


LG.BrowserDetect.init();




