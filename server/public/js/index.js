var socket = io();
var folders = document.getElementByClassName('folder');
var current = 0;
socket.on( 'event:ready', function( folders ){

});
socket.on( 'event:next', function(){
  current += 1;
  if( current == folder.length ) {
    current = 0;
  }
});
socket.on( 'event:current', function(){
  socket.emit( 'event:current', current );
});
