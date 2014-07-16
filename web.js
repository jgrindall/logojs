var express, app, port, exec, fs, mkdirp, mongoose, File, FileSchema, saveImage, mongoUri, AWS, s3Explorer, auth;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
fs = require('fs');
mkdirp = require('mkdirp');
mongoose = require('mongoose');
AWS = require('aws-sdk'); 
AWS.config.loadFromPath('./aws.json');
s3Explorer = new AWS.S3(); 
auth = express.basicAuth('logoUserName', 'logoPassword');
var DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
var MAX_FILES = 500;

mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/logotacular'; 

saveImage = function(id, base64, options){
	var body = new Buffer(base64, 'base64');
	var params = {
		Bucket: 'com.jgrindall.logojspgthumbs',
		Key: 'thumb_'+id+'.png',
		Body: body
	};
	s3Explorer.putObject(params, function (error, response) {
		if (error) {
			console.log("aws error "+error);
			options.error("Error uploading data: " + error);
		}
		else {
			console.log("aws ok");
			options.success();
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
	"img"		:	{"type":String},
	"active"	:	{"type":Boolean},
	"dino"		:	{"type":Number},
	"modified"	:	{"type":Date, default:Date.now},
	"views"		:	{"type":Number, default:0},
	"votes"		:	{"type":Number, default:0}
});

File = mongoose.model("File", FileSchema);

app.configure(function(){
	app.use(express.static(__dirname+"/public/build"));
	app.use(express.bodyParser());
	mongoose.connect(mongoUri);
});

app.get('/', function(req, res){
	res.render("index.jade");
});

app.get('/app', function(req, res){
	res.render("app.jade");
});

app.get('/files/:_id', auth, function(req, res){
	console.log("get "+JSON.stringify(req.params));
	var query, id;
	_id = req.params._id;
	query = {"active":true, "_id":_id},
	File.find(query).exec(function(err, doc){
		if(err || doc.length <= 0){
			res.send(400);
			return;
		}
		else{
			res.send(doc[0]);
			return;
		}
	});
});

app.get('/files', auth, function(req, res){
	console.log("get "+JSON.stringify(req.params));
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

app.delete('/files/:_id', auth, function(req, res){
	console.log("delete");
	// TO DO - check userid!
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

app.put('/files/:_id', auth, function(req, res){
	console.log("put");
	var _id, logo, img, base64, dino;
	_id = req.params._id;
	logo = req.param("logo", "");
	img = req.param("img", DEFAULT_IMAGE);
	dino = req.param("dino", 0);
	base64 = img.replace(/^data:image\/png;base64,/,"");
	console.log("updating "+_id+" with "+logo);
	File.update({"_id":_id, "active":true}, {"logo":logo, "dino":dino, "img":img, "modified":new Date()}, function(err, doc){
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

app.post('/files', auth, function(req, res){
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
	model = {"name": name, "userId": userId, "logo":logo, "active":true, "img":img, "dino":dino, "modified":new Date()};
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

var logFile = function(param, req, res){
	var _id, query, proj1 = {}, proj2 = {};
	proj1[param] = 1;
	_id = req.param("_id", null);
	if(!_id){
		res.send(200);
		return;
	}
	else{
		File.findOne({"_id":_id}, proj1).exec(function(err, doc){
			if(err){
				res.send(400);
			}
			else{
				proj2[param] = (doc.views + 1);
				File.update({"_id":_id}, proj2, function(err, doc){
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
};

app.post('/view', auth, function(req, res){
	logFile("views", req, res);
});

app.post('/vote', auth, function(req, res){
	logFile("votes", req, res);
});

app.listen(port, function(){
  console.log("Listening on " + port);
});




/*
var path = require (' path ');

module.exports = function (mongoose) {

  //we Declare the circuit for Mongoose
  var Schema = new mongoose. Schema ({
    name: {type: String, required: true}
  });

  //we Initialize model with a file name in which it is
  return mongoose.model (path.basename (module.filename.js '), Schema);
};
 
 // http://sysmagazine.com/posts/213931/
 // http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
*/

  

