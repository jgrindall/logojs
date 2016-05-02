
LG.FileSystem = function(){
	this.reader = false;
	this.reading = false;
	this.filesFolder = false;
	this.options = false;
	this.fileContents = false;
};

LG.FileSystem.prototype.deleteFile = function(model, options){
	var filename = "file_"+model.get("name")+".txt";
	this.filesFolder.getFile(filename, {create: false}, $.proxy(this.gotFileDeleteEntry, this, model, options), $.proxy(this.failFileDeleteEntry, this, options));
};

LG.FileSystem.prototype.gotFileDeleteEntry = function(model, options, fileEntry){
	fileEntry.remove($.proxy(this.onFileDeleteSuccess, this, options), $.proxy(this.onFileDeleteError, this, options));
};

LG.FileSystem.prototype.onFileDeleteSuccess = function(options){
	options.success();
};

LG.FileSystem.prototype.onFileDeleteError = function(options){
	options.error();
};

LG.FileSystem.prototype.failFileDeleteEntry = function(options, error){
	options.fail();
};

LG.FileSystem.prototype.gotFileSaveEntry = function(model, options, fileEntry){
	//LG.Utils.log("gotFileSaveEntry "+model+"  "+fileEntry+"  "+options+"  fn: "+fileEntry.createWriter);
	var success = $.proxy(this.onMakeWriterSuccess, this, model, options);
	var fail = $.proxy(this.onMakeWriterFail, this, options);
	//LG.Utils.log(success+" / "+fail);
	fileEntry.createWriter(success, fail);		
};

LG.FileSystem.prototype.failFileSaveEntry = function(options, error){
	options.fail();
};

LG.FileSystem.prototype.fetchFileSuccess = function(file){
	this.numLoaded = 1;
	this.fileReader = new FileReader();
	this.fileReader.onloadend = $.proxy(this.fileIsRead, this);
	this.fileReader.onerror = $.proxy(this.fileIsReadError, this);
	this.fileReader.readAsText(file);
};

LG.FileSystem.prototype.fetchFileFail = function(){
	this.options.fail();
};

LG.FileSystem.prototype.gotFileFetchEntry = function(model, options, fileEntry){
	this.readSuccess([fileEntry]);
};

LG.FileSystem.prototype.failFileFetchEntry = function(options, error){
	options.fail();
};

LG.FileSystem.prototype.onMakeWriterFail = function(options, error) {
	//LG.Utils.log("onMakeWriterFail");
	options.fail();
};

LG.FileSystem.prototype.onMakeWriterSuccess = function(model, options, writer) {
	//LG.Utils.log("onMakeWriterSuccess "+model+"  "+JSON.stringify(model.toJSON));
	writer.write(JSON.stringify(model.toJSON()));
    //writer.abort();
    options.success();
};

LG.FileSystem.prototype.saveFile = function(model, options){
	var filename = "file_"+model.get("name")+".txt";
	//LG.Utils.log("fs saveFile "+filename);
	this.filesFolder.getFile(filename, {create: true}, $.proxy(this.gotFileSaveEntry, this, model, options), $.proxy(this.failFileSaveEntry, this, options));
};

LG.FileSystem.prototype.fetchFile = function(model, options){
	var filename = "file_"+model.get("name")+".txt";
	this.options = options;
	this.filesFolder.getFile(filename, {create: false}, $.proxy(this.gotFileFetchEntry, this, model, options), $.proxy(this.failFileFetchEntry, this, options));
};

LG.FileSystem.prototype.readFiles = function(options){
	this.options = options;
	if(!this.filesFolder || this.reading){
		options.fail();
	}
	else{
		this.reading = true;
		this.fileReader = new FileReader();
		this.fileReader.onloadend = $.proxy(this.fileIsRead, this);
		this.fileReader.onerror = $.proxy(this.fileIsReadError, this);
		var success = $.proxy(this.readSuccess, this);
		var fail = $.proxy(this.readFail, this);
		var reader = this.filesFolder.createReader();
		reader.readEntries(success, fail);
	}
};

LG.FileSystem.prototype.fileIsRead = function(e){
	try{
		var obj = $.parseJSON(e.target.result);
		if(obj.name && obj.logo && obj.userId){
			this.fileContents[this.numLoaded] = obj;
		}
		else{
			this.fileContents[this.numLoaded] = null;
		}
    	this.readNext();
    }
    catch(e){
    	this.options.fail();
    }
};

LG.FileSystem.prototype.fileIsReadError = function(){
	this.fileContents[this.numLoaded] = null;
    this.readNext();
};

LG.FileSystem.prototype.readFileSuccess = function(file){
	this.fileReader.readAsText(file);
};

LG.FileSystem.prototype.readFileFail = function(){
	this.reading = false;
	this.options.success(this.fileContents);
};

LG.FileSystem.prototype.readNext = function() {
	this.numLoaded++;
	if(this.numLoaded == this.numToLoad){
		this.reading = false;
		this.options.success(this.fileContents);
	}
	else{
		var entry = this.entries[this.numLoaded];
		var success = $.proxy(this.readFileSuccess, this);
		var fail = $.proxy(this.readFileFail, this);
		entry.file(success, fail);
	}
};

LG.FileSystem.prototype.readSuccess = function(entries) {
	this.fileContents = [];
	this.entries = entries;
	this.numToLoad = entries.length;
	this.numLoaded = -1;
	this.readNext();
};

LG.FileSystem.prototype.readFail = function(error) {
   	this.options.fail(error);
};

LG.FileSystem.prototype.init = function(options){
	this.options = options;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, $.proxy(this.onFileSystemSuccess, this), $.proxy(this.onFileSystemFail, this));
};

LG.FileSystem.prototype.onFileSystemSuccess = function(fs){
	window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, $.proxy(this.onFileResolveSuccess, this), $.proxy(this.onFileResolveFail, this));
};

LG.FileSystem.prototype.onFileSystemFail = function(error){
	this.options.fail();
};

LG.FileSystem.prototype.onFileResolveSuccess = function(dir){
	var directoryReader = dir.createReader();
	directoryReader.readEntries($.proxy(this.readAppStorageDirSuccess, this), $.proxy(this.readAppStorageDirFail, this));
};

LG.FileSystem.prototype.onFileResolveFail = function(error){
	this.options.fail();
};

LG.FileSystem.prototype.onMakeDirectorySuccess = function(filesFolder){
	this.filesFolder = filesFolder;
	this.options.success();
};

LG.FileSystem.prototype.onMakeDirectoryFail = function(){
	this.options.fail();
};

LG.FileSystem.prototype.readAppStorageDirSuccess = function(entries) {
	var entry;
	for (var i = 0; i < entries.length; i++) {
		if(entries[i].name === "Library"){
			entry = entries[i];
			break;
		}
	}
	if(entry){
		entry.getDirectory("files", {create: true, exclusive: false}, $.proxy(this.onMakeDirectorySuccess, this), $.proxy(this.onMakeDirectoryFail, this)); 
	}
	else{
		this.options.fail();
	}
};

LG.FileSystem.prototype.readAppStorageDirFail = function(error) {
   	this.options.fail();
};

LG.fileSystem = new LG.FileSystem();

