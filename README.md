# pi-car

So, i picked up a cheap rc car at good will that had no controller and decided to make something out of it.

This has code to control 2 diffrent toys, one that is calld a "Command bot" and has two nerf dart launchers and lots of lights and even a speaker, this is setup to control that as well as the rc car.
The goal is to make a central server that can control many diffrent types of robots so that people could possible "battle" with them using just a browser to control them

The car code is the most complete as you can fully drive it using a keyboard with a web interface, or a touch screen with a web interface making it phone friendly

It is all written from scrach, not couting the libararies used, with no boiler plate making it not very user friendly or clean, but not too crazy.

The setup is using 4 soft pwm pins to control 2 motors, one to turn left and right and one to move forward and back, since it is a cheap rc car it uses a dc motor and not servo to turn, so turning is all or nothing and can't really be controlled well.

I've also added a ps3 camera onto it and using the "motion" program have created a simple low res but high refreshrate mjpeg web stream so you can drive it using a camera.

It uses a raspberry pi zero w for its logic board, a phone charging battery to power it and a buck converter also on the batt to drive the motors, and lots of hot glue to hold it together.

The motor driver is just a L293D that I've throw together with some wiring and a small heat sink, though I have a mistry motor driver on there now that has no markings on it.

It's a bit of fun to let people fight over driving it, but if you have 2 browsers on it at once, it will freak out and that needs to be addressed still

I also want to swap over to a nodejs controlled camera streaming capability

## To Run

In order to run the code, start the server (node server.js) and point it at the cars IP, then start the car (node car.js)

I don't think anyone will be intrested in this, so unless asked otherwise I won't get more specific than that.
