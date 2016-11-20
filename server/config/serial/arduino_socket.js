module.exports = function( socket, hardware ) {
  socket.on('led:set:color', function( hex ){
    hardware.arduino.sendCommand( hex  );
  });
}
