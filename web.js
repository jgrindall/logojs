var express, app, port, exec, fs, mkdirp, mongoose, File, FileSchema, saveImage, mongoUri;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
fs = require('fs');
mkdirp = require('mkdirp');
mongoose = require('mongoose');

var DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
var MAX_FILES = 500;

mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/logotacular'; 

console.log(mongoUri);

saveImage = function(id, base64, options){
	mkdirp('./public/thumbs', function(err) { 
		if(err){
			console.log('makeThumbs error: ' + err);
			options.error(err);
			return;
		}
		else{
			fs.writeFile("./public/thumbs/thumb_"+id+".png", base64, 'base64', function(err) {
				if(err){
					console.log("writeFile "+err);
					options.error(err);
					return;
				}
				else{
					options.success();
					return;
				}
			});
		}
	});
};

var countAllFiles = function(options){
	File.count(function(err, count){
		if(err){
			console.log("err "+err);
			options.fail();
		}
		else{
			options.success(count);
		}
	});
};

FileSchema = new mongoose.Schema({
	"name"		:	{"type":String},
	"userId"	:	{"type":String},
	"logo"		:	{"type":String},
	"active"	:	{"type":Boolean},
	"dino"		:	{"type":Number},
	"modified"	:	{"type":Date, default:Date.now},
	"views"		:	{"type":Number, default:0}
});

File = mongoose.model("File", FileSchema);

app.configure(function(){
	app.use(express.static(__dirname+"/public"));
	app.use(express.bodyParser());
	mongoose.connect(mongoUri);
});

app.get('/', function(req, res){
	res.render("index.jade");
});

app.get('/files', function(req, res){
	var perPage, numPages, query = {"active":true}, userId, sort;
	perPage = req.param("perPage", 24);
	numPages = req.param("numPages", 1);
	userId = req.param("userId", null);
	sort = {"views":-1};
	if(userId){
		query.userId = userId;
		sort = {"modified":-1};
	}
	countAllFiles({
		"fail":function(err){
			res.send(400);
		},
		"success":function(count){
			File.find(query).skip(0).limit(Math.min(perPage * numPages, MAX_FILES)).sort(sort).exec(function(err, doc){
				if(err){
					res.send(400);
					return;
				}
				else{
					var response = {"numPages":numPages, "maxPage":Math.ceil(count/perPage) };	
					response.files = doc;
					res.send(response);
					return;
				}
			});
		}
	});
});

app.delete('/files/:_id', function(req, res){
	console.log("delete");
	var _id, logo, img, base64, date;
	_id = req.params._id;
	File.update({"_id":_id}, {"active":false, "modified":new Date()}, function(err, doc){
		if(err){
			console.log('delete file error: ' + err);
			res.send(400);
			return;
		}
		else{
			console.log("ok! deleted");
			res.send({"success":"true"});
		}
	});
});

app.put('/files/:_id', function(req, res){
	console.log("put");
	var _id, logo, img, base64, dino;
	_id = req.params._id;
	logo = req.param("logo", "");
	img = req.param("img", DEFAULT_IMAGE);
	dino = req.param("dino", 0);
	base64 = img.replace(/^data:image\/png;base64,/,"");
	console.log("updating "+_id+" with "+logo);
	File.update({"_id":_id, "active":true}, {"logo":logo, "dino":dino, "modified":new Date()}, function(err, doc){
		if(err){
			console.log('make file error: ' + err);
			res.send(400);
			return;
		}
		else if(doc){
			saveImage(_id, base64, {
				"success":function(){
					console.log("ok! put");
					res.send({"success":true});
				},
				"error":function(err){
					res.send(400);
				}
			}); 
		}
		else{
			res.send(400);
		}
	});
});

app.post('/files', function(req, res){
	console.log("posting...");
	var name, userId, logo, img, base64, model, dino;
	name = req.param("name", null);
	userId = req.param("userId", null);
	if(!name || !userId){
		res.send(400);
	}
	logo = req.param("logo", "");
	dino = req.param("dino", 0);
	img = req.param("img", DEFAULT_IMAGE);
	base64 = img.replace(/^data:image\/png;base64,/,"");
	model = {"name": name, "userId": userId, "logo":logo, "active":true, "dino":dino, "modified":new Date()};
	console.log('make file model: ' + JSON.stringify(model));
	new File(model).save(function(err, doc){
		if(err){
			console.log('make file error: ' + err);
			res.send(400);
			return;
		}
		else{
			console.log("posted with "+doc._id);
			saveImage(doc.id, base64, {
				"success":function(){
					console.log("ok! posted");
					res.send({"_id":doc.id});
				},
				"error":function(err){
					res.send(400);
				}
			}); 
		}
	});
});


app.post('/open', function(req, res){
	var _id, query, proj;
	_id = req.param("_id", null);
	if(!_id){
		res.send(200);
		return;
	}
	else{
		File.findOne({"_id":_id}, {"views":1}).exec(function(err, doc){
			if(err){
				res.send(400);
			}
			else{
				File.update({"_id":_id}, {"views": (doc.views + 1)}, function(err, doc){
					if(err){
						res.send(400);
					}
					else{
						res.send(200);
					}
				});
			}
		});
	}
});

app.listen(port, function(){
  console.log("Listening on " + port);
});




  

