'use strict';

var REMOTE = '/home/pi/lircd.conf';

var lirc_node = require('lirc_node');
lirc_node.init();

module.exports = function( omx, socket ){
    lirc_node.addListener('KEY_MENU', REMOTE, function() {
        if( omx.isLoaded() ) {
            omx.stop();
        }
        socket.emit('remote:input:menu');
    }, 400);
    lirc_node.addListener('KEY_PLAYPAUSE', REMOTE, function() {
        if( omx.isLoaded() ) {
            if( omx.isPlaying() ) {
                omx.pause();
            } else {
                omx.play();
            }
        }
        socket.emit('remote:input:playpause');
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
