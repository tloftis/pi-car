var express = require('express'),
	app = express(),
	path = require('path');

app.use('/public', express.static('public'))
app.use('/robots', express.static('robots'))

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

var server = require('http').Server(app),
	io = require('socket.io')(server),
	cIo = require('socket.io-client')('http://localhost:3001');
		
cIo.on('init', function (data) {
	console.log(data);
});

io.on('connection', function (socket) {
	socket.emit('init', 'Connected to bot server!');
	
	socket.on('keys', function (data) {
		console.log('keys', data);
		cIo.emit('keys', data);
	});
});

server.listen(3000, function () {
	console.log('Robot API on port 3000')
});
