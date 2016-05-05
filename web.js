var express, app, port, exec, mongoose, File, FileSchema, mongoUri, auth, bodyParser;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
exec = require('child_process').exec;
bodyParser = require('body-parser');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var path = require('path');
var mime = require('mime');
var fs = require('fs');
app.get('/', function(req, res){
	res.render("app.jade");
});

app.get('/download', function(req, res){
  var files = ['about', 'tutorial', 'reference'];
  var file = __dirname + '/public/upload-folder/' + files[parseInt(req.query.i, 10)] + '.pdf';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

app.listen(port, function(){
  console.log("Listening on " + port);
});


