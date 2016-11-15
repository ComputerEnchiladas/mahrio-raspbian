module.exports = function( socket, hardware ){
  socket.on('remote:input:camera', function(){
    hardware.camera.start();
  });
  socket.on('remote:camera:mode', function(mode){
    hardware.camera.setMode( mode );
  });
}