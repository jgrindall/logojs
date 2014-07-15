
LG.GalleryListView = Backbone.View.extend({
	
	initialize:function(options){
		this.pages = [ ];
		this.collection = options.collection;
		this.showName = options.showName;
		this.perPage = LG.GalleryListView.NUMY;
		this.scrollPos = 0;
	},
	template:"tpl_gallerylist",
	events:function(){
		var obj = Backbone.View.getTouch( {
			"_mousedown .galleryrow":"clickItemDown",
			"_mouseup .galleryrow":"clickItemUp"
		});
		return obj;
	},
	removeAllPages:function(){
		_.each(this.pages, function(page, key){
			page.close();
		});
		this.pages = [ ];
	},
	clickItemDown:function(e){
		//this.stopProp(e);
		this.time = (new Date()).getTime();
		console.log("click down "+this.scrolling+"  "+this.time);
	},
	clickItemUp:function(e){
		//this.stopProp(e);
		var timeNow, diff;
		timeNow = (new Date()).getTime();
		diff = (timeNow - this.time);
		console.log("click up "+diff);
		if(diff < 120){
			LG.sounds.playClick();
			var idToOpen = $(e.currentTarget).data("id");
			this.myScroll.scrollTo(0, 0);
			this.trigger(LG.Events.PREVIEW_FILE, idToOpen);
		}
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
		this.listenTo(this.collection, "add sync reset", _.debounce($.proxy(this.addFiles, this)), 500);
		this.collection.load({
			"error":function(){
				LG.router.openErrorPage({"cancel":function(){
					LG.router.navigate("write", {"trigger":true});
				}});
			},
			"success":function(){
				
			}
		});
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
			pageWidth = wrapperWidth / LG.GalleryListView.NUMX;
			this.$(".gallerypage").width(pageWidth);
			this.scroller.width(numPages * pageWidth);
			this.myScroll.refresh();
		}
	},
	scrollStart:function(){
		console.log("start");
	},
	scrollEnd:function(){
		var wrapperWidth = this.wrapper.width(), w, p, _this = this;
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
			this.myScroll = new IScroll("#listwrapper"+this.showName, {"scrollbars":true, "snap":".gallerypage", "scrollX":true, "scrollY":false, "interactiveScrollbars":true, "momentum":true});
			this.myScroll.on("scrollEnd", $.proxy(this.scrollEnd, this));
			this.myScroll.on("scrollStart", $.proxy(this.scrollStart, this));
		}
	}
});

LG.GalleryListView.NUMX = 3;
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


