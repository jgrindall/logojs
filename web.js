var express, app, port, exec, fs, mkdirp, mongoose, File, FileSchema;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
fs = require('fs');
mkdirp = require('mkdirp');
mongoose = require('mongoose');

var saveImage = function(id, base64, options){
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

FileSchema = new mongoose.Schema({
	"name"		:	{"type":String},
	"userId"	:	{"type":String},
	"logo"		:	{"type":String},
	"active"	:	{"type":Boolean}
});

File = mongoose.model("File", FileSchema);

app.configure(function(){
	app.use(express.static(__dirname+"/public"));
	app.use(express.bodyParser());
	mongoose.connect("mongodb://localhost/logotacular");
});

app.get('/', function(req, res){
	res.render("index.jade");
});

app.get('/files', function(req, res){
	var perPage, numPages, query = {"active":true}, userId;
	perPage = req.param("perPage", 24);
	numPages = req.param("numPages", 1);
	userId = req.param("userId", null);
	if(userId){
		query.userId = userId;
	}
	File.count(function(err, count){
		if(err){
			res.send(400);
			return;
		}
		else{
			console.log("query is "+JSON.stringify(query));
			File.find(query).skip(0).limit(perPage * numPages).exec(function(err, doc){
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
	var _id, logo, img, base64, defaultImage;
	_id = req.params._id;
	File.update({"_id":_id}, {"active":false}, function(err, doc){
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
	var _id, logo, img, base64, defaultImage;
	defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
	_id = req.params._id;
	logo = req.param("logo", "fd100");
	img = req.param("img", defaultImage);
	base64 = img.replace(/^data:image\/png;base64,/,"");
	console.log("updating "+_id+" with "+logo);
	File.update({"_id":_id, "active":true}, {"logo":logo}, function(err, doc){
		if(err){
			console.log('make file error: ' + err);
			res.send(400);
			return;
		}
		else if(doc){
			saveImage(_id, base64, {
				"success":function(){
					console.log("ok! put");
					res.send(200);
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
	var name, userId, logo, img, base64, defaultImage, model;
	defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
	name = req.param("name", "John");
	userId = req.param("userId", "1234");
	logo = req.param("logo", "fd100");
	img = req.param("img", defaultImage);
	base64 = img.replace(/^data:image\/png;base64,/,"");
	model = {"name": name, "userId": userId, "logo":logo, "active":true};
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

app.listen(port, function(){
  console.log("Listening on " + port);
});




  

