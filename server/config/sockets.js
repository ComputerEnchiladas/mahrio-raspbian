'use strict';

var io = null;

function main( server, hardware ) {
  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id); // Record the connection

    socket.emit( 'event:hello' ); // Send message exclusively to new connection

    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id ); // Record the disconnection
    });

    // TODO: Listen for a custom event
    socket.on( 'get:sensor:21', function(){
     socket.emit( 'gpio:21', true);
    });

    // Create a new `motion` hardware instance.
  //var motion = new hardware.five.Motion('GPIO21');

  // "calibrated" occurs once, at the beginning of a session,
  //motion.on("calibrated", function() {
    console.log("calibrated");
  //});

  // "motionstart" events are fired when the "calibrated"
  // proximal area is disrupted, generally by some form of movement
  //motion.on("motionstart", function() {
    console.log("motionstart");
  //});

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  //motion.on("motionend", function() {
    console.log("motionend");
  //});

  });
};

module.exports = main;
