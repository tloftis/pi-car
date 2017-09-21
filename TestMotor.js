'use strict';

var Motor = function (params){
    var _this = this;
	console.log('Motor Initalized', params);
};

Motor.prototype.forward = function(num){
    var _this = this;
    console.log('Forward', num);
    _this._direct = {forward: num, backward: 0};
};

Motor.prototype.backward = function(num){
    var _this = this;
    console.log('Backward', num);
	_this._direct = {forward: 0, backward: num};
};

Motor.prototype.stop = function(key){
    var _this = this;
    console.log('Stop');
    _this._direct = {forward:0,backward:0};
};

Motor.prototype.getDir = function(){
   var _this = this;
   return _this._direct;
};

module.exports = Motor;
