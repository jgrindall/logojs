var express, app, port, exec, mongoose, File, FileSchema, mongoUri, auth, bodyParser;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
mongoose = require('mongoose');
bodyParser = require('body-parser');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

auth = express.basicAuth('logoUserName', 'logoPassword');
var DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
var MAX_FILES = 500;

mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/logotacular';

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
	mongoose.connect(mongoUri);
});

app.get('/', function(req, res){
	res.render("app.jade");
});

app.get('/app', function(req, res){
	res.render("app.jade");
});

app.get('/admin', auth, function(req, res){
	res.render("admin.jade");
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

app.get('/list', auth, function(req, res){
	File.find().exec(function(err, doc){
		if(err){
			res.send(400);
			return;
		}
		else{
			var response = { "success":true };	
			response.files = doc;
			res.send(response);
			return;
		}
	});		
});


app.post('/activate', function(req, res){
	var _id = req.param("_id", null);
	var activate = req.param("activate", false);
	File.update({"_id":_id}, {"active":activate}, function(err, doc){
		if(err){
			console.log('activate file error: ' + err);
			res.send(400);
			return;
		}
		else if(doc){
			console.log("ok! activated set to "+activate + " for " + doc);
			res.send({"success":"true"});
		}
		else{
			res.send(400);
			return;
		}
	});
});

app.del('/delete', function(req, res){
	var _id = req.param("_id", null);
	console.log("deleting "+_id);
	File.findById(_id, function (err, file) {
    	file.remove(function (err) {
      		if (err) {
        		console.log("error removing");
        		res.send(400);
				return;
      		} 
      		else {
        		res.send({"success":"true"});
      		}
    	});
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
			console.log("ok! put");
			res.send({"success":true});
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
	model = {"name": name, "userId": userId, "logo":logo, "active":true, "img":img, "dino":dino, "modified":new Date()};
	console.log('make file model: ' + JSON.stringify(model));
	new File(model).save(function(err, doc){
		if(err){
			console.log('make file error: ' + err);
			res.send(400);
			return;
		}
		else{
			console.log("ok! posted");
			res.send({"_id":doc.id});
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

  

