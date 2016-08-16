'use strict';

var VIDEODIR = '/media/pi/ROCHASMINI/';

var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi(),
  repl: false
});
var playlist;
var omx = require('omxdirector');
var exec = require('child_process').exec;
var state = 0;
var released = 1;
board.on('ready', function() {
  var child = exec("ls -1 "+VIDEODIR, function (error, stdout, stderr) {
    omx.setVideoDir( VIDEODIR );
    playlist = stdout.toString().split('\n');
    //omx.play( stdout.toString().split('\n') );
  });
  var button = new five.Button({pin: 'GPIO12', invert: true});
  button.on("hold", function() {
    console.log("hold");
    console.log( playlist );
    if( released ) {
      released = !released;
      if( !state ) {
        omx.play( playlist );
        state = !state;
      } else {
        omx.stop();
        state = !state;
      }
    }
  });

  button.on("press", function() {
    console.log("pressed");
  });

  button.on("release", function() {
    released = 1;
    console.log("released");
  });
  console.log('board ready');
});

module.exports = {board: board, five: five};
