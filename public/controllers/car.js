'use strict';

var messages = [],
	queueVal;

var giveSpotElm = document.getElementById('giveSpot'),
	queueElm = document.getElementById('queue'),
	camFeed = document.getElementById('cameraFeed'),
	socket = io('http://' + window.location.hostname + ':3000');

var fT = false,
	bT = false,
	rT = false,
	lT = false, 
	speed = 1;

var fTc = false,
	bTc = false,
	rTc = false,
	lTc = false;

var fTj = false,
	bTj = false,
	rTj = false,
	lTj = false;
	
var size = 150;

var joystick = new VirtualJoystick({
	container: document.getElementById('container'),
	mouseSupport: true,
	limitStickTravel: true,
	stickRadius: size
});

function updateQute (data) {
	queueVal = data;
	
	if(+data === 1){
		(queueElm || {}).innerHTML = 'You have controll!';
		giveSpotElm.style.display = 'block';
	} else {
		(queueElm || {}).innerHTML = 'Current there ' + (data === 2 ? ('is ' + --data + ' person') : ('are ' + --data + ' people')) + ' ahead of you to control the car';
		giveSpotElm.style.display = 'none';
	}
};

function giveSpot(elem){
	socket.emit('giveUp', '');
}

camFeed.src = 'http://' + window.location.hostname + ':8081/';

if(window.innerHeight/window.innerWidth > 1){
	camFeed.style.width = "100%";
} else {
	camFeed.style.height = "100%";
}

socket.on('queue', (data)=>{
	updateQute(data);
});

socket.on('init', function (data) {
	console.log(data);
});

document.onkeydown = function(evt) {
	evt = evt || window.event;
	
	var charCode = evt.keyCode || evt.which,
		charStr = String.fromCharCode(charCode).toLowerCase();
	
	if(charStr === 'w'){
		fTc = true;
		speed = 1;
	}
	
	if(charStr === 's'){
		bTc = true;
		speed = 1;
	}
	
	if(charStr === 'a'){
		lTc = true;
		speed = 1;
	}
	
	if(charStr === 'd'){
		rTc = true;
		speed = 1;
	}
};

document.onkeyup = function(evt) {
	evt = evt || window.event;
	var charCode = evt.keyCode || evt.which;
	var charStr = String.fromCharCode(charCode).toLowerCase();
	
	if(charStr === 'w'){
		fTc = false;
	}

	if(charStr === 's'){
		bTc = false;
	}

	if(charStr === 'a'){
		lTc = false;
	}

	if(charStr === 'd'){
		rTc = false;
	}
};

setInterval(function(){
	if(joystick.up()){
		fT = true;
		speed = joystick.deltaY()/-size;
	} else {
		fT = false;
	}

	if(joystick.down()){
		bT = true;
		speed = joystick.deltaY()/size;
	} else {
		bT = false;
	}

	if(joystick.left()){
		lT = true;
	} else {
		lT = false;
	}

	if(joystick.right()){
		rT = true;
	} else {
		rT = false;
	}
}, 1/30 * 1000);

window.addEventListener('load',function(){
	var gamepad;
	queueElm = document.getElementById('queue');
	updateQute(queueVal);
	
	window.addEventListener("gamepadconnected", function() {
		gamepad = navigator.getGamepads().pop();
	});

	window.addEventListener("gamepaddisconnected", function() {
		gamepad = undefined;
	});
	
	setInterval(function(){
		if(gamepad){
			if(gamepad.axes[1] < -0.2){
				fTj = true;
				speed = gamepad.axes[1]*-1;
			} else {
				fTj = false;
			}

			if(gamepad.axes[1] > 0.2){
				bTj = true;
				speed = gamepad.axes[1];
			} else {
				bTj = false;
			}

			if(gamepad.axes[0] < -0.5){
				lTj = true;
			} else {
				lTj = false;
			}

			if(gamepad.axes[0] > 0.5){
				rTj = true;
			} else {
				rTj = false;
			}
		}
	}, 1/30 * 1000);
});

setInterval(()=>{
	var values = [(fT || fTc || fTj), (bT || bTc || bTj), (lT || lTc || lTj), (rT || rTc || rTj), speed];
	socket.emit('keys', values);
}, 50);