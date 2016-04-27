var express, app, port, exec, fs, mkdirp, mongoose, nodemailer, smtpTransport;
var File, FileSchema, saveImage, mongoUri, maxFiles, minFiles, activate, AWS, s3Explorer;

express = require("express");
app = express();
port = Number(process.env.PORT || 5000);
var bodyParser = require('body-parser');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser());
app.get('/', function(req, res){
	res.render("index.jade");
});

app.listen(port, function(){
  console.log("Listening on " + port);
});







