'use strict';

var io = null
  , multipleFiles = false
  , savedFiles = []
  , PromiseSettle = require('promise-settle');

function escapeSpaces( path ) {
  if( path ) { return path.replace(/ /g, '\\ '); }
  else { return ''; }
}

function main( server, hardware, remote ) {
  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id); // Record the connection

    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id ); // Record the disconnection
    });

    socket.on( 'get:media:dir', function( path ){
      path = process.env.MEDIA_DIRECTORY + escapeSpaces( path );

      hardware.dir.getDirectories( path )
        .then( function(dir){
          socket.emit( 'media:dir:list', dir);
        });
    });
    socket.on( 'get:media:files', function( path ){
      path = process.env.MEDIA_DIRECTORY + escapeSpaces( path );

      hardware.dir.getFiles( path )
        .then( function(files){
          socket.emit( 'media:files:list', files);
        });
    });
    socket.on( 'get:media:all', function(path){
      path = process.env.MEDIA_DIRECTORY + escapeSpaces( path );

      PromiseSettle( [hardware.dir.getFiles( path ), hardware.dir.getDirectories( path )] )
        .then( function( res ) {
          socket.emit( 'media:all:list', {
            files: res[0].isFulfilled() ? res[0].value() : '',
            directories: res[1].isFulfilled() ? res[1].value() : ''
          });
        })
    });
    socket.on( 'play:all:dir', function( path ){
      multipleFiles = true;
      path = process.env.MEDIA_DIRECTORY + escapeSpaces( path );

      if( path[path.length-1] === '/' ) {
        path = path.substring(0, path.length - 1);
      }

      hardware.dir.getAllFiles( path )
        .then( function(files){
          files = files.split('\n').filter( function(item){ return item !== ""; });
	  savedFiles = files;
          hardware.omx.play( savedFiles );
        });
    });
    socket.on( 'play:one:file', function( file ){
      multipleFiles = false;
      file = process.env.MEDIA_DIRECTORY + file;
      if( hardware.omx.isLoaded() ) {
        hardware.omx.stop();
	setTimeout( function(){ hardware.omx.play( file ); }, 400 );
      } else {
	console.log('Now Playing: ', file);
        hardware.omx.play( file );
      }
    });



    socket.on('remote:input:up', function(){
      remote.emit('remote:input:up');
    });
    socket.on('remote:input:left', function(){
      if( multipleFiles && savedFiles.length && hardware.omx.isLoaded() ) {
        hardware.omx.stop();
	setTimeout( function(){
	  var last = savedFiles.pop();
	  savedFiles.unshift( last );
	  hardware.omx.play( savedFiles, {audioOutput: 'both', loop: true});
	}, 400); 
      }
      remote.emit('remote:input:left');
    });
    socket.on('remote:input:enter', function(){
      remote.emit('remote:input:enter');
    });
    socket.on('remote:input:right', function(){
      if( multipleFiles && savedFiles.length && hardware.omx.isLoaded() ) {
        hardware.omx.stop();
	setTimeout( function(){
	  var first = savedFiles.shift();
	  savedFiles.push( first );
	  hardware.omx.play( savedFiles, {audioOutput: 'both', loop: true});
	}, 400); 
      }

      remote.emit('remote:input:right');
    });
    socket.on('remote:input:down', function(){
      remote.emit('remote:input:down');
    });
    socket.on('remote:input:menu', function(){
      if( hardware.omx.isLoaded() ) {
        hardware.omx.stop();
	multipleFiles = false;
      }
    });
    socket.on('remote:input:playpause', function(){
      if( hardware.omx.isLoaded() ) {
        if( hardware.omx.isPlaying() ) {
          hardware.omx.pause();
        } else {
          hardware.omx.play();
        }
      }
    });


    require('./raspicam/socket_handler')( socket, hardware );
    require('./serial/arduino_socket')( socket, hardware );	
    
  });

  hardware.camera.setIOSockets( io );
  hardware.arduino.setIOSockets( io );
  hardware.omx.on('next', function(file){
    if( file ) { var first = savedFiles.shift(); savedFiles.push( first ); }
  });

  return io;
}
module.exports = main;
