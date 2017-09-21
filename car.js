var express = require('express');
var app = express();
var path = require('path');

//Real
var motor = require('./Motor.js');

//Emulation
//var motor = require('./TestMotor.js');


var motorOne = new motor({enablePin: 5, bPin: 22, fPin: 27});
var motorTwo = new motor({enablePin: 5, bPin: 17, fPin: 4});

var server = require('http').Server(app),
    io = require('socket.io')(server);

var turnTimeout;

function timerRunning(t){
	if((t || {})._onTimeout && !(t || {})._called){
		return true
	}

	return false
}

var prevData = [false, false, false, false];

io.on('connection', function (socket) {
    socket.emit('init', 'Connected to robot');

    socket.on('keys', function (data) {
        if(data[0]){
			motorTwo.forward(data[4]);
        }else if(data[1]){
			motorTwo.backward(data[4]);
        } else {
			motorTwo.stop();
        }

        if(data[2] && !prevData[2]){
			if(timerRunning(turnTimeout)){
				clearTimeout(turnTimeout);
			}

			motorOne.forward(1);
			turnTimeout = setTimeout(()=>motorOne.forward(0.1), 75);
        }else if(data[3] && !prevData[3]){
			if(timerRunning(turnTimeout)){
				clearTimeout(turnTimeout);
			}

			motorOne.backward(1);
			turnTimeout = setTimeout(()=>motorOne.backward(0.1), 75);
        } else if((!data[2] && !data[3]) && (prevData[2] || prevData[3])) {
            var val = motorOne.getDir();

            if(timerRunning(turnTimeout)){
				clearTimeout(turnTimeout);
            }

            if(val.forward){
				motorOne.backward(0.08);
            }

            if(val.backward){
				motorOne.forward(0.08);
            }

            turnTimeout = setTimeout(()=>motorOne.stop(), 75);
        }

        prevData = data;
    });
});

server.listen(3001, function () {
	console.log('Robot API on port 3001');
});