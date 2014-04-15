var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');

app.configure(function(){
	app.set("view engine", "jade");
	app.use(express.static(__dirname+"/public"));
});

app.get('/', function(req, res) {
	res.render("index");
});

app.listen(port, function() {
  console.log("Listening on " + port);
});



  

