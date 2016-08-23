'use strict';

var REMOTE = '/home/pi/lircd.conf';

var lirc_node = require('lirc_node');
lirc_node.init();

// lirc_node.addListener(function(data) {
//     console.log("Received IR keypress '" + data.key + "' from remote '" + data.remote +"'");
// });
//
// lirc_node.addListener('KEY_MENU', REMOTE, function(data) {
//     console.log("Received IR keypress 'KEY_UP' from fixed LISTENER");
//     // data also has `code` and `repeat` properties from the output of `irw`
//     // The final argument after this callback is a throttle allowing you to
//     // specify to only execute this callback once every x milliseconds.
// }, 400);

module.exports = function( omx, socket ){
    lirc_node.addListener('KEY_MENU', REMOTE, function() {
        if( omx.isLoaded() ) {
            omx.stop();
        }
    }, 400);
    lirc_node.addListener('KEY_PLAYPAUSE', REMOTE, function() {
        if( omx.isLoaded() ) {
            if( omx.isPlaying() ) {
                omx.pause();
            } else {
                omx.play();
            }
        }
    }, 400);
    lirc_node.addListener('KEY_UP', REMOTE, function(){
        socket.emit('remote:input:up');
    }, 400);
    lirc_node.addListener('KEY_DOWN', REMOTE, function(){
        socket.emit('remote:input:down');
    }, 400);
    lirc_node.addListener('KEY_LEFT', REMOTE, function(){
        socket.emit('remote:input:left');
    }, 400);
    lirc_node.addListener('KEY_RIGHT', REMOTE, function(){
        socket.emit('remote:input:right');
    }, 400);
    lirc_node.addListener('KEY_ENTER', REMOTE, function(){
        socket.emit('remote:input:enter');
    }, 400);
};
