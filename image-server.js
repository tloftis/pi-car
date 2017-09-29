var express = require('express'),
	app = express(),
	path = require('path'),
	server = require('http').Server(app);
	
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/test-image.JPG'));
});

server.listen(8081, function () {
	console.log('Image server on port 8081');
});