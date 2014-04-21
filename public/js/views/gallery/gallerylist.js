
LG.GalleryListView = Backbone.View.extend({
	
	initialize:function(options){
		this.pages = [ ];
		this.collection = options.collection
		this.showName = options.showName;
		this.perPage = LG.GalleryListView.NUMY;
		this.scrollPos = 0;
	},
	template:"tpl_gallerylist",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_click .galleryrow":"clickItem"
		});
		return obj;
	},
	removeAllPages:function(){
		_.each(this.pages, function(page, key){
			page.close();
		});
		this.pages = [ ];
	},
	alertOk:function(){
		LG.fileCollection.save();
	},
	alertNo:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	alertCancel:function(){
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	openFile:function(){
		alert("open file");
		LG.router.navigate("write/"+this.idToOpen, {"trigger":true});
	},
	modelSynced:function(){
		alert("modelSynced");
		this.stopListening(LG.fileCollection, "sync");
		this.openFile();
	},
	tryOpenFile:function(){
		var options;
		if(LG.userModel.isConnected()){
			if(!LG.fileCollection.selected.isSaved()){
				options = {"ok":$.proxy(this.alertOk, this), "no":$.proxy(this.alertNo, this), "cancel":$.proxy(this.alertCancel, this) };
				LG.popups.openPopup({"message":LG.Config.WANT_TO_SAVE,  "okColor":1, "noColor":2, "okLabel":"Yes", "noLabel":"No"}, options);
				this.listenTo(LG.fileCollection, "sync", $.proxy(this.modelSynced, this));
			}
			else{
				this.openFile();
			}
		}
		else{
			this.openFile();
		}
	},
	clickItem:function(e){
		this.stopProp(e);
		this.idToOpen = $(e.currentTarget).data("id");
		this.tryOpenFile();
	},
	addFiles:function(){
		var _this = this, i, page, numPages, models, pageModels, startIndex;
		models = this.collection.filter(function(model){
			return !model.isNew();
		});
		numPages = Math.ceil(models.length / this.perPage);
		this.removeAllPages();
		this.pages = [ ];
		for(i = 0; i <= numPages - 1; i++){
			startIndex = i * LG.GalleryListView.NUMY;
			pageModels = models.slice(startIndex, startIndex + LG.GalleryListView.NUMY);
			page = new LG.GalleryPageView({"pageModels":pageModels});
			_this.scroller.append(page.render().$el);
			_this.pages.push(page);
		}
		this.initScroll();
		this.updateLayout();
		this.goBack();
		this.status();
	},
	status:function(){
		var d = "none";
		if(this.pages.length === 0){
			d = "block";	
		}
		this.$(".nonefound").css("display", d);
	},
	goBack:function(){
		if(this.myScroll){
			this.myScroll.scrollTo(-this.scrollPos, 0);
		}
	},
	onShow:function(){
		this.listenTo(this.collection, "add sync", _.debounce($.proxy(this.addFiles, this)), 500);
		this.collection.load();
	},
	onHide:function(){
		this.stopListening(this.collection);
		this.removeAllPages();
		this.removeScroll();
	},
	render:function(){
		this.loadTemplate(  this.template, {"showName":this.showName} , {replace:true} );
		this.scroller = this.$("#listscroller"+this.showName);
		this.wrapper = this.$("#listwrapper"+this.showName);
		return this;
	},
	beforeClose:function(){
		this.removeAllPages();
		this.removeScroll();
	},
	removeScroll:function(){
		if(this.myScroll){
			this.myScroll.destroy();
		}
		this.myScroll = null;
	},
	updateLayout : function() {
		var numPages, wrapperWidth, wrapperHeight, pageWidth;
		if(this.wrapper && this.scroller && this.myScroll){
			numPages = Math.ceil(this.collection.length / this.perPage);
			wrapperWidth = this.wrapper.width();
			wrapperHeight = this.wrapper.height();
			pageWidth = wrapperWidth / 4;
			this.$(".gallerypage").width(pageWidth);
			this.scroller.width(numPages * pageWidth);
			this.myScroll.refresh();
		}
	},
	scrollEnd:function(){
		var wrapperWidth = this.wrapper.width(), w, p;
		this.scrollPos = -1 * this.scroller.offset().left;
		w = this.scroller.width();
		p = (this.scrollPos + wrapperWidth) * 100 / w;
		if(p === 100){
			this.collection.nextPage();
		}
	},
	initScroll:function(){
		if(this.myScroll){
			this.removeScroll();
		}
		if(this.$(".gallerypage").length >= 1){
			this.myScroll = new IScroll("#listwrapper"+this.showName, {"scrollbars":true, "snap":".gallerypage", "scrollX":true, "scrollY":false, "interactiveScrollbars":true, "momentum":false});
			this.myScroll.on("scrollEnd", $.proxy(this.scrollEnd, this));
		}
	}
});

LG.GalleryListView.NUMX = 4;
LG.GalleryListView.NUMY = 3;


LG.GalleryPageView = Backbone.View.extend({
	initialize:function(data){
		this.pageModels = data.pageModels;
		this.elts = [ ];
	},
	template:"tpl_gallerypage",
	removeAll:function(){
		_.each(this.elts, function(elt, key){
			elt.close();
		});
		this.elts = [ ];
	},
	addFiles:function(){
		var _this = this, docFragm;
		this.removeAll();
		this.elts = [ ];
		docFragm = document.createDocumentFragment();
		_.each(this.pageModels, function(model, i){
			var elt = new LG.GalleryRowView(model);
			docFragm.appendChild(elt.render().el);
			_this.elts.push(elt);
		});
		this.$el.append(docFragm);
	},
	render:function(){
		this.loadTemplate(  this.template, {"showName":this.showName} , {replace:true} );
		this.addFiles();
		return this;
	},
	beforeClose:function(){
		this.removeAll();
	}
});


