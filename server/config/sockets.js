'use strict';

var io = null;

function escapeSpaces( path ) {
  if( path ) { return path.replace(' ', '\\ '); }
  else { return ''; }
}

function main( server, hardware ) {
  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id); // Record the connection

    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id ); // Record the disconnection
    });

    socket.on( 'get:media:dir', function( path ){
      path = escapeSpaces( path );

      hardware.dir.getDirectories( process.env.MEDIA_DIRECTORY + path)
        .then( function(dir){
          socket.emit( 'media:dir:list', dir);
        });
    });
    socket.on( 'get:media:files', function( path ){
      path = escapeSpaces( path );

      hardware.dir.getFiles( process.env.MEDIA_DIRECTORY + path)
          .then( function(files){
            socket.emit( 'media:files:list', files);
          });
    });
    socket.on( 'play:all:dir', function( path ){
      path = escapeSpaces( path );
      path = process.env.MEDIA_DIRECTORY + path;
      if( path[path.length-1] === '/' ) {
        path = path.substring(0, path.length - 1);
      }

      hardware.dir.getAllFiles( path )
          .then( function(files){
            files = files.split('\n').filter( function(item){ return item !== ""; });
            console.log( files );
            //hardware.omx.play( files );
          });
    });
  });
}
module.exports = main;
