'use strict';

var io = null
  , PromiseSettle = require('promise-settle');

function escapeSpaces( path ) {
  if( path ) { return path.replace(/ /g, '\\ ').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
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
      path = process.env.MEDIA_DIRECTORY + escapeSpaces( path );

      if( path[path.length-1] === '/' ) {
        path = path.substring(0, path.length - 1);
      }

      hardware.dir.getAllFiles( path )
        .then( function(files){
          files = files.split('\n').filter( function(item){ return item !== ""; });
          hardware.omx.play( files );
        });
    });
    socket.on( 'play:one:file', function( file ){
      file = process.env.MEDIA_DIRECTORY + escapeSpaces( file );
      if( hardware.omx.isLoaded() ) {
        hardware.omx.stop();
      }
      console.log('Now Playing: ', file);
      hardware.omx.play( file );
    });
  });

  return io;
}
module.exports = main;
