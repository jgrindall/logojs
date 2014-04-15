var express, app, port, exec, fs, mkdirp, mongoose, File, FileSchema;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
fs = require('fs');
mkdirp = require('mkdirp');
mongoose = require('mongoose');


FileSchema = new mongoose.Schema({
	"name"		:	{"type":String},
	"userid"	:	{"type":String},
	"logo"		:	{"type":String}
});

File = mongoose.model("File", FileSchema);

app.configure(function(){
	app.use(express.static(__dirname+"/public"));
	mongoose.connect("mongodb://localhost/logotacular");
});

app.get('/', function(req, res){
	res.render("index.jade");
});

app.get('/files', function(req, res){
	var perPage = req.param("perPage", 24);
	var numPages = req.param("numPages", 1);
	File.count(function(err, count){
		if(err){
			res.send({"success":false});
			return;
		}
		else{
			File.find({}).skip(0).limit(perPage * numPages).exec(function(err, doc){
				if(err){
					res.send({"success":false});
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

app.post('/files', function(req, res){
	var defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAA5JREFUKFNjYBgFpIcAAAE2AAE4SGHYAAAAAElFTkSuQmCC";
	var name = req.param("name", "John");
	var userId = req.param("userId", "1234");
	var logo = req.param("logo", "fd100");
	var img = req.param("img", defaultImage);
	var base64 = img.replace(/^data:image\/png;base64,/,"");
	
	new File({"name": name, "userId": userId, "logo":logo}).save(function(err, doc){
		if(err){
			res.send({"success":false});
			return;
		}
		else{
			mkdirp('./public/thumbs', function(err) { 
				if(err){
					console.log('makeThumbs error: ' + error);
				}
				else{
					fs.writeFile("./public/thumbs/thumb_"+doc.id+".png", base64, 'base64', function(err) {
						if(err){
							console.log(err);
							return;
						}
						else{
							res.send({"success":true, "id":doc.id});
							return;
						}
					});
				}
			});
		}
	});
});

app.listen(port, function(){
  console.log("Listening on " + port);
});



  

