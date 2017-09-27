var express = require('express'),
	app = express(),
	path = require('path');

app.use('/public', express.static('public'))

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

var server = require('http').Server(app),
	io = require('socket.io')(server),
	cIo = require('socket.io-client')('http://localhost:3001');
		
cIo.on('init', function (data) {
	console.log(data);
});

var sockets = [];
var controllerSocket;

function nextPerson (socket){
	if (socket) {
		controllerSocket = socket;
		
		socket.on('keys', function (data) {
			console.log('keys', data);
			cIo.emit('keys', data);
		});
	} else {
		controllerSocket = undefined;
	}
}

function setMessageAll(msg){
	sockets.forEach(socket=>{
		socket.emit('msg', msg || '');
	});
}

function updateQueue(){
	sockets.forEach((socket, index)=>{
		socket.emit('queue', ++index);
	});
}

io.on('connection', function (socket) {
	socket.emit('init', 'Connected to bot server!');
	
	socket.on('disconnect', function () {
		sockets.some((curSocket, index)=>{
			if(socket === curSocket){
				sockets.splice(index, 1);
				return true;
			}
		});
		
		if(socket === controllerSocket){
			nextPerson (sockets[0]);
		}
		
		updateQueue();
	});
	
	socket.on('message', (msg)=>{
		setMessageAll(msg);
	});
		
	sockets.push(socket);
	
	updateQueue();
	
	if(!controllerSocket){
		nextPerson(socket);
	}
});

server.listen(3000, function () {
	console.log('Robot API on port 3000')
});
