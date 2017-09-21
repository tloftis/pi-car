var express = require('express');
var app = express();
var path = require('path');

//Real
var motor = require('./Motor.js');
g = require('wiring-pi');

/*

//Emulation
var motor = require('./TestMotor.js');

var g = {
	digitalWrite: (pin, val)=>console.log('Write', pin, val),
	setup: (mode)=>console.log('GPIO MODE', mode),
	pinMode: (pin, mode)=>console.log('pinMode', pin, mode),
	OUTPUT: 'Output'
}
*/
g.setup('gpio');

var motorOne = new motor({enablePin: 5, fPin: 27, bPin: 24});
var motorTwo = new motor({enablePin: 17, fPin: 6, bPin: 22});
var gunL = new motor({enablePin: 12, fPin: 23, bPin: 16});
var gunR = new motor({enablePin: 25, fPin: 13, bPin: 18});

var rLaserPin = 4;
var lLaserPin = 14;

var gunIndPinR = 15;
var gunIndPinL = 10;

var headLedPin = 9;
var faceLedPin = 11;

g.pinMode(rLaserPin, g.OUTPUT);
g.pinMode(lLaserPin, g.OUTPUT);
g.pinMode(gunIndPinR, g.OUTPUT);
g.pinMode(gunIndPinL, g.OUTPUT);
g.pinMode(headLedPin, g.OUTPUT);
g.pinMode(faceLedPin, g.OUTPUT);

function cV(val){
	var out = 0;
	
	if(Number(val)){
		out = val;
	}
	
	return out;
}

function timerRunning(t){
	if((t || {})._onTimeout && !(t || {})._called){
		return true
	}
	
	return false
}

function rLaser(val){
	g.digitalWrite(rLaserPin, cV(val));
}

function lLaser(val){
	g.digitalWrite(lLaserPin, cV(val));
}

function rInd(val){
	g.digitalWrite(gunIndPinR, cV(val));
}

function lInd(val){
	g.digitalWrite(gunIndPinL, cV(val));
}

function head(val){
	g.digitalWrite(headLedPin, cV(val));
}

function face(val){
	g.digitalWrite(faceLedPin, cV(val));
}

function forward(val){
	motorOne.forward(cV(val));
	motorTwo.forward(cV(val));
}

function backward(val){
	motorOne.backward(cV(val));
	motorTwo.backward(cV(val));
}

function right(val){
	motorTwo.forward(cV(val));
	motorOne.backward(cV(val));
}

function left(val){
	motorOne.forward(cV(val));
	motorTwo.backward(cV(val));
}

function stop(){
	gunR.stop();
	gunL.stop();
	motorTwo.stop();
	motorOne.stop();
}

function shootR(){
	gunR.forward(1);
	setTimeout(()=>gunR.stop(), 500);
}

function shootL(){
	gunL.forward(1);
	setTimeout(()=>gunL.stop(), 500);
}

function missleR(){
	gunR.backward(1);
	setTimeout(()=>gunR.stop(), 500);
}

function missleL(){
	gunL.backward(1);
	setTimeout(()=>gunL.stop(), 500);
}

var fTimeout={},
	bTimeout={},
	rTimeout={},
	lTimeout={},
	delayTimeout = 200;

var server = require('http').Server(app),
	io = require('socket.io')(server);

var clearTs = ()=>{
	clearTimeout(bTimeout);
	clearTimeout(rTimeout);
	clearTimeout(lTimeout);
	clearTimeout(fTimeout);
};
	
io.on('connection', function (socket) {
	socket.emit('init', 'Connected to robot');
	
	socket.on('forward', function (data) {
		if(!timerRunning(fTimeout)){
			forward(data);
		}
		
		clearTs();
		fTimeout = setTimeout(()=>stop(), delayTimeout);
	});
	
	socket.on('left', function (data) {
		if(!timerRunning(lTimeout)){
			left(data);
		}
		
		clearTs();
		lTimeout = setTimeout(()=>stop(), delayTimeout);
	});
	
	socket.on('right', function (data) {
		if(!timerRunning(rTimeout)){
			right(data);
		}
		
		clearTs();
		rTimeout = setTimeout(()=>stop(), delayTimeout);
	});
	
	socket.on('backward', function (data) {
		if(!timerRunning(bTimeout)){
			backward(data);
		}
		
		clearTs();
		bTimeout = setTimeout(()=>stop(), delayTimeout);
	});
	
	socket.on('missleL', function (data) {
		missleL();
	});
	
	socket.on('missleR', function (data) {
		missleR();
	});
	
	socket.on('shootL', function (data) {
		shootL();
	});
	
	socket.on('shootR', function (data) {
		shootR(data);
	});
	
	socket.on('rLaser', function (data) {
		rLaser(data);
	});
	
	socket.on('lLaser', function (data) {
		lLaser(data);
	});
});

server.listen(3001, function () {
	console.log('Robot API on port 3001');
});
