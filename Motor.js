'use strict';

var g = require('wiringpi-node');
g.setup('gpio');

var Motor = function (params){
    var _this = this;

var steps = 255;

_this.enablePin = params.enablePin;
    _this.fPin = params.fPin;
    _this.bPin = params.bPin;
    _this._direct = {forward: 0, backward: 0};

    g.pinMode(_this.enablePin, g.OUTPUT);
    g.pinMode(_this.fPin, g.SOFT_PWM_OUTPUT);
    g.pinMode(_this.bPin, g.SOFT_PWM_OUTPUT);

    g.digitalWrite(_this.enablePin, 0);
    g.softPwmCreate(_this.fPin, 0, steps);
    g.softPwmCreate(_this.bPin, 0, steps);
};

Motor.prototype.forward = function(num){
    var _this = this;

    if(typeof num != 'number' || isNaN(num)){
        num = 1;
    }else{
        num = +num;
    }

    if(num > 1){
        num = 1;
    }

    _this._direct = {forward: num, backward: 0};

    //Disable
    g.digitalWrite(_this.enablePin, 0);

    g.softPwmWrite(_this.bPin, 0);

    console.log(num, typeof num, (Math.ceil(num*255)));
    g.softPwmWrite(_this.fPin, Math.ceil(num*255));

    //Enable
    g.digitalWrite(_this.enablePin, 1);
};

Motor.prototype.backward = function(num){
    var _this = this;

    if(typeof num != 'number' || isNaN(num)){
        num = 1;
    }else{
        num = +num;
    }

    if(num > 1){
        num = 1;
    }

    _this._direct = {forward: 0, backward: num};

    //Disable
    g.digitalWrite(_this.enablePin, 0);

    console.log(num, typeof num, Math.floor(num*255), typeof Math.floor(num*255))

    g.softPwmWrite(_this.fPin, 0);
    g.softPwmWrite(_this.bPin, Math.floor(num*255));

    //Enable
    g.digitalWrite(_this.enablePin, 1);
};

Motor.prototype.stop = function(key){
    var _this = this;
    _this._direct = {forward:0,backward:0};
    g.digitalWrite(_this.enablePin, 0);
    g.softPwmWrite(_this.fPin, 0);
    g.softPwmWrite(_this.bPin, 0);
};

Motor.prototype.getDir = function(){
   var _this = this;
   return _this._direct;
};

module.exports = Motor;
